// =========================================================
// FLUXOOS
// Sistema de Controle de Ordens de Serviço
// =========================================================


// =========================================================
// LOCAL STORAGE
// =========================================================

function obterOrdens() {

  return JSON.parse(
    localStorage.getItem("ordens")
  ) || [];

}


function salvarLista(lista) {

  localStorage.setItem(
    "ordens",
    JSON.stringify(lista)
  );

}


// =========================================================
// LOGIN / LOGOUT
// =========================================================

function sair() {

  localStorage.removeItem(
    "usuarioLogado"
  );

}


// =========================================================
// SALVAR NOVA OS
// =========================================================

function salvarOS() {

  const numero =
    document.getElementById("numero").value.trim();

  const cliente =
    document.getElementById("cliente").value.trim();

  const responsavel =
    document.getElementById("responsavel").value.trim();

  const telefone =
    document.getElementById("telefone").value.trim();

  const email =
    document.getElementById("email").value.trim();

  const placa =
    document.getElementById("placa").value.trim().toUpperCase();

  const marca =
    document.getElementById("marca").value;

  const carroceria =
    document.getElementById("carroceria").value;

  const prioridade =
    document.getElementById("prioridade").value;

  const servico =
    document.getElementById("servico").value;

  const status =
    document.getElementById("status").value;

  const dataEntrada =
    document.getElementById("dataEntrada").value;

  const observacoes =
    document.getElementById("observacoes").value.trim();


  // =======================================================
  // CHECKLIST
  // =======================================================

  const checklist =
    Array.from(
      document.querySelectorAll(
        'input[name="checklist"]:checked'
      )
    ).map(
      (checkbox) => checkbox.value
    );


  // =======================================================
  // VALIDAÇÃO
  // =======================================================

  if (
    !numero ||
    !cliente ||
    !responsavel ||
    !placa ||
    !dataEntrada
  ) {

    alert(
      "Preencha todos os campos obrigatórios."
    );

    return;
  }


  const lista = obterOrdens();


  // =======================================================
  // VERIFICAR DUPLICIDADE
  // =======================================================

  const numeroExiste =
    lista.some(
      (os) =>
        os.numero.toLowerCase() ===
        numero.toLowerCase()
    );


  if (numeroExiste) {

    alert(
      "Já existe uma OS com esse número."
    );

    return;
  }


  // =======================================================
  // CRIAR OS
  // =======================================================

  const novaOS = {

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

    checklist,

    observacoes,

    criadaEm:
      new Date().toISOString()

  };


  lista.push(novaOS);

  salvarLista(lista);


  alert(
    `OS ${numero} cadastrada com sucesso!`
  );


  window.location.href =
    "dashboard.html";

}


// =========================================================
// DASHBOARD
// =========================================================

function carregarDashboard() {

  const tabela =
    document.getElementById(
      "tabelaOS"
    );


  if (!tabela) {
    return;
  }


  const lista =
    obterOrdens();


  tabela.innerHTML = "";


  // =======================================================
  // CONTADORES
  // =======================================================

  let recebido = 0;
  let triagem = 0;
  let orcamento = 0;
  let aprovacao = 0;
  let liberado = 0;


  lista.forEach(
    (os) => {

      if (
        os.status === "Recebido"
      ) {
        recebido++;
      }

      if (
        os.status === "Em Triagem"
      ) {
        triagem++;
      }

      if (
        os.status === "Em Orçamento"
      ) {
        orcamento++;
      }

      if (
        os.status === "Aguardando Aprovação"
      ) {
        aprovacao++;
      }

      if (
        os.status === "Liberado para Oficina"
      ) {
        liberado++;
      }

    }
  );


  // =======================================================
  // ATUALIZAR CARDS
  // =======================================================

  document.getElementById(
    "recebidoCount"
  ).textContent = recebido;


  document.getElementById(
    "triagemCount"
  ).textContent = triagem;


  document.getElementById(
    "orcamentoCount"
  ).textContent = orcamento;


  document.getElementById(
    "aprovacaoCount"
  ).textContent = aprovacao;


  document.getElementById(
    "liberadoCount"
  ).textContent = liberado;


  // =======================================================
  // TABELA
  // =======================================================

  const pendentes =
    lista.filter(
      (os) =>
        os.status !==
        "Liberado para Oficina"
    );


  const emptyState =
    document.getElementById(
      "semOrdens"
    );


  if (
    pendentes.length === 0
  ) {

    emptyState.style.display =
      "flex";

    return;

  }


  emptyState.style.display =
    "none";


  pendentes.forEach(
    (os) => {

      const linha =
        document.createElement("tr");


      linha.innerHTML = `

        <td>
          ${escaparHTML(os.numero)}
        </td>

        <td>
          ${escaparHTML(os.cliente)}
        </td>

        <td>
          ${escaparHTML(os.placa)}
        </td>

        <td>
          ${escaparHTML(os.servico)}
        </td>

        <td>
          <span class="priority-badge priority-${os.prioridade.toLowerCase()}">
            ${escaparHTML(os.prioridade)}
          </span>
        </td>

        <td>
          <span class="status-badge ${classeStatus(os.status)}">
            ${escaparHTML(os.status)}
          </span>
        </td>

        <td>

          <button
            class="table-action"
            onclick="abrirDetalhes(${os.id})"
          >
            Abrir
          </button>

        </td>

      `;


      tabela.appendChild(
        linha
      );

    }
  );

}


