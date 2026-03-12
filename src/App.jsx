import { Route, Routes } from "react-router-dom";
import Header from "./componentes/Headers";
import Home from "./pages/Home";
import Produtos from "./pages/Produtos";

function App(){
  return(
    <>
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/produtos" element={<Produtos/>}/>
        <Route path="/contato" element={
          <main className="home">
            <h1>Contato - CINE MAX</h1>
            <p>Fale conosco pelo e-mail contato@cinemax.com ou telefone (11) 4002-8922.</p>
          </main>
        } />
        <Route path="/sobre" element={
          <main className="home">
            <h1>Sobre o CINE MAX</h1>
            <p>O melhor cinema da cidade, com telas imersivas, poltronas reclináveis e experiências de lançamento.</p>
          </main>
        } />
      </Routes>
    </>
  )
}

export default App;