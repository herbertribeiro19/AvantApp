const { Op } = require("sequelize");
const Sale = require("../models/Sale");
const Client = require("../models/Client");

class SalesController {
  async store(req, res) {
    try {
      const { client_id, value, date, description } = req.body;

      const sale = await Sale.create({
        client_id,
        value,
        date,
        description,
      });

      return res.json(sale);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao criar venda" });
    }
  }

  async dailyStats(req, res) {
    try {
      const { date } = req.query;
      const where = {};

      if (date) {
        where.date = {
          [Op.between]: [
            new Date(date + " 00:00:00"),
            new Date(date + " 23:59:59"),
          ],
        };
      }

      const total = await Sale.sum("value", { where });

      return res.json({ total: total || 0 });
    } catch (error) {
      return res.status(400).json({ error: "Erro ao buscar estatísticas" });
    }
  }

  async clientStats(req, res) {
    try {
      const [highestVolume, highestAverage, mostFrequent] = await Promise.all([
        // Cliente com maior volume de vendas
        Sale.findAll({
          attributes: [
            "client_id",
            [
              Sale.sequelize.fn("SUM", Sale.sequelize.col("value")),
              "total_volume",
            ],
          ],
          include: [
            {
              model: Client,
              as: "client",
              attributes: ["name", "email"],
            },
          ],
          group: ["client_id"],
          order: [
            [Sale.sequelize.fn("SUM", Sale.sequelize.col("value")), "DESC"],
          ],
          limit: 1,
        }),

        // Cliente com maior média de valor por venda
        Sale.findAll({
          attributes: [
            "client_id",
            [
              Sale.sequelize.fn("AVG", Sale.sequelize.col("value")),
              "average_value",
            ],
          ],
          include: [
            {
              model: Client,
              as: "client",
              attributes: ["name", "email"],
            },
          ],
          group: ["client_id"],
          order: [
            [Sale.sequelize.fn("AVG", Sale.sequelize.col("value")), "DESC"],
          ],
          limit: 1,
        }),

        // Cliente com maior número de dias únicos com vendas
        Sale.findAll({
          attributes: [
            "client_id",
            [
              Sale.sequelize.fn(
                "COUNT",
                Sale.sequelize.fn(
                  "DISTINCT",
                  Sale.sequelize.fn("DATE", Sale.sequelize.col("date"))
                )
              ),
              "unique_days",
            ],
          ],
          include: [
            {
              model: Client,
              as: "client",
              attributes: ["name", "email"],
            },
          ],
          group: ["client_id"],
          order: [
            [
              Sale.sequelize.fn(
                "COUNT",
                Sale.sequelize.fn(
                  "DISTINCT",
                  Sale.sequelize.fn("DATE", Sale.sequelize.col("date"))
                )
              ),
              "DESC",
            ],
          ],
          limit: 1,
        }),
      ]);

      return res.json({
        highestVolume: highestVolume[0] || null,
        highestAverage: highestAverage[0] || null,
        mostFrequent: mostFrequent[0] || null,
      });
    } catch (error) {
      return res
        .status(400)
        .json({ error: "Erro ao buscar estatísticas dos clientes" });
    }
  }
}

module.exports = new SalesController();