// =========================================================
// STATUS — CLASSE VISUAL
// =========================================================

function classeStatus(status) {

  switch (status) {

    case "Recebido":
      return "status-received";

    case "Em Triagem":
      return "status-triage";

    case "Em Orçamento":
      return "status-budget";

    case "Aguardando Aprovação":
      return "status-approval";

    case "Liberado para Oficina":
      return "status-workshop";

    default:
      return "";

  }

}


// =========================================================
// PESQUISA
// =========================================================

function pesquisarOS() {

  const input =
    document.getElementById(
      "pesquisaOS"
    );


  if (!input) {
    return;
  }


  input.addEventListener(
    "input",
    function () {

      const filtro =
        input.value
          .trim()
          .toLowerCase();


      const linhas =
        document.querySelectorAll(
          "#tabelaOS tr"
        );


      linhas.forEach(
        (linha) => {

          const texto =
            linha.textContent
              .toLowerCase();


          linha.style.display =
            texto.includes(filtro)
              ? ""
              : "none";

        }
      );

    }
  );

}


// =========================================================
// ABRIR DETALHES
// =========================================================

function abrirDetalhes(id) {

  localStorage.setItem(
    "osSelecionada",
    id
  );


  window.location.href =
    "detalhes-os.html";

}


// =========================================================
// CARREGAR DETALHES
// =========================================================

function carregarDetalhes() {

  const numeroElemento =
    document.getElementById(
      "dNumero"
    );


  if (!numeroElemento) {
    return;
  }


  const id =
    Number(
      localStorage.getItem(
        "osSelecionada"
      )
    );


  const lista =
    obterOrdens();


  const os =
    lista.find(
      (item) =>
        item.id === id
    );


  if (!os) {

    alert(
      "OS não encontrada."
    );


    window.location.href =
      "dashboard.html";

    return;

  }


  document.getElementById(
    "dNumero"
  ).textContent =
    os.numero;


  document.getElementById(
    "dCliente"
  ).textContent =
    os.cliente;


  document.getElementById(
    "dResponsavel"
  ).textContent =
    os.responsavel;


  document.getElementById(
    "dTelefone"
  ).textContent =
    os.telefone || "-";


  document.getElementById(
    "dEmail"
  ).textContent =
    os.email || "-";


  document.getElementById(
    "dPlaca"
  ).textContent =
    os.placa;


  document.getElementById(
    "dMarca"
  ).textContent =
    os.marca;


  document.getElementById(
    "dCarroceria"
  ).textContent =
    os.carroceria;


  document.getElementById(
    "dServico"
  ).textContent =
    os.servico;


  document.getElementById(
    "dPrioridade"
  ).textContent =
    os.prioridade;


  document.getElementById(
    "dData"
  ).textContent =
    formatarData(os.dataEntrada);


  document.getElementById(
    "dObservacoes"
  ).textContent =
    os.observacoes || "-";


  // =======================================================
  // STATUS
  // =======================================================

  document.getElementById(
    "novoStatus"
  ).value =
    os.status;


  // =======================================================
  // CHECKLIST
  // =======================================================

  const checklistElemento =
    document.getElementById(
      "dChecklist"
    );


  checklistElemento.innerHTML =
    "";


  if (
    !os.checklist ||
    os.checklist.length === 0
  ) {

    checklistElemento.innerHTML = `
      <div class="checklist-empty">
        Nenhum problema registrado no checklist.
      </div>
    `;

  } else {

    os.checklist.forEach(
      (item) => {

        const elemento =
          document.createElement(
            "div"
          );


        elemento.className =
          "checklist-result";


        elemento.innerHTML = `
          <span>✓</span>
          ${escaparHTML(item)}
        `;


        checklistElemento.appendChild(
          elemento
        );

      }
    );

  }

}


// =========================================================
// ATUALIZAR STATUS
// =========================================================

function atualizarStatusOS() {

  const id =
    Number(
      localStorage.getItem(
        "osSelecionada"
      )
    );


  const lista =
    obterOrdens();


  const indice =
    lista.findIndex(
      (os) =>
        os.id === id
    );


  if (indice === -1) {

    alert(
      "OS não encontrada."
    );

    return;

  }


  const os =
    lista[indice];


  const novoStatus =
    document.getElementById(
      "novoStatus"
    ).value;


  // =======================================================
  // LIBERAR PARA OFICINA
  // =======================================================

  if (
    novoStatus ===
    "Liberado para Oficina"
  ) {

    const confirmar =
      confirm(

        `A OS ${os.numero} será liberada para a oficina.\n\n` +

        "Após a confirmação, ela será removida da lista de ordens pendentes.\n\n" +

        "Deseja continuar?"

      );


    if (!confirmar) {
      return;
    }


    // Remover da lista

    lista.splice(
      indice,
      1
    );


    salvarLista(
      lista
    );


    localStorage.removeItem(
      "osSelecionada"
    );


    alert(
      `OS ${os.numero} liberada para a oficina com sucesso!`
    );


    window.location.href =
      "dashboard.html";


    return;

  }


  // =======================================================
  // ATUALIZAR STATUS NORMAL
  // =======================================================

  os.status =
    novoStatus;


  salvarLista(
    lista
  );


  alert(
    "Status atualizado com sucesso!"
  );


  window.location.href =
    "dashboard.html";

}


