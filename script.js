/* =====================================================
   FLUXOOS - SCRIPT PRINCIPAL
   Compatível com login + criação de conta
===================================================== */

/* =========================
   AUTENTICAÇÃO
========================= */

function verificarAutenticacao() {
  const autenticado = localStorage.getItem("fluxoOSAutenticado");
  const pagina = window.location.pathname.split("/").pop();

  // A página de login é pública
  if (pagina === "index.html" || pagina === "") return;

  if (autenticado !== "true") {
    window.location.href = "index.html";
  }
}

verificarAutenticacao();

function logout() {
  localStorage.removeItem("fluxoOSAutenticado");
  localStorage.removeItem("usuarioLogado");
  localStorage.removeItem("osSelecionada");
  window.location.href = "index.html";
}

/* =========================
   LOCAL STORAGE
========================= */

function obterOrdens() {
  return JSON.parse(localStorage.getItem("ordens")) || [];
}

function salvarLista(lista) {
  localStorage.setItem("ordens", JSON.stringify(lista));
}

/* =========================
   DADOS DEMONSTRATIVOS
========================= */

function gerarOSDemo() {
  if (localStorage.getItem("demoGerada") === "true") return;

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
  localStorage.setItem("demoGerada", "true");
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
   DASHBOARD
========================= */

function carregarDashboard() {
  const tabela = document.getElementById("tabelaOS");
  if (!tabela) return;

  const lista = obterOrdens();
  tabela.innerHTML = "";

  let recebido = 0;
  let triagem = 0;
  let orcamento = 0;
  let aprovacao = 0;
  let liberado = 0;

  lista.forEach((os) => {
    if (os.status === "Recebido") recebido++;
    if (os.status === "Em Triagem") triagem++;
    if (os.status === "Em Orçamento") orcamento++;
    if (os.status === "Aguardando Aprovação") aprovacao++;
    if (os.status === "Liberado para Oficina") liberado++;

    tabela.innerHTML += `
      <tr>
        <td>${os.numero}</td>
        <td>${os.cliente}</td>
        <td>${os.placa}</td>
        <td>${os.servico}</td>
        <td>${os.prioridade}</td>
        <td>${os.status}</td>
        <td>
          <button onclick="abrirDetalhes(${os.id})">
            Abrir
          </button>
        </td>
      </tr>
    `;
  });

  const map = {
    recebidoCount: recebido,
    triagemCount: triagem,
    orcamentoCount: orcamento,
    aprovacaoCount: aprovacao,
    liberadoCount: liberado,
  };

  Object.keys(map).forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = map[id];
  });
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

    linhas.forEach((linha) => {
      linha.style.display = linha.textContent.toLowerCase().includes(filtro)
        ? ""
        : "none";
    });
  });
}

/* =========================
   DETALHES
========================= */

function abrirDetalhes(id) {
  localStorage.setItem("osSelecionada", id);
  window.location.href = "detalhes-os.html";
}

function atualizarStatusOS() {
  const id = Number(localStorage.getItem("osSelecionada"));
  const lista = obterOrdens();

  const indice = lista.findIndex((os) => os.id === id);

  if (indice === -1) return;

  const novoStatus = document.getElementById("novoStatus").value;

  if (novoStatus === "Liberado para Oficina") {
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
  const id = Number(localStorage.getItem("osSelecionada"));

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
  pesquisarOS();
});
