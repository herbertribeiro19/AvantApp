const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      if (await User.findOne({ where: { email } })) {
        return res.status(400).json({ error: "Usuário já existe" });
      }

      const user = await User.create({
        name,
        email,
        password,
      });

      user.password = undefined;

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      return res.json({ user, token });
    } catch (error) {
      return res.status(400).json({ error: "Falha no registro" });
    }
  }

  async authenticate(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(400).json({ error: "Usuário não encontrado" });
      }

      if (!(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ error: "Senha inválida" });
      }

      user.password = undefined;

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      return res.json({ user, token });
    } catch (error) {
      return res.status(400).json({ error: "Falha na autenticação" });
    }
  }
}

module.exports = new AuthController();
