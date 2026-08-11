/* =====================================================
   FLUXOOS - SCRIPT PRINCIPAL
   Compatível com login + criação de conta
===================================================== */

/* =========================
   CONSTANTES
========================= */

const STORAGE_KEYS = {
  AUTENTICADO: "fluxoOSAutenticado",
  ORDENS: "ordens",
  OS_SELECIONADA: "osSelecionada",
  DEMO_GERADA: "demoGerada",
};

const STATUS = {
  RECEBIDO: "Recebido",
  TRIAGEM: "Em Triagem",
  ORCAMENTO: "Em Orçamento",
  APROVACAO: "Aguardando Aprovação",
  LIBERADO: "Liberado para Oficina",
};

// Ordem fixa dos cartões/gráfico de status do dashboard.
const STATUS_CARDS = [
  { id: "recebidoCount", status: STATUS.RECEBIDO },
  { id: "triagemCount", status: STATUS.TRIAGEM },
  { id: "orcamentoCount", status: STATUS.ORCAMENTO },
  { id: "aprovacaoCount", status: STATUS.APROVACAO },
  { id: "liberadoCount", status: STATUS.LIBERADO },
];

const PRIORIDADES = ["Baixa", "Média", "Alta", "Urgente"];

// Paleta categórica (ordem fixa - identidade de séries/fatias).
const CORES_CATEGORICAS = [
  "#2a78d6",
  "#eb6834",
  "#1baf7a",
  "#eda100",
  "#e87ba4",
  "#008300",
  "#4a3aa7",
  "#e34948",
];
const COR_OUTROS = "#898781";
const COR_SERIE_UNICA = "#2a78d6";

// Prioridade é uma escala de urgência: reaproveita a paleta de status (fixa).
const CORES_PRIORIDADE = {
  Baixa: "#0ca30c",
  Média: "#fab219",
  Alta: "#ec835a",
  Urgente: "#d03b3b",
};

/* =========================
   AUTENTICAÇÃO
========================= */

function verificarAutenticacao() {
  const autenticado = localStorage.getItem(STORAGE_KEYS.AUTENTICADO);
  const pagina = window.location.pathname.split("/").pop();

  // A página de login é pública
  if (pagina === "index.html" || pagina === "") return;

  if (autenticado !== "true") {
    window.location.href = "index.html";
  }
}

verificarAutenticacao();

function sair() {
  localStorage.removeItem(STORAGE_KEYS.AUTENTICADO);
  localStorage.removeItem("usuarioLogado");
  localStorage.removeItem(STORAGE_KEYS.OS_SELECIONADA);
  window.location.href = "index.html";
}

/* =========================
   LOCAL STORAGE
========================= */

function obterOrdens() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDENS)) || [];
  } catch {
    return [];
  }
}

function salvarLista(lista) {
  localStorage.setItem(STORAGE_KEYS.ORDENS, JSON.stringify(lista));
}

/* =========================
   DADOS DEMONSTRATIVOS
========================= */

function gerarOSDemo() {
  if (localStorage.getItem(STORAGE_KEYS.DEMO_GERADA) === "true") return;

  const hoje = new Date();

  const demo = [
    [
      "OS-1001",
      "Transportadora Horizonte",
      "ABC1D23",
      "Reforma Completa",
      "Urgente",
      "Em Orçamento",
    ],
    [
      "OS-1002",
      "Logística Vale Norte",
      "DEF4G56",
      "Pintura",
      "Alta",
      "Aguardando Aprovação",
    ],
    [
      "OS-1003",
      "Expresso Minas",
      "GHI7J89",
      "Troca de Piso",
      "Média",
      "Em Triagem",
    ],
    [
      "OS-1004",
      "Rota Sul Cargas",
      "JKL1M23",
      "Refrigeração",
      "Alta",
      "Recebido",
    ],
    ["OS-1005", "Cargas União", "NOP4Q56", "Vedação", "Baixa", "Em Triagem"],
    [
      "OS-1006",
      "Rodomax Transportes",
      "RST7U89",
      "Reforma Parcial",
      "Média",
      "Em Orçamento",
    ],
    [
      "OS-1007",
      "Frota Atlas",
      "VWX1Y23",
      "Troca de Painel",
      "Alta",
      "Aguardando Aprovação",
    ],
    [
      "OS-1008",
      "Nova Rota Logística",
      "ZAB4C56",
      "Pintura",
      "Baixa",
      "Recebido",
    ],
    [
      "OS-1009",
      "Sul Cargo Express",
      "DEF7G89",
      "Refrigeração",
      "Urgente",
      "Em Orçamento",
    ],
    [
      "OS-1010",
      "Transportes Brasil",
      "HIJ1K23",
      "Reforma Completa",
      "Média",
      "Em Triagem",
    ],
  ];

  const lista = demo.map((d, i) => ({
    id: Date.now() + i,
    numero: d[0],
    cliente: d[1],
    responsavel: "Mariana Costa",
    telefone: "(11) 99999-0000",
    email: "contato@empresa.com.br",
    placa: d[2],
    marca: "Mercedes-Benz",
    carroceria: "Baú Refrigerado",
    prioridade: d[4],
    servico: d[3],
    status: d[5],
    dataEntrada: new Date(hoje.getTime() - i * 86400000)
      .toISOString()
      .slice(0, 10),
    observacoes: "OS demonstrativa para apresentação do sistema.",
  }));

  salvarLista(lista);
  localStorage.setItem(STORAGE_KEYS.DEMO_GERADA, "true");
}

