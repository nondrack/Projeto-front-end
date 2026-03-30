import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { api } from "../services/api";
import "./MinhasCompras.css";

function MinhasCompras() {
  const sessaoAtiva = JSON.parse(localStorage.getItem("cineMaxSession") || "null");
  const isLoggedIn = Boolean(sessaoAtiva?.email);
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const totalPago = useMemo(
    () => compras.reduce((acc, compra) => acc + Number(compra.valor || 0), 0),
    [compras]
  );

  useEffect(() => {
    async function carregarCompras() {
      if (!isLoggedIn) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setErro("");

      try {
        const historico = await api.get("/me/compras");
        setCompras(Array.isArray(historico) ? historico : []);
      } catch (error) {
        setErro(error.message || "Nao foi possivel carregar suas compras.");
      } finally {
        setLoading(false);
      }
    }

    carregarCompras();
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <Navigate to="/login?redirect=/minhas-compras" replace />;
  }

  return (
    <main className="compras-page">
      <section className="compras-card">
        <h2>Minhas Compras</h2>
        <p className="compras-subtitle">Historico de ingressos e pagamentos realizados na plataforma.</p>

        {loading && <p>Carregando compras...</p>}
        {!loading && erro && <p className="compras-erro">{erro}</p>}
        {!loading && !erro && compras.length === 0 && (
          <p>Voce ainda nao possui compras registradas.</p>
        )}

        {!loading && !erro && compras.length > 0 && (
          <>
            <div className="compras-resumo">
              <strong>Total de compras:</strong> {compras.length}
              <span>
                <strong>Valor total:</strong> R$ {totalPago.toFixed(2)}
              </span>
            </div>

            <div className="compras-lista">
              {compras.map((compra) => (
                <article key={compra.id} className="compra-item">
                  <h3>{compra.filme}</h3>
                  <p><strong>Ingresso:</strong> #{compra.id}</p>
                  <p><strong>Sessao:</strong> {compra.sessao}</p>
                  <p><strong>Assento:</strong> {compra.assento}</p>
                  <p><strong>Metodo:</strong> {compra.metodo}</p>
                  <p><strong>Valor:</strong> R$ {Number(compra.valor).toFixed(2)}</p>
                  <p><strong>Compra:</strong> {compra.dataCompra}</p>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default MinhasCompras;
