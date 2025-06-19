const request = require("supertest");
const app = require("../../src/app");
const connection = require("../../src/database");

describe("Client", () => {
  beforeAll(async () => {
    await connection.sync({ force: true });
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should create a new client", async () => {
    const response = await request(app)
      .post("/api/clients")
      .send({
        name: "João Silva",
        email: "joao@email.com",
        phone: "11999999999",
        address: "Rua A, 123",
      })
      .set("Authorization", "Bearer seu_token_aqui");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
  });
});