// =========================================================
// EXCLUIR OS
// =========================================================

function excluirOS() {

  const id =
    Number(
      localStorage.getItem(
        "osSelecionada"
      )
    );


  const lista =
    obterOrdens();


  const os =
    lista.find(
      (item) =>
        item.id === id
    );


  if (!os) {

    alert(
      "OS não encontrada."
    );

    return;

  }


  const confirmar =
    confirm(

      `Tem certeza que deseja excluir a OS ${os.numero}?\n\n` +

      "Esta ação não poderá ser desfeita."

    );


  if (!confirmar) {
    return;
  }


  const novaLista =
    lista.filter(
      (item) =>
        item.id !== id
    );


  salvarLista(
    novaLista
  );


  localStorage.removeItem(
    "osSelecionada"
  );


  alert(
    `OS ${os.numero} excluída com sucesso!`
  );


  window.location.href =
    "dashboard.html";

}


// =========================================================
// EXPORTAR PENDÊNCIAS
// =========================================================

function exportarPendencias() {

  const lista =
    obterOrdens();


  // =======================================================
  // SOMENTE ORDENS PENDENTES
  // =======================================================

  const pendentes =
    lista.filter(
      (os) =>
        os.status !==
        "Liberado para Oficina"
    );


  if (
    pendentes.length === 0
  ) {

    alert(
      "Não existem ordens pendentes para exportar."
    );

    return;

  }


  // =======================================================
  // CABEÇALHO
  // =======================================================

  const cabecalho = [

    "OS",
    "Cliente",
    "Responsável",
    "Telefone",
    "E-mail",

    "Placa",
    "Marca",
    "Carroceria",

    "Serviço",
    "Prioridade",
    "Status",

    "Data de Entrada",
    "Checklist",
    "Observações"

  ];


  // =======================================================
  // DADOS
  // =======================================================

  const linhas =
    pendentes.map(
      (os) => [

        os.numero,

        os.cliente,

        os.responsavel,

        os.telefone,

        os.email,

        os.placa,

        os.marca,

        os.carroceria,

        os.servico,

        os.prioridade,

        os.status,

        os.dataEntrada,

        (os.checklist || [])
          .join(", "),

        os.observacoes

      ]
    );


  // =======================================================
  // CSV
  // =======================================================

  const csv =
    [
      cabecalho,
      ...linhas
    ]

      .map(
        (linha) =>

          linha
            .map(
              (valor) =>

                `"${String(
                  valor ?? ""
                )
                  .replace(
                    /"/g,
                    '""'
                  )}"`
            )
            .join(";")

      )

      .join("\n");


  // =======================================================
  // DOWNLOAD
  // =======================================================

  const blob =
    new Blob(
      [
        "\uFEFF" +
        csv
      ],
      {
        type:
          "text/csv;charset=utf-8;"
      }
    );


  const url =
    URL.createObjectURL(
      blob
    );


  const link =
    document.createElement(
      "a"
    );


  const data =
    new Date()
      .toISOString()
      .slice(
        0,
        10
      );


  link.href =
    url;


  link.download =
    `FluxoOS_Pendencias_${data}.csv`;


  document.body.appendChild(
    link
  );


  link.click();


  document.body.removeChild(
    link
  );


  URL.revokeObjectURL(
    url
  );

}


// =========================================================
// FORMATAR DATA
// =========================================================

function formatarData(data) {

  if (!data) {
    return "-";
  }


  const partes =
    data.split("-");


  if (
    partes.length !== 3
  ) {
    return data;
  }


  return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


// =========================================================
// PROTEÇÃO CONTRA HTML INJETADO
// =========================================================

function escaparHTML(valor) {

  const div =
    document.createElement(
      "div"
    );


  div.textContent =
    valor ?? "";


  return div.innerHTML;

}


// =========================================================
// DATA PADRÃO NO CADASTRO
// =========================================================

function configurarDataAtual() {

  const campo =
    document.getElementById(
      "dataEntrada"
    );


  if (!campo) {
    return;
  }


  if (!campo.value) {

    const hoje =
      new Date();


    const ano =
      hoje.getFullYear();


    const mes =
      String(
        hoje.getMonth() + 1
      ).padStart(
        2,
        "0"
      );


    const dia =
      String(
        hoje.getDate()
      ).padStart(
        2,
        "0"
      );


    campo.value =
      `${ano}-${mes}-${dia}`;

  }

}


// =========================================================
// INICIALIZAÇÃO
// =========================================================

window.addEventListener(
  "DOMContentLoaded",
  function () {

    carregarDashboard();

    pesquisarOS();

    carregarDetalhes();

    configurarDataAtual();

  }
);