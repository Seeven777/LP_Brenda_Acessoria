# Brenda Assessoria — Landing Page

Landing page comercial independente para serviços de implantação, configuração, personalização e acompanhamento da plataforma **Brendi** e da IA **Brenda**.

## Como executar
Site estático: abra index.html num servidor HTTP ou publique a pasta na Vercel. Não precisa de npm, Node, API paga ou etapa de build.

## Configuração obrigatória antes do lançamento comercial
Abra **config.js** e preencha **whatsAppNumber** com o telefone comercial completo (código do país + DDD + número, somente dígitos), como "5511999999999".

O formulário abre o WhatsApp com uma mensagem pré-preenchida **apenas quando** esse número estiver configurado. Sem ele, a página opera em modo de demonstração e informa claramente que nada foi enviado.

## Arquivos
- index.html: semântica, conteúdo, metadados SEO e formulário.
- styles.css: design responsivo, animações e acessibilidade.
- script.js: interações, narrativa por rolagem, simulador e formulário.
- config.js: WhatsApp de atendimento.
- favicon.svg / og-image.svg: identidade visual.

## Atenção comercial
- Este site é de **assessoria independente**, não um site oficial da Brendi.
- Não apresenta depoimentos fictícios ou ganhos garantidos.
- O simulador calcula o tempo dedicado a atendimentos repetitivos, **não** promete economia real.
- Custos da plataforma Brendi, eventuais anúncios e serviços de assessoria devem ser informados separadamente na proposta.
- As imagens são referências de banco de imagens Unsplash e as interfaces são demonstrações ilustrativas.
- É aconselhável substituir fotografias genéricas por material próprio e integrar analytics / política de privacidade antes de campanhas pagas.

## Publicação
Conecte este repositório à Vercel com Framework Preset = Other, Root Directory = / e sem build command. O arquivo index.html é servido diretamente. Alterações na branch main entram automaticamente em produção quando a integração Git estiver ativa.

## Testes sugeridos
Navegação desktop/mobile, modal (abrir/fechar), formulário com validação, simulador, passo a passo por rolagem, redução de movimento e estado do WhatsApp antes/depois da configuração.
