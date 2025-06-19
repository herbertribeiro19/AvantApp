const { Op } = require("sequelize");
const Client = require("../models/Client");

class ClientController {
  async store(req, res) {
    try {
      const { name, email, phone, address } = req.body;

      const client = await Client.create({
        name,
        email,
        phone,
        address,
      });

      return res.json(client);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao criar cliente" });
    }
  }

  async index(req, res) {
    try {
      const { name, email } = req.query;
      const where = {};

      if (name) {
        where.name = { [Op.like]: `%${name}%` };
      }

      if (email) {
        where.email = { [Op.like]: `%${email}%` };
      }

      const clients = await Client.findAll({ where });

      return res.json(clients);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao listar clientes" });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const client = await Client.findByPk(id);

      if (!client) {
        return res.status(404).json({ error: "Cliente não encontrado" });
      }

      return res.json(client);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao buscar cliente" });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, email, phone, address } = req.body;

      const client = await Client.findByPk(id);

      if (!client) {
        return res.status(404).json({ error: "Cliente não encontrado" });
      }

      await client.update({
        name,
        email,
        phone,
        address,
      });

      return res.json(client);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao atualizar cliente" });
    }
  }

  async destroy(req, res) {
    try {
      const { id } = req.params;
      const client = await Client.findByPk(id);

      if (!client) {
        return res.status(404).json({ error: "Cliente não encontrado" });
      }

      await client.destroy();

      return res.json({ message: "Cliente deletado com sucesso" });
    } catch (error) {
      return res.status(400).json({ error: "Erro ao deletar cliente" });
    }
  }
}

module.exports = new ClientController();
