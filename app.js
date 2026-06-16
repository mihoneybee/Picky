// Banco de dados simulado com os jantares mais leves e descontraídos
const state = {
    profiles: [
        { 
            id: 'mel', name: 'Mel', 
            goal: 'Emagrecimento / Adequação de IMC (165cm, 87kg)',
            preferences: ['Comidas leves à noite', 'Carnes específicas', 'Frutas vermelhas'],
            restrictions: ['Excesso de carboidratos simples', 'Gorduras saturadas']
        },
        { 
            id: 'gean', name: 'Gean', 
            goal: 'Hipertrofia / Firmeza de Pele (Foco Proteico)',
            preferences: ['Creme de leite', 'Batata palha', 'Alta ingestão de carne e frango'],
            restrictions: ['Refeições com baixa proteína']
        },
        { 
            id: 'nicole', name: 'Nicole', 
            goal: 'Manutenção / Alta Seletividade',
            preferences: ['Creme de leite', 'Batata palha', 'Pratos tradicionais saborosos'],
            restrictions: ['Vegetais amargos', 'Texturas estranhas na carne']
        }
    ],
    schedule: [
        {
            day: 'Segunda-feira',
            lunch: {
                name: 'Estrogonoff de Patinho Magro',
                instructions: 'Panela única: Patinho em iscas com creme de leite leve para garantir o sabor sem pesar a base.',
                portions: {
                    mel: '130g de estrogonoff + 2 colheres de arroz + salada de folhas.',
                    gean: '200g de estrogonoff + bastante arroz branco + batata doce.',
                    nicole: 'Estrogonoff com arroz branco e batata palha por cima.'
                }
            },
            dinner: {
                name: 'Noite da Crepioca/Tapioca Recheada',
                instructions: 'Base: Gomas prontas na frigideira com recheio de frango desfiado temperado. Refeição leve e descontraída.',
                portions: {
                    mel: '1 crepioca fina com bastante recheio de frango e salada ao lado.',
                    gean: '2 tapiocas grossas bem recheadas com frango e 2 ovos extras.',
                    nicole: '1 tapioca com frango desfiado e bastante queijo/requeijão derretido.'
                }
            }
        },
        {
            day: 'Terça-feira',
            lunch: {
                name: 'Iscas de Carne Acebolada com Purê',
                instructions: 'Panela única: Filé de patinho limpo e purê de mandioca cremoso.',
                portions: {
                    mel: 'Carne acebolada + brócolis (evitar excesso do purê).',
                    gean: 'Porção grande de carne + purê de mandioca abundante.',
                    nicole: 'Carne acebolada limpa + purê com queijo misturado.'
                }
            },
            dinner: {
                name: 'Sopa Cremosa de Abóbora com Carne',
                instructions: 'Base: Caldo leve de abóbora batida acompanhado de carne desfiada. Ideal para comer juntos sem pesar.',
                portions: {
                    mel: 'Porção normal de sopa (sem pães de acompanhamento).',
                    gean: 'Tigela grande acompanhada de 2 fatias de pão integral e ovos.',
                    nicole: 'Sopa acompanhada de croutons de pão e queijo parmesão ralado na hora.'
                }
            }
        }
    ],
    shoppingList: {
        'Açougue / Proteínas': ['Patinho moído ou em iscas (2.5 kg)', 'Peito de frango desfiado (3.0 kg)', 'Ovos (3 dúzias)', 'Whey Protein (Gean)'],
        'Hortifruti / Legumes': ['Abóbora Cabotiá (1 unidade)', 'Mandioca limpa (1.0 kg)', 'Mix de folhas verdes', 'Brócolis', 'Cebola e Alho'],
        'Laticínios / Frios': ['Creme de leite leve (4 caixas)', 'Requeijão light', 'Queijo Muçarela/Parmesão (Nicole)', 'Goma de Tapioca'],
        'Mercearia / Secos': ['Arroz integral', 'Arroz branco', 'Batata palha (Nicole)', 'Croutons/Pão integral']
    }
};

// Inicialização baseada na página atual
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('schedule-container')) renderIndex();
    if (document.getElementById('profiles-container')) renderProfiles();
});

