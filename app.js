// --- 1. INICIALIZAÇÃO E SEGURANÇA ---
// Puxa as credenciais do seu arquivo config.js (que não vai para o GitHub)
const supabaseUrl = CONFIG.SUPABASE_URL;
const supabaseKey = CONFIG.SUPABASE_KEY;
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

const GEMINI_KEY = CONFIG.GEMINI_KEY;

// O estado agora começa vazio e será preenchido pelo Supabase
let state = {
    profiles: [],
    schedule: []
};

// Quando a página carrega, decide o que buscar e renderizar
document.addEventListener('DOMContentLoaded', async () => {
    await carregarPerfisDoBanco();
    
    // Se estiver na página inicial (index.html)
    if (document.getElementById('schedule-container')) {
        await carregarCardapioDoBanco();
        renderIndex();
        renderSimpleWeekly();
        setupTabs();
    }
    
    // Se estiver na página de perfis (perfil.html)
    if (document.getElementById('profiles-container')) {
        renderProfiles();
    }
});

// --- 2. COMUNICAÇÃO COM O BANCO DE DADOS (SUPABASE) ---

async function carregarPerfisDoBanco() {
    // Busca os perfis
    const { data: perfis, error: errPerfis } = await supabase.from('profiles').select('*');
    // Busca as preferências associadas
    const { data: preferencias, error: errPrefs } = await supabase.from('user_preferences').select('*');
    
    if (perfis) {
        // Monta o objeto agrupando o perfil com suas preferências
        state.profiles = perfis.map(p => {
            const userPrefs = preferencias ? preferencias.filter(pref => pref.user_id === p.id).map(pref => pref.preference) : [];
            return {
                id: p.id,
                name: p.name,
                goal: p.goal || 'Objetivo não definido',
                preferences: userPrefs,
                restrictions: [] // As restrições complexas ficam para uma V2 devido à relação com a tabela de ingredientes
            };
        });
    }
}

async function carregarCardapioDoBanco() {
    // Busca as refeições geradas (Simulação de integração para leitura)
    const { data: refeicoes, error } = await supabase.from('meals').select('*');
    if (refeicoes) {
        state.schedule = refeicoes;
    }
}

async function saveProfile() {
    const id = document.getElementById('edit-id').value;
    const goal = document.getElementById('edit-goal').value;
    
    const rawPrefs = document.getElementById('edit-pref').value
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);

    const btn = document.querySelector('#edit-modal .btn');
    const textoOriginal = btn.innerText;
    btn.innerText = "Salvando no banco...";

    try {
        // Atualiza o Objetivo
        const { error: errorProfile } = await supabase
            .from('profiles')
            .update({ goal: goal })
            .eq('id', id);

        if (errorProfile) throw errorProfile;

        // Atualiza as Preferências (Apaga as antigas e insere as novas)
        await supabase.from('user_preferences').delete().eq('user_id', id);

        if (rawPrefs.length > 0) {
            const prefsToInsert = rawPrefs.map(pref => ({ user_id: id, preference: pref }));
            const { error: errorPrefs } = await supabase.from('user_preferences').insert(prefsToInsert);
            if (errorPrefs) throw errorPrefs;
        }

        alert("Perfil e preferências atualizados com sucesso!");
        closeModal();
        
        // Recarrega do banco e atualiza a tela
        await carregarPerfisDoBanco(); 
        renderProfiles();

    } catch (erro) {
        console.error("Erro no Supabase:", erro);
        alert("Erro ao salvar: " + erro.message);
    } finally {
        btn.innerText = textoOriginal;
    }
}

// --- 3. INTELIGÊNCIA ARTIFICIAL (GEMINI API) ---

async function gerarCardapioComGemini() {
    const btn = document.querySelector('.card .btn');
    const textoOriginal = btn.innerText;
    btn.innerText = "Pensando e gerando o cardápio... (aguarde)";
    
    // Constrói o contexto com base no que está salvo no banco
    let perfisTexto = state.profiles.map(p => {
        let prefs = p.preferences.length > 0 ? p.preferences.join(', ') : 'Nenhuma específica';
        return `- ${p.name}: Objetivo é ${p.goal}. Gostos: ${prefs}.`;
    }).join('\n');

    const promptText = `
    Você é um nutricionista organizando um cardápio semanal para 3 moradores.
    Perfis reais do banco de dados:
    ${perfisTexto}

    Regras Absolutas:
    1. O almoço é a refeição principal (panela única para todos, adaptada em porções na mesa).
    2. O jantar DEVE ser sempre leve e descontraído (ex: sopas, crepiocas, lanches de frigideira).
    3. Retorne EXATAMENTE UM JSON válido e puro (sem blocos de código ou markdown), com o cardápio de Segunda a Domingo.

    Formato exato do JSON esperado:
    {
      "semana": [
        {
          "dia": "Segunda-feira",
          "almoco": { "nome": "...", "instrucoes": "..." },
          "jantar": { "nome": "...", "instrucoes": "..." }
        }
      ]
    }
    `;

    try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;
        const resposta = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
        });

        const dados = await resposta.json();
        let jsonString = dados.candidates[0].content.parts[0].text;
        
        // Limpa a formatação caso a IA devolva com markdown ```json
        jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
        const cardapioGerado = JSON.parse(jsonString);

        // Salva as refeições no banco
        for (const dia of cardapioGerado.semana) {
            await supabase.from('meals').insert([
                { name: dia.almoco.nome, base_instructions: dia.almoco.instrucoes, meal_type: 'Almoço' },
                { name: dia.jantar.nome, base_instructions: dia.jantar.instrucoes, meal_type: 'Jantar' }
            ]);
        }

        alert("Cardápio gerado pela IA e salvo no banco de dados com sucesso!");
        btn.innerText = textoOriginal;
        
    } catch (erro) {
        console.error(erro);
        alert("Erro ao processar a inteligência artificial. Verifique o console.");
        btn.innerText = textoOriginal;
    }
}

