const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());

// Em produção coloque isso em variável de ambiente
const SECRET = "secret123";

// Usuário fixo só para teste
const user = {
  email: "teste@teste.com",
  passwordHash: bcrypt.hashSync("123456", 8)
};

// ---------------- LOGIN ----------------
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email !== user.email) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  const token = jwt.sign({ email }, SECRET, { expiresIn: "1h" });

  return res.json({ token });
});

// ---------- Middleware para validar o token ----------
function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ error: "Token obrigatório" });

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer")
    return res.status(401).json({ error: "Formato inválido" });

  try {
    jwt.verify(token, SECRET);
    return next();
  } catch (e) {
    return res.status(403).json({ error: "Token inválido ou expirado" });
  }
}

// ---------------- ROTA PRIVADA ----------------
app.get("/private", auth, (req, res) => {
  return res.json({ message: "Acesso autorizado! 🎉" });
});

// ---------------- INICIAR SERVIDOR ----------------
app.listen(3001, () => console.log("Server on http://localhost:3001"));