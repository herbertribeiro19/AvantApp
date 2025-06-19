const express = require("express");
const SalesController = require("../controllers/SalesController");
const authMiddleware = require("../middlewares/auth");

const routes = express.Router();

routes.use(authMiddleware);

/**
 * @swagger
 * /api/sales:
 *   post:
 *     summary: Cria uma nova venda
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - client_id
 *               - value
 *             properties:
 *               client_id:
 *                 type: integer
 *                 description: ID do cliente
 *               value:
 *                 type: number
 *                 description: Valor da venda
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Data da venda
 *               description:
 *                 type: string
 *                 description: Descrição da venda
 *     responses:
 *       200:
 *         description: Venda criada com sucesso
 *       401:
 *         description: Não autorizado
 */
routes.post("/sales", SalesController.store);

/**
 * @swagger
 * /api/sales/daily-stats:
 *   get:
 *     summary: Retorna estatísticas de vendas por dia
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Data específica (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Estatísticas diárias
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                   description: Total de vendas do dia
 *       401:
 *         description: Não autorizado
 */
routes.get("/sales/daily-stats", SalesController.dailyStats);

/**
 * @swagger
 * /api/sales/client-stats:
 *   get:
 *     summary: Retorna estatísticas dos clientes
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas dos clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 highestVolume:
 *                   type: object
 *                   description: Cliente com maior volume de vendas
 *                 highestAverage:
 *                   type: object
 *                   description: Cliente com maior média de valor por venda
 *                 mostFrequent:
 *                   type: object
 *                   description: Cliente com maior frequência de compra
 *       401:
 *         description: Não autorizado
 */
routes.get("/sales/client-stats", SalesController.clientStats);

module.exports = routes;
