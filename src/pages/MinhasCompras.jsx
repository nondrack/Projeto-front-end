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
        const sessaoLocal = JSON.parse(localStorage.getItem("cineMaxSession") || "null");
        const rawMap = localStorage.getItem("cineMaxClienteByEmail") || "{}";
        const clienteMap = JSON.parse(rawMap);
        const emailLogado = String(sessaoLocal?.email || "").toLowerCase();
        const clienteIdMapeado = Number(clienteMap[emailLogado] || 0);

        const [clientes, ingressos, pagamentos, sessoes, filmes, assentos] = await Promise.all([
          api.get("/clientes"),
          api.get("/ingressos"),
          api.get("/pagamentos"),
          api.get("/sessoes"),
          api.get("/filmes"),
          api.get("/assentos"),
        ]);

        const clientesPorEmail = sessaoLocal?.email
          ? clientes.filter((item) => item.email?.toLowerCase() === sessaoLocal.email.toLowerCase())
          : [];

        const clienteIds = new Set(
          clientesPorEmail.map((item) => Number(item.id_cliente)).filter((id) => id > 0)
        );

        if (clienteIdMapeado) {
          clienteIds.add(Number(clienteIdMapeado));
        }

        if (clienteIds.size === 0) {
          setCompras([]);
          return;
        }

        const ingressosDoCliente = ingressos.filter(
          (ingresso) => clienteIds.has(Number(ingresso.id_cliente))
        );

        const sessoesMap = new Map(sessoes.map((sessao) => [Number(sessao.id_sessao), sessao]));
        const filmesMap = new Map(filmes.map((filme) => [Number(filme.id_filme), filme]));
        const assentosMap = new Map(assentos.map((assento) => [Number(assento.id_assento), assento]));
        const pagamentosMap = new Map(
          pagamentos.map((pagamento) => [Number(pagamento.id_ingresso), pagamento])
        );

        const historico = ingressosDoCliente.map((ingresso) => {
          const sessao = sessoesMap.get(Number(ingresso.id_sessao));
          const filme = sessao ? filmesMap.get(Number(sessao.id_filme)) : null;
          const assentoInfo = assentosMap.get(Number(ingresso.id_assento));
          const pagamento = pagamentosMap.get(Number(ingresso.id_ingresso));

          return {
            id: ingresso.id_ingresso,
            filme: filme?.titulo || "Filme nao encontrado",
            sessao: sessao?.horario
              ? new Date(sessao.horario).toLocaleString("pt-BR")
              : "Horario nao informado",
            assento: assentoInfo
              ? `${assentoInfo.fila || ""}${assentoInfo.numero || ""}`.trim() || `ID ${ingresso.id_assento}`
              : `ID ${ingresso.id_assento}`,
            valor: pagamento?.valor || 0,
            metodo: pagamento?.metodo_pagamento || "Nao informado",
            dataCompra: ingresso.data_compra
              ? new Date(ingresso.data_compra).toLocaleString("pt-BR")
              : "Data nao informada",
          };
        });

        setCompras(historico);
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
