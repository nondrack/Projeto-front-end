import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const nextErrors = {};

    if (!formData.email.trim()) {
      nextErrors.email = "Informe seu e-mail.";
    }

    if (!formData.senha) {
      nextErrors.senha = "Informe sua senha.";
    }

    return nextErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setMessage("");
      return;
    }

    const raw = localStorage.getItem("cineMaxUsers");
    const users = raw ? JSON.parse(raw) : [];

    const user = users.find(
      (item) =>
        item.email.toLowerCase() === formData.email.toLowerCase() &&
        item.senha === formData.senha
    );

    if (!user) {
      setMessage("E-mail ou senha invalido.");
      return;
    }

    localStorage.setItem(
      "cineMaxSession",
      JSON.stringify({
        nome: user.nome,
        email: user.email,
        loggedInAt: new Date().toISOString(),
      })
    );

    setMessage("Login realizado com sucesso. Redirecionando...");
    setTimeout(() => navigate("/"), 900);
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-title">
        <p className="auth-badge">Acesse sua conta</p>
        <h2 id="login-title">Login</h2>
        <p className="auth-subtitle">
          Entre para acompanhar pedidos, favoritos e novidades da CINE MAX.
        </p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
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

          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            name="senha"
            type="password"
            placeholder="Sua senha"
            value={formData.senha}
            onChange={handleChange}
            autoComplete="current-password"
          />
          {errors.senha && <small className="error-text">{errors.senha}</small>}

          <button type="submit">Entrar</button>

          {message && <p className="status-text">{message}</p>}
        </form>

        <p className="auth-footer">
          Nao tem conta? <Link to="/cadastro">Criar cadastro</Link>
        </p>
      </section>
    </main>
  );
}

export default Login;
