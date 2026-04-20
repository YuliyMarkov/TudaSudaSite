import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest, setStoredToken } from "../api/auth";

function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setSubmitError("");

      const { token } = await loginRequest({
        email: form.email.trim(),
        password: form.password,
      });

      setStoredToken(token);
      navigate("/dashboard", { replace: true });
      window.location.reload();
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      setSubmitError(error.message || "Не удалось войти");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Вход в админку</h1>
        <p className="login-subtitle">
          Введите данные администратора, чтобы продолжить.
        </p>

        {submitError ? <div className="admin-error">{submitError}</div> : null}

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="admin-field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              autoComplete="username"
              required
            />
          </label>

          <label className="admin-field">
            <span>Пароль</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Введите пароль"
              autoComplete="current-password"
              required
            />
          </label>

          <button type="submit" className="primary-btn login-btn" disabled={isSubmitting}>
            {isSubmitting ? "Вход..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;