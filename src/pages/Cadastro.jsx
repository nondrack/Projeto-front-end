import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import "./Cadastro.css";

function Cadastro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
    confirmarSenha: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const nextErrors = {};

    if (!formData.nome.trim()) {
      nextErrors.nome = "Informe seu nome completo.";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Informe um e-mail valido.";
    }

    if (formData.telefone.replace(/\D/g, "").length < 10) {
      nextErrors.telefone = "Informe um telefone com DDD.";
    }

    if (formData.senha.length < 6) {
      nextErrors.senha = "A senha deve ter ao menos 6 caracteres.";
    }

    if (formData.confirmarSenha !== formData.senha) {
      nextErrors.confirmarSenha = "As senhas nao conferem.";
    }

    const users = JSON.parse(localStorage.getItem("cineMaxUsers") || "[]");
    const emailExistsLocal = users.some(
      (item) => item.email.toLowerCase() === formData.email.toLowerCase()
    );

    if (emailExistsLocal) {
      nextErrors.email = "Este e-mail ja esta cadastrado.";
    }

    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setMessage("");
      return;
    }

    try {
      const usersApi = await api.get("/users");
      const emailExistsApi = usersApi.some(
        (item) => item.email.toLowerCase() === formData.email.trim().toLowerCase()
      );

      if (emailExistsApi) {
        setErrors({ email: "Este e-mail ja esta cadastrado." });
        setMessage("");
        return;
      }

      await api.post("/users", {
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        senha: formData.senha,
        tipo_usuario: "cliente",
      });

      setMessage("Cadastro concluido com sucesso. Redirecionando para o login...");
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      setMessage(error.message || "Nao foi possivel concluir o cadastro.");
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="cadastro-title">
        <p className="auth-badge">Crie sua conta</p>
        <h2 id="cadastro-title">Cadastro</h2>
        <p className="auth-subtitle">
          Cadastre-se para comprar mais rapido e salvar seus filmes favoritos.
        </p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="nome">Nome completo</label>
          <input
            id="nome"
            name="nome"
            type="text"
            placeholder="Seu nome"
            value={formData.nome}
            onChange={handleChange}
            autoComplete="name"
          />
          {errors.nome && <small className="error-text">{errors.nome}</small>}

          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="voce@email.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
          />
          {errors.email && <small className="error-text">{errors.email}</small>}

          <label htmlFor="telefone">Telefone</label>
          <input
            id="telefone"
            name="telefone"
            type="tel"
            placeholder="(11) 99999-9999"
            value={formData.telefone}
            onChange={handleChange}
            autoComplete="tel"
          />
          {errors.telefone && (
            <small className="error-text">{errors.telefone}</small>
          )}

          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            name="senha"
            type="password"
            placeholder="Minimo 6 caracteres"
            value={formData.senha}
            onChange={handleChange}
            autoComplete="new-password"
          />
          {errors.senha && <small className="error-text">{errors.senha}</small>}

          <label htmlFor="confirmarSenha">Confirmar senha</label>
          <input
            id="confirmarSenha"
            name="confirmarSenha"
            type="password"
            placeholder="Repita sua senha"
            value={formData.confirmarSenha}
            onChange={handleChange}
            autoComplete="new-password"
          />
          {errors.confirmarSenha && (
            <small className="error-text">{errors.confirmarSenha}</small>
          )}

          <button type="submit">Criar conta</button>

          {message && <p className="status-text">{message}</p>}
        </form>

        <p className="auth-footer">
          Ja tem conta? <Link to="/login">Fazer login</Link>
        </p>
      </section>
    </main>
  );
}

export default Cadastro;