// --- 4. RENDERIZAÇÃO DA INTERFACE (UI) ---

function setupTabs() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const viewSections = document.querySelectorAll('.view-section');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            navButtons.forEach(b => b.classList.remove('active'));
            viewSections.forEach(v => v.style.display = 'none');
            
            btn.classList.add('active');
            const viewId = `${btn.dataset.view}-view`;
            document.getElementById(viewId).style.display = 'block';
        });
    });
}

function renderIndex() {
    const scheduleContainer = document.getElementById('schedule-container');
    if (!scheduleContainer) return;
    
    // Se não tiver nada no banco ainda, exibe um aviso
    if (state.schedule.length === 0) {
        scheduleContainer.innerHTML = '<p style="color: var(--text-secondary);">Nenhuma refeição gerada ainda. Vá ao Dashboard e teste a IA.</p>';
        return;
    }

    // Renderização simplificada das refeições lidas do banco
    scheduleContainer.innerHTML = '';
    state.schedule.forEach(meal => {
        scheduleContainer.innerHTML += `
            <div class="timeline-card" style="margin-bottom: 12px;">
                <span class="meal-type">${meal.meal_type}</span>
                <h4 class="meal-title">${meal.name}</h4>
                <p class="meal-instructions">${meal.base_instructions}</p>
            </div>
        `;
    });
}

function renderSimpleWeekly() {
    const container = document.getElementById('simple-weekly-container');
    if (!container) return;
    
    container.innerHTML = '';
    const dias = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
    
    dias.forEach(dia => {
        container.innerHTML += `
            <div class="card" style="padding: 16px;">
                <h3 style="border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 12px; font-size: 16px;">${dia}</h3>
                <p style="font-size: 14px;"><strong>☀️ Almoço:</strong> ${state.schedule.length > 0 ? 'Ver Detalhes' : 'A definir'}</p>
                <p style="font-size: 14px; margin-top: 6px;"><strong>🌙 Jantar:</strong> ${state.schedule.length > 0 ? 'Ver Detalhes' : 'A definir'}</p>
            </div>
        `;
    });
}

function renderProfiles() {
    const profilesContainer = document.getElementById('profiles-container');
    profilesContainer.innerHTML = ''; 
    
    state.profiles.forEach(profile => {
        const prefTags = profile.preferences.length > 0 
            ? profile.preferences.map(p => `<span class="tag">${p}</span>`).join('') 
            : '<span class="tag">Nenhuma definida</span>';
            
        profilesContainer.innerHTML += `
            <div class="card">
                <h3 style="font-size: 20px; margin-bottom: 4px;">${profile.name}</h3>
                <p style="color: var(--accent); font-weight: 600; font-size: 14px; margin-bottom: 16px;">Objetivo: ${profile.goal}</p>
                
                <div style="margin-bottom: 16px;">
                    <strong style="display: block; font-size: 14px; margin-bottom: 4px;">Preferências:</strong>
                    ${prefTags}
                </div>
                
                <button class="btn" onclick="openEditModal('${profile.id}')" style="width: 100%; margin-top: 12px; background-color: var(--bg-color); color: var(--text-primary); border: 1px solid var(--border-color);">Editar ${profile.name}</button>
            </div>
        `;
    });
}

function openEditModal(userId) {
    const profile = state.profiles.find(p => p.id === userId);
    
    document.getElementById('edit-id').value = profile.id;
    document.getElementById('modal-title').innerText = `Editar: ${profile.name}`;
    document.getElementById('edit-goal').value = profile.goal;
    document.getElementById('edit-pref').value = profile.preferences.join(', ');

    document.getElementById('edit-overlay').classList.add('active');
    document.getElementById('edit-modal').classList.add('active');
}

function closeModal() {
    document.getElementById('edit-overlay').classList.remove('active');
    document.getElementById('edit-modal').classList.remove('active');
}
