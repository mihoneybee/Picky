# Picky - Planejamento Alimentar Inteligente Coletivo

O **Picky** é um sistema web responsivo e dinâmico projetado para resolver a logística de alimentação em casas multifamiliares onde os moradores possuem objetivos nutricionais complementares e diferentes, mas compartilham a mesma cozinha e a mesma lista de compras.

## 🚀 Funcionalidades

- **Seleção de Perfil**: Alternância instantânea entre os moradores da casa, adaptando toda a interface, horários e porções específicas.
- **Painel do Dia (Timeline)**: Cronograma diário organizado cronologicamente, exibindo de forma clara o que é refeição compartilhada e o que é lanche individual.
- **Visualização Semanal**: Grade completa de segunda a domingo para acompanhar o planejamento macro da casa.
- **Lista de Compras Unificada**: Agregação automática de todas as quantidades e ingredientes necessários.

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica.
- **CSS3**: Layout baseado em Grid e Flexbox, responsivo (Mobile First).
- **JavaScript**: Manipulação de estado local simulando o banco de dados e lógicas de montagem de prato ("Refeições Modulares").

## 🧠 Lógica de Refeições Modulares
O app foi estruturado para receber o retorno da **API do Gemini**. Uma única base proteica e saudável é preparada para a casa inteira (ex: Estrogonoff de Patinho), enquanto os acompanhamentos e porções são adaptados de forma individual na mesa para atender as metas de cada um.
