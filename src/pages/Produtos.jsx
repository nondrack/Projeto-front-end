import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import "./Produtos.css";

const PRECO_INTEIRA = 32;
const PRECO_MEIA = 16;
const MAX_INGRESSOS = 10;

function Produtos(){
  const navigate = useNavigate();
  const [filmesApi, setFilmesApi] = useState([]);
  const [sessoesApi, setSessoesApi] = useState([]);
  const [loadingFilmes, setLoadingFilmes] = useState(true);
  const [erroFilmes, setErroFilmes] = useState("");
  const [generoSelecionado, setGeneroSelecionado] = useState("Todos");
  const [filmeSelecionado, setFilmeSelecionado] = useState(null);
  const [sessaoSelecionada, setSessaoSelecionada] = useState("");
  const [assentos, setAssentos] = useState(Array.from({ length: 40 }, (_, i) => ({
    numero: i + 1,
    ocupado: i % 7 === 0, // alguns já ocupados para exemplo
    selecionado: false
  })));
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [qtdInteira, setQtdInteira] = useState(1);
  const [qtdMeia, setQtdMeia] = useState(0);
  const [feedback, setFeedback] = useState({ tipo: "", texto: "" });

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("cineMaxSession") || "null");
    if (session?.nome) setNome(session.nome);
    if (session?.email) setEmail(session.email);
  }, []);

  useEffect(() => {
    async function loadFilmes() {
      setLoadingFilmes(true);
      setErroFilmes("");

      try {
        const dataFilmes = await api.get("/filmes");
        let dataSessoes = [];
        try {
          dataSessoes = await api.get("/sessoes");
        } catch {
          dataSessoes = [];
        }

        setSessoesApi(Array.isArray(dataSessoes) ? dataSessoes : []);

        const sessoesPorFilme = new Map();
        for (const sessao of dataSessoes) {
          const idFilme = Number(sessao.id_filme);
          const lista = sessoesPorFilme.get(idFilme) || [];
          const label = sessao.horario
            ? new Date(sessao.horario).toLocaleString("pt-BR", { hour: "2-digit", minute: "2-digit" })
            : "Sessao";
          lista.push(`${label}#${sessao.id_sessao}`);
          sessoesPorFilme.set(idFilme, lista);
        }

        const filmesNormalizados = dataFilmes.map((filme) => ({
          id: filme.id_filme,
          titulo: filme.titulo,
          duracao: filme.duracao ? `${filme.duracao} min` : "--",
          genero: filme.genero || "Sem genero",
          sinopse: filme.sinopse || "Sem sinopse cadastrada.",
          poster: filme.poster_url || "https://i.imgur.com/8w1NikM.jpg",
          classificacao: filme.classificacao_etaria || "Livre",
          sessoes: sessoesPorFilme.get(Number(filme.id_filme)) || [],
        }));

        setFilmesApi(filmesNormalizados);

        if (filmesNormalizados.length > 0) {
          setFilmeSelecionado(filmesNormalizados[0]);
          setSessaoSelecionada(filmesNormalizados[0].sessoes[0] || "");
        } else {
          setFilmeSelecionado(null);
          setSessaoSelecionada("");
        }
      } catch (error) {
        setFilmesApi([]);
        setFilmeSelecionado(null);
        setSessaoSelecionada("");
        setErroFilmes(error.message || "Nao foi possivel carregar os filmes do banco.");
      } finally {
        setLoadingFilmes(false);
      }
    }

    loadFilmes();
  }, []);

  const generos = useMemo(() => ["Todos", ...new Set(filmesApi.map((f) => f.genero))], [filmesApi]);

  const filmesFiltrados = useMemo(() => {
    if (generoSelecionado === "Todos") return filmesApi;
    return filmesApi.filter((f) => f.genero === generoSelecionado);
  }, [generoSelecionado, filmesApi]);

  useEffect(() => {
    if (!filmeSelecionado && filmesFiltrados.length > 0) {
      setFilmeSelecionado(filmesFiltrados[0]);
      return;
    }

    if (!filmeSelecionado) return;

    if (!filmesFiltrados.some((filme) => filme.id === filmeSelecionado.id)) {
      setFilmeSelecionado(filmesFiltrados[0] || null);
    }
  }, [filmesFiltrados, filmeSelecionado?.id]);

  useEffect(() => {
    if (!filmeSelecionado) {
      setSessaoSelecionada("");
      return;
    }

    setSessaoSelecionada(filmeSelecionado.sessoes[0] || "");
    setAssentos((old) => old.map((a) => ({ ...a, selecionado: false })));
  }, [filmeSelecionado]);

  const assentosSelecionados = assentos.filter((a) => a.selecionado);
  const totalIngressos = qtdInteira + qtdMeia;
  const valorTotal = qtdInteira * PRECO_INTEIRA + qtdMeia * PRECO_MEIA;

  useEffect(() => {
    if (assentosSelecionados.length > totalIngressos) {
      let remover = assentosSelecionados.length - totalIngressos;
      setAssentos((old) => old.map((a) => {
        if (remover > 0 && a.selecionado) {
          remover -= 1;
          return { ...a, selecionado: false };
        }
        return a;
      }));
    }
  }, [totalIngressos, assentosSelecionados.length]);

  function alterarQuantidade(tipo, operacao){
    if (tipo === "inteira") {
      if (operacao === "mais" && totalIngressos < MAX_INGRESSOS) {
        setQtdInteira((old) => old + 1);
      }
      if (operacao === "menos" && qtdInteira > 0) {
        setQtdInteira((old) => old - 1);
      }
      return;
    }

    if (operacao === "mais" && totalIngressos < MAX_INGRESSOS) {
      setQtdMeia((old) => old + 1);
    }
    if (operacao === "menos" && qtdMeia > 0) {
      setQtdMeia((old) => old - 1);
    }
  }

  function toggleAssento(numero){
    if (assentosSelecionados.length >= totalIngressos && !assentos.find((a) => a.numero === numero)?.selecionado) {
      setFeedback({
        tipo: "erro",
        texto: "Você já selecionou todos os assentos para a quantidade de ingressos escolhida."
      });
      return;
    }

    setAssentos((old) => old.map((a) => a.numero === numero && !a.ocupado ? { ...a, selecionado: !a.selecionado } : a));
    setFeedback({ tipo: "", texto: "" });
  }

  async function garantirCliente() {
    const session = JSON.parse(localStorage.getItem("cineMaxSession") || "null");
    const emailCompra = String(session?.email || email).trim();
    const nomeCompra = String(session?.nome || nome).trim();

    const clientes = await api.get("/clientes");
    const existente = clientes.find(
      (cliente) => cliente.email?.toLowerCase() === emailCompra.toLowerCase()
    );

    if (existente) return existente.id_cliente;

    const cpfGerado = `${Date.now()}`.slice(-11);
    const novoCliente = await api.post("/clientes", {
      nome: nomeCompra,
      cpf: cpfGerado,
      email: emailCompra,
      telefone: "",
      data_nascimento: null,
    });

    return novoCliente.id_cliente;
  }

  async function obterSessaoId() {
    if (!filmeSelecionado) return null;

    const sessoes = sessoesApi.length > 0 ? sessoesApi : await api.get("/sessoes");
    const sessoesDoFilme = sessoes.filter(
      (sessao) => Number(sessao.id_filme) === Number(filmeSelecionado.id)
    );

    if (sessoesDoFilme.length === 0) return null;

    const partes = String(sessaoSelecionada || "").split("#");
    const idDaTag = Number(partes[1] || 0);

    if (idDaTag) {
      const sessaoValida = sessoesDoFilme.find(
        (sessao) => Number(sessao.id_sessao) === idDaTag
      );
      if (sessaoValida) return idDaTag;
    }

    return Number(sessoesDoFilme[0].id_sessao);
  }

  async function obterAssentoId(numeroSelecionado, idSessao) {
    const assentosApi = await api.get("/assentos");
    const sessoes = sessoesApi.length > 0 ? sessoesApi : await api.get("/sessoes");
    const sessaoAlvo = sessoes.find(
      (sessao) => Number(sessao.id_sessao) === Number(idSessao)
    );

    if (!sessaoAlvo?.id_sala) return null;

    const porNumero = assentosApi.find(
      (assento) =>
        Number(assento.id_sala) === Number(sessaoAlvo.id_sala) &&
        String(assento.numero) === String(numeroSelecionado)
    );
    return porNumero?.id_assento || null;
  }

  async function reservar(e){
    e.preventDefault();

    const session = JSON.parse(localStorage.getItem("cineMaxSession") || "null");
    if (!session?.email) {
      setFeedback({
        tipo: "erro",
        texto: "Voce precisa estar logado para finalizar a compra. Redirecionando para login...",
      });
      setTimeout(() => navigate("/login?redirect=/produtos&motivo=compra"), 900);
      return;
    }

    const nomeCompra = String(session.nome || nome).trim();
    const emailCompra = String(session.email || email).trim();

    if (nomeCompra !== nome) setNome(nomeCompra);
    if (emailCompra !== email) setEmail(emailCompra);

    if(!nomeCompra || !emailCompra){
      setFeedback({ tipo: "erro", texto: "Preencha nome e email para continuar." });
      return;
    }

    if (!filmeSelecionado) {
      setFeedback({ tipo: "erro", texto: "Nao ha filme disponivel para compra no banco." });
      return;
    }

    if (totalIngressos <= 0) {
      setFeedback({ tipo: "erro", texto: "Escolha pelo menos 1 ingresso (inteira ou meia)." });
      return;
    }

    if (assentosSelecionados.length !== totalIngressos) {
      setFeedback({
        tipo: "erro",
        texto: `Selecione exatamente ${totalIngressos} assento(s) para finalizar a compra.`
      });
      return;
    }

    try {
      const idCliente = await garantirCliente();
      localStorage.setItem("cineMaxLastClienteId", String(idCliente));

      const session = JSON.parse(localStorage.getItem("cineMaxSession") || "null");
      const emailCompra = String(session?.email || email).trim().toLowerCase();
      if (emailCompra) {
        const rawMap = localStorage.getItem("cineMaxClienteByEmail") || "{}";
        const clienteMap = JSON.parse(rawMap);
        clienteMap[emailCompra] = idCliente;
        localStorage.setItem("cineMaxClienteByEmail", JSON.stringify(clienteMap));
      }

      const idSessao = await obterSessaoId();

      if (!idSessao) {
        setFeedback({ tipo: "erro", texto: "Este filme nao possui sessao cadastrada na API." });
        return;
      }

      for (const assentoSelecionado of assentosSelecionados) {
        const idAssento = await obterAssentoId(assentoSelecionado.numero, idSessao);
        if (!idAssento) {
          setFeedback({
            tipo: "erro",
            texto: `Assento ${assentoSelecionado.numero} nao existe para a sessao selecionada no banco.`,
          });
          return;
        }

        const ingresso = await api.post("/ingressos", {
          id_sessao: idSessao,
          id_cliente: idCliente,
          id_assento: idAssento,
          data_compra: new Date().toISOString(),
        });

        const idIngresso = Number(
          ingresso?.id_ingresso ||
          ingresso?.id ||
          ingresso?.dataValues?.id_ingresso ||
          0
        );
        if (!idIngresso) {
          throw new Error("Nao foi possivel obter o ingresso criado para registrar o pagamento.");
        }

        await api.post("/pagamentos", {
          id_ingresso: idIngresso,
          valor: Number((valorTotal / totalIngressos).toFixed(2)),
          metodo_pagamento: "pix",
          data_pagamento: new Date().toISOString(),
        });
      }

      setFeedback({
        tipo: "sucesso",
        texto: `Compra confirmada! ${nomeCompra}, ${totalIngressos} ingresso(s) para '${filmeSelecionado.titulo}' na sessão ${String(sessaoSelecionada || "").split("#")[0]}. Total: R$ ${valorTotal.toFixed(2)}.`
      });

      setAssentos((old)=> old.map((a)=> a.selecionado ? { ...a, ocupado: true, selecionado: false } : a));
      setNome("");
      setEmail("");
      setQtdInteira(1);
      setQtdMeia(0);
    } catch (error) {
      setFeedback({ tipo: "erro", texto: error.message || "Erro ao registrar compra na API." });
    }
  }

  return(
    <main className="cinema-page">
      <section className="intro-cinema">
        <h1>Bem-vindo ao CINE MAX</h1>
        <p>Escolha o filme, sessão e assento no nosso sistema de reserva com design moderno e responsivo.</p>
      </section>

      <section className="filtro">
        <label>Gênero:</label>
        <select value={generoSelecionado} onChange={(e)=>setGeneroSelecionado(e.target.value)}>
          {generos.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </section>

      <section className="lista-filmes">
        {loadingFilmes && <p>Carregando filmes...</p>}
        {!loadingFilmes && erroFilmes && <p className="feedback erro">{erroFilmes}</p>}
        {!loadingFilmes && !erroFilmes && filmesFiltrados.length === 0 && (
          <p>Nenhum filme cadastrado no banco.</p>
        )}
        {filmesFiltrados.map((filme) => (
          <article key={filme.id} className={`filme-card ${filmeSelecionado?.id === filme.id ? 'ativo' : ''}`} onClick={()=>setFilmeSelecionado(filme)}>
            <img src={filme.poster} alt={filme.titulo} />
            <h2>{filme.titulo}</h2>
            <span>{filme.genero} • {filme.duracao}</span>
          </article>
        ))}
      </section>

      <section className="detalhes-filme">
        {filmeSelecionado ? (
          <>
            <h2>{filmeSelecionado.titulo}</h2>
            <p>{filmeSelecionado.sinopse}</p>
            <p><strong>Classificação:</strong> {filmeSelecionado.classificacao}</p>
            <div className="sessoes">
              <strong>Sessões:</strong>
              <div className="sessoes-opcoes">
                {filmeSelecionado.sessoes.map((sessao) => (
                  <button
                    key={sessao}
                    type="button"
                    className={sessaoSelecionada === sessao ? "sessao-ativa" : ""}
                    onClick={() => setSessaoSelecionada(sessao)}
                  >
                    {String(sessao).split("#")[0]}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <p>Nenhum filme selecionado.</p>
        )}
      </section>

      <section className="assentos-area">
        <h3>Mapa de Assentos</h3>
        <div className="assentos-grid">
          {assentos.map((assento)=> (
            <button key={assento.numero}
              disabled={assento.ocupado}
              className={assento.ocupado ? 'ocupado' : assento.selecionado ? 'selecionado' : ''}
              onClick={()=>toggleAssento(assento.numero)}>
              {assento.numero}
            </button>
          ))}
        </div>
        <p>Assentos ocupados em vermelho, livres em cinza, selecionados em verde.</p>
      </section>

      <section className="reserva-form">
        <h3>Reserva</h3>
        <form onSubmit={reservar}>
          <label>Nome completo</label>
          <input value={nome} onChange={(e)=>setNome(e.target.value)} placeholder="Ex: Ana Maria" />

          <label>Email</label>
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="email@exemplo.com" />

          <label>Filme selecionado</label>
          <input value={filmeSelecionado?.titulo || "Nenhum filme"} disabled />

          <label>Sessão selecionada</label>
          <input value={String(sessaoSelecionada || "Nenhuma sessao").split("#")[0]} disabled />

          <div className="linha-ingressos">
            <div className="tipo-ingresso-card">
              <label>Inteira</label>
              <p>R$ 32,00</p>
              <div className="controle-qtd">
                <button type="button" onClick={()=>alterarQuantidade("inteira", "menos")}>-</button>
                <span>{qtdInteira}</span>
                <button type="button" onClick={()=>alterarQuantidade("inteira", "mais")}>+</button>
              </div>
            </div>

            <div className="tipo-ingresso-card">
              <label>Meia Entrada</label>
              <p>R$ 16,00</p>
              <div className="controle-qtd">
                <button type="button" onClick={()=>alterarQuantidade("meia", "menos")}>-</button>
                <span>{qtdMeia}</span>
                <button type="button" onClick={()=>alterarQuantidade("meia", "mais")}>+</button>
              </div>
            </div>
          </div>

          <p className="resumo-ingressos">
            Limite por compra: {MAX_INGRESSOS} ingressos. Selecionados: {totalIngressos} ingresso(s)
            {qtdInteira > 0 ? ` | Inteira: ${qtdInteira}` : ""}
            {qtdMeia > 0 ? ` | Meia: ${qtdMeia}` : ""}
          </p>

          <label>Assentos selecionados</label>
          <input value={assentosSelecionados.map((a)=>a.numero).join(', ') || 'Nenhum'} disabled />

          <label>Total da compra</label>
          <input value={`R$ ${valorTotal.toFixed(2)} (${totalIngressos} ingresso(s))`} disabled />

          <button type="submit">Confirmar compra</button>
        </form>
        {feedback.texto && <p className={`feedback ${feedback.tipo}`}>{feedback.texto}</p>}
      </section>
    </main>
  );
}

export default Produtos;
