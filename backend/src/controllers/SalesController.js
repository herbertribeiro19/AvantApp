const { Op } = require("sequelize");
const Sale = require("../models/Sale");
const Client = require("../models/Client");

class SalesController {
  async store(req, res) {
    try {
      const { client_id, value, date, description } = req.body;

      // Criar data com horário fixo (12:00) para evitar problemas de timezone
      let saleDate;
      if (date && !date.includes("T")) {
        saleDate = new Date(date + "T12:00:00-03:00");
      } else if (date) {
        saleDate = new Date(date);
      } else {
        // Se não tem data, usa hoje às 12:00 no timezone brasileiro
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        saleDate = new Date(`${year}-${month}-${day}T12:00:00-03:00`);
      }

      const sale = await Sale.create({
        client_id,
        value,
        date: saleDate,
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
        // Criar datas com timezone do Brasil (UTC-3)
        const startDate = new Date(date + "T00:00:00-03:00");
        const endDate = new Date(date + "T23:59:59-03:00");

        where.date = {
          [Op.between]: [startDate, endDate],
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

  async weeklyStats(req, res) {
    try {
      // Usado timezone do Brasil (UTC-3), para evitar problemas de timezone na listagem das vendas
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

      const startDate = new Date(
        sevenDaysAgo.toISOString().split("T")[0] + "T00:00:00-03:00"
      );
      const endDate = new Date(
        today.toISOString().split("T")[0] + "T23:59:59-03:00"
      );

      const sales = await Sale.findAll({
        attributes: [
          [Sale.sequelize.fn("DATE", Sale.sequelize.col("date")), "date"],
          [Sale.sequelize.fn("SUM", Sale.sequelize.col("value")), "total"],
        ],
        where: {
          date: {
            [Op.between]: [startDate, endDate],
          },
        },
        group: [Sale.sequelize.fn("DATE", Sale.sequelize.col("date"))],
        order: [Sale.sequelize.fn("DATE", Sale.sequelize.col("date"))],
      });

      const weekData = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(sevenDaysAgo);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split("T")[0];

        const saleForDate = sales.find(
          (sale) => sale.dataValues.date === dateStr
        );
        weekData.push({
          date: dateStr,
          total: saleForDate ? parseFloat(saleForDate.dataValues.total) : 0,
        });
      }

      return res.json(weekData);
    } catch (error) {
      return res
        .status(400)
        .json({ error: "Erro ao buscar estatísticas semanais" });
    }
  }
}

module.exports = new SalesController();
