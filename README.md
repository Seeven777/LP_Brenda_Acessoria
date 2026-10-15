# Brenda Assessoria — LP V5

Landing page para assessoria independente de implantação da plataforma Brendi e IA Brenda.

## Páginas
Produção: https://lpbrendaacessoria.vercel.app
Portfólio: https://seeven-lp.vercel.app
Exemplos de cardápios: https://menu.brendi.com.br/sabor-do-sul-delivery e https://menu.brendi.com.br/gssdelivery

## Alterações V5
- Mensagem direta, menos texto e seções de conversão concentradas.
- Visual premium responsivo sem prender o scroll no celular.
- Oito Reels informados pelo proprietário, incorporados no player oficial do Instagram dentro do site após o clique. Alternativa abre publicação original quando a incorporação estiver bloqueada. Reprodutibilidade depende de privacidade, login, bloqueios e disponibilidade do Instagram.
- Três benefícios principais, exemplos reais de cardápios, jornada compacta e quiz de cinco perguntas.
- CTA único: abre formulário, prepara mensagem, usuário clica em Enviar pelo WhatsApp. Sem popup automático.
- Contato: `config.js` (+55 11 92062-6850).
- Testes automatizados Playwright em desktop e mobile: `tests/smoke.mjs`.
- Demostrações audiovisuais originais da Brendi: não re-hospedar sem autorização escrita conforme https://brendi.com.br/termos-de-uso. Linkar ou incorporar apenas com fonte verificável e permissão correspondente. Nossa jornada é ilustrativa.
- A assinatura Brendi e serviço independente de assessoria são contratações distintas. Nenhum resultado é garantido.

## V5.1 — vídeos e capas oficiais
- 3 tutoriais identificados no canal YouTube da Brendi e incorporados por iframe `youtube-nocookie.com`, carregados apenas por clique: Gestor de Pedidos (`TBF1w3cGw2o`), Visão Geral de Tráfego Pago (`3RmchouVn54`), Configuração Final de Tráfego Pago (`8D5k3VpTiVo`).
- 8 Reels: os cartões passam a carregar previews oficiais de `instagram.com/reel/{shortcode}/embed/` dentro da área da capa. Nada é baixado ou re-hospedado. É um fallback progressivo: em contas restritas, com login exigido ou navegador com bloqueios, permanece a capa gráfica e o visitante pode clicar para assistir/abrir original.
- Previews só iniciam ao se aproximarem da área visível; player maior abre sob demanda e para quando fecha.
- Documentação da API oEmbed da Meta alterou disponibilidade de `thumbnail_url` em novembro de 2025. Por isso não dependemos desse campo nem inventamos fotos dos Reels.
- Respeitar direitos do material oficial da Brendi: demonstrativos do YouTube são incorporados pelos players da editora, não copiados ao repositório.

## V6 — experiência Brenda em ação
- Refatoração exclusiva da seção `#brenda-em-acao` com seis cenários: atendimento natural 24h, interpretação de áudio/imagem, sugestões e montagem de pedido, pagamento Pix/cartão, gestor, recompra/fidelização.
- Capacidade de interpretar áudio recebido, imagens e figurinhas foi verificada na documentação de marketing oficial: https://brendi.com.br/atendimento-virtual e https://brendi.com.br/delivery-pelo-whatsapp/.
- Narração é exemplo produzido no próprio navegador via SpeechSynthesis após clique, não é voz da Brenda, nem gravação real. Transcrição visível e fallback para dispositivos sem TTS.
- As conversas, preços, status e cartões são ilustrações próprias. Recursos dependem do plano, integração e configuração. A assinatura Brendi continua distinta do serviço de assessoria.
- Seis tabs com setas do teclado, estados acessíveis, visualização desktop com telefone, layout mobile sem scroll prendendo a página, botão de proposta.
- Testes Chromium verificam as seis cenas, mensagem de áudio, transcrição, imagem, pagamento, pedido, recompras e CTA.

## Nova central de funcionalidades
- 9 páginas estáticas independentes, com URLs legíveis, metadados SEO, navegação cruzada e links a fontes oficiais.
- Índice com filtros por vendas/atendimento, campanhas/fidelização e gestão.
- Conteúdo autoral baseado nas nove páginas oficiais da Brendi fornecidas pelo cliente, sem copiar textos ou mídia da fabricante.
- Cada página explica a funcionalidade, seis aplicações práticas, três prévias ilustrativas selecionáveis, quatro etapas de assessoria, perguntas frequentes e contato contextual via WhatsApp +55 11 92062-6850.
- Páginas: `/funcionalidades/{slug}/`; código responsivo compartilhado em `feature-pages.css` e `feature-pages.js`.
- Importante: não usar os mocks como prints reais. Recursos efetivos dependem de plano, disponibilidade e integrações; o tráfego pago tem custos adicionais.
- A home permanece praticamente intacta; links de benefícios, navegação e pequeno banner levam à central.
- `sitemap.xml` e `robots.txt` atualizados.
