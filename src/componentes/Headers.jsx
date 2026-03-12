import { NavLink } from "react-router-dom";
import "./Headers.css";

function Header(){
    const session = JSON.parse(localStorage.getItem("cineMaxSession") || "null");
    const isLoggedIn = Boolean(session?.email);

    function handleLogout() {
        localStorage.removeItem("cineMaxSession");
        localStorage.removeItem("cineMaxLastClienteId");
        window.location.href = "/login";
    }

    return(
        <header className="header">
        {/* ÁREA DA LOGO E DO NOME DA LOJA */}
            <div className="logo">
                <h1>CINE MAX</h1>
                <span className="logo_subtitle">Sua sala de estreia</span>
            </div>

        {/* ÁREA DO MENU DE NAVEGAÇÃO */}
        <nav className="menu_header" aria-label="Menu principal">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/produtos">Produtos</NavLink>
            <NavLink to="/contato">Contato</NavLink>
            <NavLink to="/sobre">Sobre</NavLink>
            {isLoggedIn && <NavLink to="/minhas-compras">Minhas Compras</NavLink>}
            {isLoggedIn ? (
                <button type="button" className="btn-logar btn-sair" onClick={handleLogout}>Sair</button>
            ) : (
                <NavLink to="/login" className="btn-logar">Logar</NavLink>
            )}
        </nav>
        </header>
    );
}

export default Header;