import { useState } from "react";
import "./App.css";

export default function App() {
  const [username, setUsername] = useState("user");
  const [password, setPassword] = useState("123456");
  const [token, setToken] = useState(sessionStorage.getItem("token") || "");
  const [privateMsg, setPrivateMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) return setError(data.error);

      sessionStorage.setItem("token", data.token);
      setToken(data.token);
    } catch {
      setLoading(false);
      setError("Erro ao conectar ao servidor");
    }
  }

  async function acessarPrivate() {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/private", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) return setError(data.error);

      setPrivateMsg(data.message);
    } catch {
      setLoading(false);
      setError("Erro ao conectar ao servidor");
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Login</h1>

        {!token ? (
          <form onSubmit={login}>
            <input
              type="text"
              placeholder="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">
              {loading ? "Entrando..." : "Entrar"}
            </button>

            {error && <p className="error">{error}</p>}
          </form>
        ) : (
          <div className="logado">
            <p className="sucesso">Você está logado!</p>

            <button onClick={acessarPrivate} disabled={loading}>
              {loading ? "Carregando..." : "Acessar área privada"}
            </button>

            {privateMsg && <p className="msg">{privateMsg}</p>}
            {error && <p className="error">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
