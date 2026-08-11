# FluxoOS

Protótipo de painel operacional para controle de **Ordens de Serviço (OS)** de
oficinas que atendem caminhões, implementos e carrocerias. Cobre o fluxo
completo: entrada → triagem → orçamento → aprovação → liberação para oficina.

> Desenvolvido como protótipo para o desafio SENAI. Não possui backend: todos
> os dados ficam salvos no `localStorage` do próprio navegador.

## Como rodar

Não há build, dependências de instalação ou backend — é HTML/CSS/JS puro, com
duas bibliotecas carregadas via CDN (Chart.js e SheetJS).

**Opção 1 — abrir direto no navegador**

Dê duplo clique em [index.html](index.html) (ou abra pelo navegador). Funciona
offline, exceto pelos gráficos e pela exportação em Excel, que dependem das
bibliotecas via CDN.

**Opção 2 — servidor local** (evita eventuais bloqueios do navegador a
`localStorage`/`fetch` quando aberto via `file://`)

```bash
# na pasta flowtech/
python -m http.server 8080
# depois acesse http://localhost:8080
```

### Login de demonstração

Na primeira execução, [index.html](index.html) cria automaticamente uma
conta padrão:

- **Usuário:** `admin`
- **Senha:** `fluxo123`

Também é possível criar uma nova conta pela tela "Criar conta". A
"autenticação" é só de fachada (senha em texto puro no `localStorage`) — serve
para simular o fluxo de login, não é segura para uso real.

Ao entrar, o sistema gera automaticamente **10 Ordens de Serviço de exemplo**
(uma única vez, controlado pela chave `demoGerada`) para que dashboard e
análises já nasçam com dados.

## Páginas

| Arquivo | Descrição |
|---|---|
| [index.html](index.html) | Login e criação de conta. |
| [dashboard.html](dashboard.html) | Cartões de contagem por status, gráfico de ordens por status, gráfico de prioridades, busca e tabela de todas as OS cadastradas. |
| [nova-os.html](nova-os.html) | Formulário de cadastro de uma nova OS (cliente, veículo, serviço, checklist de danos e observações), pré-preenchido com dados de exemplo. |
| [detalhes-os.html](detalhes-os.html) | Tela de detalhes de uma OS selecionada, com opção de atualizar status ou excluir. |
| [analises.html](analises.html) | Indicadores agregados: tipos de serviço, prioridade x volume e ordens por cliente. |
| [sobre.html](sobre.html) | Texto institucional e formulário de contato (não envia e-mail de verdade). |

## Funcionalidades

- **Dashboard** com contadores por status (Recebido, Em Triagem, Em
  Orçamento, Aguardando Aprovação, Liberado para Oficina) e busca em tempo
  real por número, cliente, placa, serviço ou status.
- **Gráficos** (Chart.js), calculados a partir das OS salvas em
  `localStorage`:
  - Dashboard: ordens por status (doughnut) e distribuição de prioridades
    (barras).
  - Análises: tipos de serviço (doughnut), prioridade x volume (barras) e
    ordens por cliente (ranking em barras horizontais, agrupando clientes
    menos frequentes em "Outros").
- **Cadastro de OS** com validação dos campos obrigatórios (número, cliente,
  responsável, placa) e bloqueio de número de OS duplicado.
- **Atualização de status / exclusão** de uma OS a partir da tela de
  detalhes. Marcar como "Liberado para Oficina" remove a OS das pendências.
- **Exportação de pendências para Excel** (`.xlsx`, via SheetJS), disponível
  no menu de ações rápidas do dashboard.
- **Sidebar de ações rápidas** (nova OS, exportar pendências).

## Armazenamento de dados

Tudo é local ao navegador, via `localStorage`:

| Chave | Conteúdo |
|---|---|
| `ordens` | Lista de OS cadastradas (array de objetos JSON). |
| `fluxoOSUsuarios` | Usuários criados (usuário → senha, texto puro). |
| `fluxoOSAutenticado` | Flag de sessão autenticada. |
| `usuarioLogado` | Usuário atualmente logado. |
| `osSelecionada` | id da OS aberta na tela de detalhes. |
| `demoGerada` | Garante que as 10 OS de exemplo só sejam geradas uma vez. |

Como não há backend, os dados não são compartilhados entre navegadores/
dispositivos e são apagados se o `localStorage` do navegador for limpo.

## Estrutura de arquivos

```
flowtech/
├── index.html          # login / criação de conta (script próprio inline)
├── dashboard.html       # painel principal
├── nova-os.html         # cadastro de OS
├── detalhes-os.html     # detalhes / atualização de status / exclusão
├── analises.html        # gráficos e indicadores
├── sobre.html            # institucional + contato
├── script.js             # lógica compartilhada (auth, CRUD, gráficos, exportação)
└── style.css              # identidade visual
```

## Tecnologias

- HTML, CSS e JavaScript puro (sem framework, sem build step).
- [Chart.js](https://www.chartjs.org/) via CDN — gráficos do dashboard e das análises.
- [SheetJS (xlsx)](https://sheetjs.com/) via CDN — exportação de pendências para Excel.

## Limitações conhecidas

- O formulário de contato em `sobre.html` não está conectado à função
  `enviarContato` — o envio não dispara a mensagem de confirmação.
- Autenticação é apenas simulada (sem hashing, sem backend); não usar como
  base para um sistema com dados reais.
