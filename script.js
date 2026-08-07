// =========================
// LocalStorage
// =========================

function obterOrdens() {
  return JSON.parse(localStorage.getItem("ordens")) || [];
}

function salvarLista(lista) {
  localStorage.setItem("ordens", JSON.stringify(lista));
}

// =========================
// Salvar nova OS
// =========================

function salvarOS() {
  const numero = document.getElementById("numero").value;
  const cliente = document.getElementById("cliente").value;
  const responsavel = document.getElementById("responsavel").value;
  const telefone = document.getElementById("telefone").value;
  const email = document.getElementById("email").value;
  const placa = document.getElementById("placa").value;
  const marca = document.getElementById("marca").value;
  const carroceria = document.getElementById("carroceria").value;
  const prioridade = document.getElementById("prioridade").value;
  const servico = document.getElementById("servico").value;
  const status = document.getElementById("status").value;
  const dataEntrada = document.getElementById("dataEntrada").value;
  const observacoes = document.getElementById("observacoes").value;

  if (numero === "" || cliente === "" || placa === "") {
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
    telefone,
    email,
    placa,
    marca,
    carroceria,
    prioridade,
    servico,
    status,
    dataEntrada,
    observacoes,
  });

  salvarLista(lista);

  alert("OS cadastrada com sucesso!");
  window.location.href = "dashboard.html";
}

// =========================
// Dashboard
// =========================

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

  document.getElementById("recebidoCount").textContent = recebido;
  document.getElementById("triagemCount").textContent = triagem;
  document.getElementById("orcamentoCount").textContent = orcamento;
  document.getElementById("aprovacaoCount").textContent = aprovacao;
  document.getElementById("liberadoCount").textContent = liberado;
}

// =========================
// Pesquisa
// =========================

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

// =========================
// Abrir detalhes
// =========================

function abrirDetalhes(id) {
  localStorage.setItem("osSelecionada", id);
  window.location.href = "detalhes-os.html";
}

// =========================
// Atualizar status
// =========================

function atualizarStatusOS() {
  const id = Number(localStorage.getItem("osSelecionada"));
  const lista = obterOrdens();

  const indice = lista.findIndex((os) => os.id === id);

  if (indice === -1) return;

  const novoStatus = document.getElementById("novoStatus").value;

  lista[indice].status = novoStatus;

  salvarLista(lista);

  alert("Status atualizado com sucesso!");

  window.location.href = "dashboard.html";
}

// =========================
// Inicialização
// =========================

window.addEventListener("DOMContentLoaded", function () {
  carregarDashboard();
  pesquisarOS();
});
