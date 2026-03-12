import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./componentes/Headers";
import Footer from "./componentes/Footer";
import Contato from "./pages/Contato";
import Cadastro from "./pages/Cadastro";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MinhasCompras from "./pages/MinhasCompras";
import Produtos from "./pages/Produtos";
import Sobre from "./pages/Sobre";

function App(){
  const session = JSON.parse(localStorage.getItem("cineMaxSession") || "null");
  const isLoggedIn = Boolean(session?.email);

  return(
    <div className="app-shell">
      <Header/>
      <div className="app-main">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/produtos" element={<Produtos/>}/>
          <Route path="/contato" element={<Contato/>} />
          <Route path="/sobre" element={<Sobre/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/cadastro" element={<Cadastro/>} />
          <Route
            path="/minhas-compras"
            element={
              isLoggedIn ? (
                <MinhasCompras/>
              ) : (
                <Navigate to="/login?redirect=/minhas-compras" replace />
              )
            }
          />
        </Routes>
      </div>
      <Footer/>
    </div>
  )
}

export default App;