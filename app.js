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

// Funções da página perfil.html
function renderProfiles() {
    const profilesContainer = document.getElementById('profiles-container');
    
    state.profiles.forEach(profile => {
        const prefTags = profile.preferences.map(p => `<span class="tag">${p}</span>`).join('');
        const restTags = profile.restrictions.map(r => `<span class="tag danger">${r}</span>`).join('');
        
        profilesContainer.innerHTML += `
            <div class="card">
                <h3 style="font-size: 20px; margin-bottom: 4px;">${profile.name}</h3>
                <p style="color: var(--accent); font-weight: 600; font-size: 14px; margin-bottom: 16px;">Objetivo: ${profile.goal}</p>
                
                <div style="margin-bottom: 16px;">
                    <strong style="display: block; font-size: 14px; margin-bottom: 4px;">Gostos / Preferências:</strong>
                    ${prefTags}
                </div>
                
                <div>
                    <strong style="display: block; font-size: 14px; margin-bottom: 4px;">Restrições / Vetos:</strong>
                    ${restTags}
                </div>
                
                <button class="btn" style="width: 100%; margin-top: 24px; background-color: var(--bg-color); color: var(--text-primary); border: 1px solid var(--border-color);">Editar Perfil</button>
            </div>
        `;
    });
}
