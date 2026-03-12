import { Link } from "react-router-dom";
import "./Home.css";

const filmesDestaque = [
    {
        titulo: "Cosmic Show",
        genero: "Acao e Aventura",
        horarios: [
            { dia: "Seg", hora: "14:20" },
            { dia: "Qua", hora: "17:10" },
            { dia: "Sex", hora: "20:05" }
        ],
        imagem: "https://i.imgur.com/8w1NikM.jpg"
    },
    {
        titulo: "Noite no Vazio",
        genero: "Terror Sci-Fi",
        horarios: [
            { dia: "Ter", hora: "15:40" },
            { dia: "Qui", hora: "19:00" },
            { dia: "Sab", hora: "22:15" }
        ],
        imagem: "https://i.imgur.com/cH3kBRq.jpg"
    },
    {
        titulo: "Coracao de Jazz",
        genero: "Drama Musical",
        horarios: [
            { dia: "Seg", hora: "13:30" },
            { dia: "Qui", hora: "16:50" },
            { dia: "Dom", hora: "20:30" }
        ],
        imagem: "https://i.imgur.com/qIYkVKY.jpg"
    },
    {
        titulo: "A Jornada",
        genero: "Fantasia",
        horarios: [
            { dia: "Ter", hora: "14:00" },
            { dia: "Sex", hora: "18:20" },
            { dia: "Sab", hora: "21:00" }
        ],
        imagem: "https://i.imgur.com/ufrzeZ1.jpg"
    }
];

function Home(){
    return(
        <main className="home-cinemax">
            <section className="hero-home">
                <p className="hero-tag">Experiencia Premium</p>
                <h1>CINE MAX</h1>
                <p>
                    O cinema que transforma cada sessao em evento. Telas gigantes, som imersivo,
                    poltronas confortaveis e os melhores lancamentos da semana.
                </p>
                <div className="hero-actions">
                    <Link to="/produtos" className="btn-principal">Ver cartaz completo</Link>
                    <a href="#destaques" className="btn-secundario">Filmes em destaque</a>
                </div>
            </section>

            <section className="faixas-info">
                <article>
                    <h3>4 Salas 3D</h3>
                    <p>Tecnologia de projecao a laser e audio Dolby para uma experiencia intensa.</p>
                </article>
                <article>
                    <h3>Combo Especial</h3>
                    <p>Pipoca grande + refrigerante refil com descontos em sessoes noturnas.</p>
                </article>
                <article>
                    <h3>Assento Marcado</h3>
                    <p>Escolha seu lugar com antecedencia e entre na sala sem filas.</p>
                </article>
            </section>

            <section id="destaques" className="destaques-home">
                <div className="titulo-destaques">
                    <h2>Filmes em destaque</h2>
                    <p>Selecao especial do CINE MAX para os proximos dias.</p>
                </div>

                <div className="grid-destaques">
                    {filmesDestaque.map((filme) => (
                        <article className="card-destaque" key={filme.titulo}>
                            <img src={filme.imagem} alt={filme.titulo} />
                            <div className="conteudo-card">
                                <h3>{filme.titulo}</h3>
                                <p>{filme.genero}</p>
                                <div className="horarios-card">
                                    {filme.horarios.map((sessao) => (
                                        <span key={`${sessao.dia}-${sessao.hora}`}>{sessao.dia} - {sessao.hora}</span>
                                    ))}
                                </div>
                                <Link to="/produtos" className="btn-card">Reservar ingresso</Link>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}

export default Home;