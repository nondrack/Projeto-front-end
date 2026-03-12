import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./componentes/Headers";
import Footer from "./componentes/Footer";
import Contato from "./pages/Contato";
import Home from "./pages/Home";
import Produtos from "./pages/Produtos";
import Sobre from "./pages/Sobre";

function App(){
  return(
    <div className="app-shell">
      <Header/>
      <div className="app-main">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/produtos" element={<Produtos/>}/>
          <Route path="/contato" element={<Contato/>} />
          <Route path="/sobre" element={<Sobre/>} />
        </Routes>
      </div>
      <Footer/>
    </div>
  )
}

export default App;