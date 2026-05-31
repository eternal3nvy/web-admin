import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { loginWithCredentials } from "../services/authService";
import { checkEmail } from "../utils/validators";
import BrandLogo from "../components/BrandLogo";
import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback("");

    if (!email || !password) {
      setFeedback("Будь ласка, введіть email та пароль");
      return;
    }

    if (!checkEmail(email)) {
      setFeedback("Невірний формат email адреси");
      return;
    }

    try {
      setIsLoading(true);
      const data = await loginWithCredentials(email, password);
      login(data.token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setFeedback(
        err.response?.data?.error || "Не вдалося увійти. Спробуйте ще раз"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <BrandLogo size={40} className="login-brand-icon mx-auto" />
          <h1>Antiques Auction</h1>
          <p>Admin dashboard</p>
        </div>

        {feedback && (
          <div className="alert alert-danger py-2" role="alert">
            {feedback}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={isLoading}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 btn-login"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />
                Вхід...
              </>
            ) : (
              "Увійти"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