// Funções da página index.html
function renderIndex() {
    const scheduleContainer = document.getElementById('schedule-container');
    const shoppingContainer = document.getElementById('shopping-container');

    // Renderizar Cronograma
    state.schedule.forEach(day => {
        let html = `<div class="timeline-card">
            <h3 style="margin-bottom: 16px; border-bottom: 2px solid var(--bg-color); padding-bottom: 8px;">${day.day}</h3>`;
        
        // Almoço
        html += `
            <div style="margin-bottom: 20px;">
                <span class="meal-type">☀️ Almoço</span>
                <h4 class="meal-title">${day.lunch.name}</h4>
                <p class="meal-instructions"><strong>A Base:</strong> ${day.lunch.instructions}</p>
                <div class="portions-grid">
                    <div class="portion-box"><strong>Mel:</strong> ${day.lunch.portions.mel}</div>
                    <div class="portion-box"><strong>Gean:</strong> ${day.lunch.portions.gean}</div>
                    <div class="portion-box"><strong>Nicole:</strong> ${day.lunch.portions.nicole}</div>
                </div>
            </div>`;
            
        // Jantar (Leve)
        html += `
            <div>
                <span class="meal-type" style="color: #6366f1;">🌙 Jantar Leve / Lanche</span>
                <h4 class="meal-title">${day.dinner.name}</h4>
                <p class="meal-instructions"><strong>A Base:</strong> ${day.dinner.instructions}</p>
                <div class="portions-grid">
                    <div class="portion-box"><strong>Mel:</strong> ${day.dinner.portions.mel}</div>
                    <div class="portion-box"><strong>Gean:</strong> ${day.dinner.portions.gean}</div>
                    <div class="portion-box"><strong>Nicole:</strong> ${day.dinner.portions.nicole}</div>
                </div>
            </div>
        </div>`;
        
        scheduleContainer.innerHTML += html;
    });

    // Renderizar Lista de Compras
    for (const [category, items] of Object.entries(state.shoppingList)) {
        let itemsHtml = items.map(item => `<li style="margin-bottom: 6px; margin-left: 20px;">${item}</li>`).join('');
        shoppingContainer.innerHTML += `
            <div style="margin-bottom: 20px;">
                <h4 style="text-transform: uppercase; font-size: 14px; color: var(--text-secondary); margin-bottom: 10px;">${category}</h4>
                <ul style="list-style-type: square; color: var(--text-primary); font-size: 15px;">
                    ${itemsHtml}
                </ul>
            </div>
        `;
    }
}

// --- FUNÇÕES DA PÁGINA PERFIL.HTML ---
function renderProfiles() {
    const profilesContainer = document.getElementById('profiles-container');
    profilesContainer.innerHTML = ''; // Limpa antes de re-renderizar
    
    state.profiles.forEach(profile => {
        const prefTags = profile.preferences.map(p => `<span class="tag">${p}</span>`).join('');
        const restTags = profile.restrictions.map(r => `<span class="tag danger">${r}</span>`).join('');
        
        profilesContainer.innerHTML += `
            <div class="card">
                <h3 style="font-size: 20px; margin-bottom: 4px;">${profile.name}</h3>
                <p style="color: var(--accent); font-weight: 600; font-size: 14px; margin-bottom: 16px;">Objetivo: ${profile.goal}</p>
                
                <div style="margin-bottom: 16px;">
                    <strong style="display: block; font-size: 14px; margin-bottom: 4px;">Gostos / Preferências:</strong>
                    ${prefTags || '<span class="tag">Nenhuma</span>'}
                </div>
                
                <div>
                    <strong style="display: block; font-size: 14px; margin-bottom: 4px;">Restrições / Vetos:</strong>
                    ${restTags || '<span class="tag">Nenhuma</span>'}
                </div>
                
                <button class="btn" onclick="openEditModal('${profile.id}')" style="width: 100%; margin-top: 24px; background-color: var(--bg-color); color: var(--text-primary); border: 1px solid var(--border-color);">Editar ${profile.name}</button>
            </div>
        `;
    });
}

// Lógica do Modal de Edição
function openEditModal(userId) {
    const profile = state.profiles.find(p => p.id === userId);
    
    // Preenche os campos do formulário
    document.getElementById('edit-id').value = profile.id;
    document.getElementById('modal-title').innerText = `Editar: ${profile.name}`;
    document.getElementById('edit-goal').value = profile.goal;
    document.getElementById('edit-pref').value = profile.preferences.join(', ');
    document.getElementById('edit-rest').value = profile.restrictions.join(', ');

    // Abre o modal
    document.getElementById('edit-overlay').classList.add('active');
    document.getElementById('edit-modal').classList.add('active');
}

function closeModal() {
    document.getElementById('edit-overlay').classList.remove('active');
    document.getElementById('edit-modal').classList.remove('active');
}

function saveProfile() {
    const id = document.getElementById('edit-id').value;
    const profileIndex = state.profiles.findIndex(p => p.id === id);
    
    // Transforma a string separada por vírgulas de volta em um array limpo
    const rawPrefs = document.getElementById('edit-pref').value.split(',').map(item => item.trim()).filter(Boolean);
    const rawRests = document.getElementById('edit-rest').value.split(',').map(item => item.trim()).filter(Boolean);

    // Atualiza o estado global
    state.profiles[profileIndex].goal = document.getElementById('edit-goal').value;
    state.profiles[profileIndex].preferences = rawPrefs;
    state.profiles[profileIndex].restrictions = rawRests;

    closeModal();
    renderProfiles(); // Atualiza a tela imediatamente
    
    // Aqui no futuro você colocará a chamada: await supabase.from('profiles').update({...})
}