gerarOSDemo();

/* =========================
   NOVA ORDEM DE SERVIÇO
========================= */

function preencherNovaOS() {
  const numeroInput = document.getElementById("numero");
  if (!numeroInput) return;
  if (numeroInput.value !== "") return;

  const hoje = new Date().toISOString().slice(0, 10);
  const numero = 2000 + obterOrdens().length + 1;

  numeroInput.value = "OS-" + numero;
  document.getElementById("dataEntrada").value = hoje;
  document.getElementById("cliente").value =
    "Transportadora Horizonte Fictícia";
  document.getElementById("responsavel").value = "Carlos Almeida";
  document.getElementById("telefone").value = "(11) 98888-1234";
  document.getElementById("email").value = "contato@horizonteficticia.com.br";
  document.getElementById("placa").value = "XYZ2A34";
  document.getElementById("marca").value = "Mercedes-Benz";
  document.getElementById("carroceria").value = "Baú Refrigerado";
  document.getElementById("prioridade").value = "Média";
  document.getElementById("servico").value = "Reforma Parcial";
  document.getElementById("status").value = "Recebido";
  document.getElementById("observacoes").value =
    "Veículo recebido para avaliação estrutural e levantamento dos serviços necessários.";
}

function salvarOS() {
  const numero = document.getElementById("numero").value.trim();
  const cliente = document.getElementById("cliente").value.trim();
  const responsavel = document.getElementById("responsavel").value.trim();
  const placa = document.getElementById("placa").value.trim();

  if (!numero || !cliente || !responsavel || !placa) {
    alert("Preencha os campos obrigatórios.");
    return;
  }

  const lista = obterOrdens();

  if (lista.find((os) => os.numero === numero)) {
    alert("Já existe uma OS com esse número.");
    return;
  }

  lista.push({
    id: Date.now(),
    numero,
    cliente,
    responsavel,
    telefone: document.getElementById("telefone").value,
    email: document.getElementById("email").value,
    placa,
    marca: document.getElementById("marca").value,
    carroceria: document.getElementById("carroceria").value,
    prioridade: document.getElementById("prioridade").value,
    servico: document.getElementById("servico").value,
    status: document.getElementById("status").value,
    dataEntrada: document.getElementById("dataEntrada").value,
    observacoes: document.getElementById("observacoes").value,
  });

  salvarLista(lista);

  alert("OS cadastrada com sucesso!");
  window.location.href = "dashboard.html";
}

/* =========================
   AGREGAÇÃO DE DADOS
========================= */

// Conta as ordens agrupando pelo valor de um campo (ex.: "status", "servico").
function agruparPor(lista, campo) {
  return lista.reduce((contagem, os) => {
    const chave = os[campo] || "Não informado";
    contagem[chave] = (contagem[chave] || 0) + 1;
    return contagem;
  }, {});
}

// Como agruparPor, mas ordenado do maior para o menor volume.
function agruparPorOrdenado(lista, campo) {
  return Object.entries(agruparPor(lista, campo)).sort((a, b) => b[1] - a[1]);
}

// Mantém só as `limite` categorias mais frequentes e soma o restante em "Outros",
// evitando fatias/cores demais em gráficos com muitos valores distintos (ex.: clientes).
function agruparComOutros(lista, campo, limite = 7) {
  const ordenado = agruparPorOrdenado(lista, campo);
  if (ordenado.length <= limite) return ordenado;

  const principais = ordenado.slice(0, limite);
  const restante = ordenado
    .slice(limite)
    .reduce((soma, [, valor]) => soma + valor, 0);

  return [...principais, ["Outros", restante]];
}

/* =========================
   GRÁFICOS (Chart.js)
========================= */

const graficosAtivos = {};

// Cria (ou substitui, se já existir) o gráfico de um canvas. Evita instâncias
// duplicadas do Chart.js ao recarregar a página/dados.
function renderizarGrafico(canvasId, config) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  if (typeof Chart === "undefined") {
    console.warn("Chart.js não carregado; gráfico não será exibido:", canvasId);
    return;
  }

  if (graficosAtivos[canvasId]) {
    graficosAtivos[canvasId].destroy();
  }

  graficosAtivos[canvasId] = new Chart(canvas, config);
}

