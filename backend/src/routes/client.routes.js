const express = require("express");
const ClientController = require("../controllers/ClientController");
const authMiddleware = require("../middlewares/auth");

const routes = express.Router();

routes.use(authMiddleware);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/clients:
 *   post:
 *     summary: Cria um novo cliente
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do cliente
 *               email:
 *                 type: string
 *                 description: Email do cliente
 *               phone:
 *                 type: string
 *                 description: Telefone do cliente
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 description: Data de nascimento do cliente (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Cliente criado com sucesso
 *       401:
 *         description: Não autorizado
 */
routes.post("/clients", ClientController.store);

/**
 * @swagger
 * /api/clients:
 *   get:
 *     summary: Lista todos os clientes
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrar por nome
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filtrar por email
 *     responses:
 *       200:
 *         description: Lista de clientes
 *       401:
 *         description: Não autorizado
 */
routes.get("/clients", ClientController.index);

/**
 * @swagger
 * /api/clients/{id}:
 *   get:
 *     summary: Busca um cliente específico
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Dados do cliente
 *       404:
 *         description: Cliente não encontrado
 *       401:
 *         description: Não autorizado
 */
routes.get("/clients/:id", ClientController.show);

/**
 * @swagger
 * /api/clients/{id}:
 *   put:
 *     summary: Atualiza um cliente
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 description: Data de nascimento do cliente (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *       404:
 *         description: Cliente não encontrado
 *       401:
 *         description: Não autorizado
 */
routes.put("/clients/:id", ClientController.update);

/**
 * @swagger
 * /api/clients/{id}:
 *   delete:
 *     summary: Remove um cliente
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Cliente removido com sucesso
 *       404:
 *         description: Cliente não encontrado
 *       401:
 *         description: Não autorizado
 */
routes.delete("/clients/:id", ClientController.destroy);

module.exports = routes;