// --- INTEGRAÇÃO DE API (Preparação para o dashboard.html) ---

// 1. Conexão Supabase
const SUPABASE_URL = 'https://omdsuzrlrcnkjohqudzw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_[SUA_CHAVE_COMPLETA_AQUI]';
// Para usar o client no JS puro, você adicionará via CDN no HTML:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
// E iniciará assim: const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- FUNÇÕES DA PÁGINA PERFIL.HTML ---
function renderProfiles() {
    const profilesContainer = document.getElementById('profiles-container');
    profilesContainer.innerHTML = ''; // Limpa antes de re-renderizar
    
    state.profiles.forEach(profile => {
        const prefTags = profile.preferences.map(p => `<span class="tag">${p}</span>`).join('');
        const restTags = profile.restrictions.map(r => `<span class="tag danger">${r}</span>`).join('');
        
        profilesContainer.innerHTML += `
            <div class="card">
                <h3 style="font-size: 20px; margin-bottom: 4px;">${profile.name}</h3>
                <p style="color: var(--accent); font-weight: 600; font-size: 14px; margin-bottom: 16px;">Objetivo: ${profile.goal}</p>
                
                <div style="margin-bottom: 16px;">
                    <strong style="display: block; font-size: 14px; margin-bottom: 4px;">Gostos / Preferências:</strong>
                    ${prefTags || '<span class="tag">Nenhuma</span>'}
                </div>
                
                <div>
                    <strong style="display: block; font-size: 14px; margin-bottom: 4px;">Restrições / Vetos:</strong>
                    ${restTags || '<span class="tag">Nenhuma</span>'}
                </div>
                
                <button class="btn" onclick="openEditModal('${profile.id}')" style="width: 100%; margin-top: 24px; background-color: var(--bg-color); color: var(--text-primary); border: 1px solid var(--border-color);">Editar ${profile.name}</button>
            </div>
        `;
    });
}

// Lógica do Modal de Edição
function openEditModal(userId) {
    const profile = state.profiles.find(p => p.id === userId);
    
    // Preenche os campos do formulário
    document.getElementById('edit-id').value = profile.id;
    document.getElementById('modal-title').innerText = `Editar: ${profile.name}`;
    document.getElementById('edit-goal').value = profile.goal;
    document.getElementById('edit-pref').value = profile.preferences.join(', ');
    document.getElementById('edit-rest').value = profile.restrictions.join(', ');

    // Abre o modal
    document.getElementById('edit-overlay').classList.add('active');
    document.getElementById('edit-modal').classList.add('active');
}

function closeModal() {
    document.getElementById('edit-overlay').classList.remove('active');
    document.getElementById('edit-modal').classList.remove('active');
}

function saveProfile() {
    const id = document.getElementById('edit-id').value;
    const profileIndex = state.profiles.findIndex(p => p.id === id);
    
    // Transforma a string separada por vírgulas de volta em um array limpo
    const rawPrefs = document.getElementById('edit-pref').value.split(',').map(item => item.trim()).filter(Boolean);
    const rawRests = document.getElementById('edit-rest').value.split(',').map(item => item.trim()).filter(Boolean);

    // Atualiza o estado global
    state.profiles[profileIndex].goal = document.getElementById('edit-goal').value;
    state.profiles[profileIndex].preferences = rawPrefs;
    state.profiles[profileIndex].restrictions = rawRests;

    closeModal();
    renderProfiles(); // Atualiza a tela imediatamente
    
    // Aqui no futuro você colocará a chamada: await supabase.from('profiles').update({...})
}

// --- INTEGRAÇÃO DE API (Preparação para o dashboard.html) ---

// 1. Conexão Supabase
const SUPABASE_URL = 'https://omdsuzrlrcnkjohqudzw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_e6mW7MwJ_qrzyfK6UyUyug_6-DVG3Gx';
// Para usar o client no JS puro, você adicionará via CDN no HTML:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
// E iniciará assim: const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Chamada Inteligente para a API do Gemini (Baseado no seu cURL)
async function gerarCardapioComGemini() {
    const GEMINI_KEY = 'AQ.Ab8RN6L7FRu-FPjdVCGz2Ng50v4BXhzaHaE63siejlQ2SLoPBQ';
    // O ideal é usar a v1beta e enviar a chave como parâmetro na URL ao invés de Header
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;

    const promptText = `Crie um almoço com base no sistema Picky. A Mel quer emagrecer, o Gean hipertrofia, e a Nicole é seletiva. Me dê um JSON de resposta com a receita base e a porção de cada um.`;

    try {
        const resposta = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: promptText }]
                }]
            })
        });

        const dados = await resposta.json();
        console.log("Resposta da Inteligência Artificial:", dados.candidates[0].content.parts[0].text);
        alert("Teste do Gemini concluído! Verifique o console do navegador.");
        
    } catch (erro) {
        console.error("Falha ao contatar a API do Google:", erro);
    }
}