function coresCategoricas(quantidade, temOutros) {
  const diretas = temOutros ? quantidade - 1 : quantidade;
  const cores = CORES_CATEGORICAS.slice(0, diretas);
  if (temOutros) cores.push(COR_OUTROS);
  return cores;
}

// Gráfico de status/prioridade: doughnut com legenda, categorias em ordem fixa.
function renderizarDoughnut(canvasId, entradas, cores) {
  renderizarGrafico(canvasId, {
    type: "doughnut",
    data: {
      labels: entradas.map(([label]) => label),
      datasets: [
        {
          data: entradas.map(([, valor]) => valor),
          backgroundColor: cores,
          borderColor: "#fff",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } },
    },
  });
}

// Gráfico de ranking (ex.: ordens por cliente): barras horizontais, cor única.
function renderizarBarraRanking(canvasId, entradas) {
  renderizarGrafico(canvasId, {
    type: "bar",
    data: {
      labels: entradas.map(([label]) => label),
      datasets: [
        {
          label: "Ordens",
          data: entradas.map(([, valor]) => valor),
          backgroundColor: COR_SERIE_UNICA,
          borderRadius: 4,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { x: { beginAtZero: true, ticks: { precision: 0 } } },
    },
  });
}

// Gráfico de prioridade x volume: barras verticais coloridas pela urgência.
function renderizarBarraPrioridade(canvasId, contagemPorPrioridade) {
  renderizarGrafico(canvasId, {
    type: "bar",
    data: {
      labels: PRIORIDADES,
      datasets: [
        {
          label: "Ordens",
          data: PRIORIDADES.map((p) => contagemPorPrioridade[p] || 0),
          backgroundColor: PRIORIDADES.map((p) => CORES_PRIORIDADE[p]),
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
    },
  });
}

/* =========================
   DASHBOARD
========================= */

function criarLinhaOS(os) {
  const tr = document.createElement("tr");

  [os.numero, os.cliente, os.placa, os.servico, os.prioridade, os.status].forEach(
    (valor) => {
      const td = document.createElement("td");
      td.textContent = valor;
      tr.appendChild(td);
    },
  );

  const tdAcao = document.createElement("td");
  const botao = document.createElement("button");
  botao.className = "table-btn";
  botao.textContent = "Abrir";
  botao.addEventListener("click", () => abrirDetalhes(os.id));
  tdAcao.appendChild(botao);
  tr.appendChild(tdAcao);

  return tr;
}

function atualizarContadorResultados(visiveis, total) {
  const contador = document.getElementById("resultCount");
  if (!contador) return;
  contador.textContent = `${visiveis} de ${total} ordens`;
}

function carregarDashboard() {
  const tabela = document.getElementById("tabelaOS");
  if (!tabela) return;

  const lista = obterOrdens();
  const contagemStatus = agruparPor(lista, "status");

  tabela.innerHTML = "";
  const fragmento = document.createDocumentFragment();
  lista.forEach((os) => fragmento.appendChild(criarLinhaOS(os)));
  tabela.appendChild(fragmento);

  STATUS_CARDS.forEach(({ id, status }) => {
    const el = document.getElementById(id);
    if (el) el.textContent = contagemStatus[status] || 0;
  });

  atualizarContadorResultados(lista.length, lista.length);

  const statusEntradas = STATUS_CARDS.map(({ status }) => [
    status,
    contagemStatus[status] || 0,
  ]);
  renderizarDoughnut(
    "statusChart",
    statusEntradas,
    coresCategoricas(statusEntradas.length, false),
  );

  renderizarBarraPrioridade("priorityChart", agruparPor(lista, "prioridade"));
}

/* =========================
   ANÁLISES
========================= */

function carregarAnalises() {
  if (!document.getElementById("serviceChart")) return;

  const lista = obterOrdens();

  const servicos = agruparComOutros(lista, "servico");
  renderizarDoughnut(
    "serviceChart",
    servicos,
    coresCategoricas(servicos.length, servicos.at(-1)?.[0] === "Outros"),
  );

  renderizarBarraPrioridade("priorityBar", agruparPor(lista, "prioridade"));

  renderizarBarraRanking("clientChart", agruparComOutros(lista, "cliente"));
}

/* =========================
   PESQUISA
========================= */

function pesquisarOS() {
  const input = document.getElementById("pesquisaOS");
  if (!input) return;

  input.addEventListener("keyup", function () {
    const filtro = input.value.toLowerCase();
    const linhas = document.querySelectorAll("#tabelaOS tr");
    let visiveis = 0;

    linhas.forEach((linha) => {
      const corresponde = linha.textContent.toLowerCase().includes(filtro);
      linha.style.display = corresponde ? "" : "none";
      if (corresponde) visiveis++;
    });

    atualizarContadorResultados(visiveis, linhas.length);
  });
}

/* =========================
   DETALHES
========================= */

function abrirDetalhes(id) {
  localStorage.setItem(STORAGE_KEYS.OS_SELECIONADA, id);
  window.location.href = "detalhes-os.html";
}

// Mapeia id do elemento -> campo da OS, para preencher a tela de detalhes.
const CAMPOS_DETALHE = {
  dNumero: "numero",
  dCliente: "cliente",
  dResponsavel: "responsavel",
  dTelefone: "telefone",
  dEmail: "email",
  dPlaca: "placa",
  dMarca: "marca",
  dCarroceria: "carroceria",
  dServico: "servico",
  dPrioridade: "prioridade",
  dData: "dataEntrada",
  dObservacoes: "observacoes",
};

function carregarDetalhes() {
  if (!document.getElementById("dNumero")) return;

  const id = Number(localStorage.getItem(STORAGE_KEYS.OS_SELECIONADA));
  const os = obterOrdens().find((o) => o.id === id);

  if (!os) {
    window.location.href = "dashboard.html";
    return;
  }

  Object.entries(CAMPOS_DETALHE).forEach(([elId, campo]) => {
    const el = document.getElementById(elId);
    if (el) el.textContent = os[campo];
  });

  const selectStatus = document.getElementById("novoStatus");
  if (selectStatus) selectStatus.value = os.status;
}

function atualizarStatusOS() {
  const id = Number(localStorage.getItem(STORAGE_KEYS.OS_SELECIONADA));
  const lista = obterOrdens();

  const indice = lista.findIndex((os) => os.id === id);

  if (indice === -1) return;

  const novoStatus = document.getElementById("novoStatus").value;

  if (novoStatus === STATUS.LIBERADO) {
    if (
      !confirm(
        "Ao liberar para a oficina, esta OS será retirada das pendências. Confirmar?",
      )
    ) {
      return;
    }

    lista.splice(indice, 1);
    salvarLista(lista);

    alert("OS liberada para oficina e removida das pendências.");
  } else {
    lista[indice].status = novoStatus;
    salvarLista(lista);

    alert("Status atualizado com sucesso!");
  }

  window.location.href = "dashboard.html";
}

function excluirOS() {
  const id = Number(localStorage.getItem(STORAGE_KEYS.OS_SELECIONADA));

  if (!confirm("Tem certeza que deseja excluir esta OS?")) return;

  const lista = obterOrdens().filter((os) => os.id !== id);

  salvarLista(lista);

  alert("OS excluída.");

  window.location.href = "dashboard.html";
}

/* =========================
   EXPORTAR PENDÊNCIAS
========================= */

function exportarPendencias() {
  const lista = obterOrdens();

  if (lista.length === 0) {
    alert("Não há ordens pendentes para exportar.");
    return;
  }

  if (typeof XLSX === "undefined") {
    alert("Biblioteca XLSX não carregada.");
    return;
  }

  const dados = lista.map((os) => ({
    OS: os.numero,
    Cliente: os.cliente,
    Responsável: os.responsavel,
    Telefone: os.telefone,
    Email: os.email,
    Placa: os.placa,
    Marca: os.marca,
    Carroceria: os.carroceria,
    Serviço: os.servico,
    Prioridade: os.prioridade,
    Status: os.status,
    "Data de Entrada": os.dataEntrada,
    Observações: os.observacoes,
  }));

  const ws = XLSX.utils.json_to_sheet(dados);

  ws["!cols"] = [
    { wch: 12 },
    { wch: 28 },
    { wch: 22 },
    { wch: 18 },
    { wch: 30 },
    { wch: 12 },
    { wch: 18 },
    { wch: 20 },
    { wch: 24 },
    { wch: 14 },
    { wch: 24 },
    { wch: 16 },
    { wch: 42 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Pendências");
  XLSX.writeFile(wb, "FluxoOS_Pendencias.xlsx");
}

/* =========================
   SIDEBAR
========================= */

function toggleSidebar() {
  const sidebar = document.getElementById("quickSidebar");

  if (sidebar) {
    sidebar.classList.toggle("open");
  }
}

/* =========================
   CONTATO
========================= */

function enviarContato(event) {
  event.preventDefault();
  alert("Mensagem enviada com sucesso!");
  event.target.reset();
}

/* =========================
   INICIALIZAÇÃO
========================= */

window.addEventListener("DOMContentLoaded", function () {
  preencherNovaOS();
  carregarDashboard();
  carregarAnalises();
  carregarDetalhes();
  pesquisarOS();
});
