import { Link } from "react-router-dom";
import "./Home.css";

const filmesDestaque = [
    {
        titulo: "Cosmic Show",
        genero: "Acao e Aventura",
        horario: "Hoje - 19:20",
        imagem: "https://i.imgur.com/8w1NikM.jpg"
    },
    {
        titulo: "Noite no Vazio",
        genero: "Terror Sci-Fi",
        horario: "Hoje - 21:45",
        imagem: "https://i.imgur.com/cH3kBRq.jpg"
    },
    {
        titulo: "Coracao de Jazz",
        genero: "Drama Musical",
        horario: "Amanha - 18:10",
        imagem: "https://i.imgur.com/qIYkVKY.jpg"
    },
    {
        titulo: "A Jornada",
        genero: "Fantasia",
        horario: "Amanha - 20:30",
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
                                <span>{filme.horario}</span>
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