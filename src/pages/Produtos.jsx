import { useEffect, useMemo, useState } from "react";
import "./Produtos.css";

const filmesIniciais = [
  {
    id: 1,
    titulo: "Guardians of the Galaxy: Cosmic Show",
    duracao: "2h 20m",
    genero: "Ação",
    sinopse: "Aventuras intergalácticas, humor ácido e uma trilha sonora poderosa.",
    poster: "https://i.imgur.com/8w1NikM.jpg",
    classificacao: "12+",
    sessoes: ["14:20", "17:10", "20:05"]
  },
  {
    id: 2,
    titulo: "Noite de Terror no Espaço",
    duracao: "1h 52m",
    genero: "Terror",
    sinopse: "Uma estação abandonada e segredos que vão testar os limites dos heróis.",
    poster: "https://i.imgur.com/cH3kBRq.jpg",
    classificacao: "16+",
    sessoes: ["15:40", "19:00", "22:15"]
  },
  {
    id: 3,
    titulo: "Coração de Jazz",
    duracao: "2h 3m",
    genero: "Drama",
    sinopse: "Uma jornada musical entre sonhos, perdas e reencontros no mundo do jazz.",
    poster: "https://i.imgur.com/qIYkVKY.jpg",
    classificacao: "Livre",
    sessoes: ["13:30", "16:50", "20:30"]
  },
  {
    id: 4,
    titulo: "A Jornada do Herói",
    duracao: "2h 10m",
    genero: "Fantasia",
    sinopse: "Um jovem aprendiz descobre um reino místico e uma missão perdida.",
    poster: "https://i.imgur.com/ufrzeZ1.jpg",
    classificacao: "12+",
    sessoes: ["14:00", "18:20", "21:00"]
  }
];

const PRECO_INTEIRA = 32;
const PRECO_MEIA = 16;
const MAX_INGRESSOS = 10;

function Produtos(){
  const [generoSelecionado, setGeneroSelecionado] = useState("Todos");
  const [filmeSelecionado, setFilmeSelecionado] = useState(filmesIniciais[0]);
  const [sessaoSelecionada, setSessaoSelecionada] = useState(filmesIniciais[0].sessoes[0]);
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

  const generos = useMemo(() => ["Todos", ...new Set(filmesIniciais.map((f) => f.genero))], []);

  const filmesFiltrados = useMemo(() => {
    if (generoSelecionado === "Todos") return filmesIniciais;
    return filmesIniciais.filter((f) => f.genero === generoSelecionado);
  }, [generoSelecionado]);

  useEffect(() => {
    if (!filmesFiltrados.some((filme) => filme.id === filmeSelecionado.id)) {
      setFilmeSelecionado(filmesFiltrados[0]);
    }
  }, [filmesFiltrados, filmeSelecionado.id]);

  useEffect(() => {
    setSessaoSelecionada(filmeSelecionado.sessoes[0]);
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

  function reservar(e){
    e.preventDefault();

    if(!nome.trim() || !email.trim()){
      setFeedback({ tipo: "erro", texto: "Preencha nome e email para continuar." });
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

    setFeedback({
      tipo: "sucesso",
      texto: `Compra confirmada! ${nome}, ${totalIngressos} ingresso(s) para '${filmeSelecionado.titulo}' na sessão ${sessaoSelecionada}. Total: R$ ${valorTotal.toFixed(2)}.`
    });

    setAssentos((old)=> old.map((a)=> a.selecionado ? { ...a, ocupado: true, selecionado: false } : a));
    setNome("");
    setEmail("");
    setQtdInteira(1);
    setQtdMeia(0);
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
        {filmesFiltrados.map((filme) => (
          <article key={filme.id} className={`filme-card ${filmeSelecionado.id === filme.id ? 'ativo' : ''}`} onClick={()=>setFilmeSelecionado(filme)}>
            <img src={filme.poster} alt={filme.titulo} />
            <h2>{filme.titulo}</h2>
            <span>{filme.genero} • {filme.duracao}</span>
          </article>
        ))}
      </section>

      <section className="detalhes-filme">
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
                {sessao}
              </button>
            ))}
          </div>
        </div>
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
          <input value={filmeSelecionado.titulo} disabled />

          <label>Sessão selecionada</label>
          <input value={sessaoSelecionada} disabled />

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
