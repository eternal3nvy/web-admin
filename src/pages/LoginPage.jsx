import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import { loginWithCredentials } from "../services/authService";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");

  const { login, isAuthenticated, isInitializing } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      navigate("/");
    }
  }, [isInitializing, isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginWithCredentials(email, password);

      login(data.token);

      navigate("/");
    } catch (err) {
      setFeedback("Login failed");
    }
  };

  return (
    <div className="">
        <span>{feedback}</span>
      <form
        onSubmit={handleSubmit}
      >
        <h1>
          Admin Login
        </h1>

        <input
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button>
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;