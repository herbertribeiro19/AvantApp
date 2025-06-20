const request = require("supertest");
const app = require("../../src/app");
const connection = require("../../src/database");

describe("Client", () => {
  let authToken;

  beforeAll(async () => {
    await connection.sync({ force: true });

    // Criar um usuário para teste
    await request(app).post("/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    // Fazer login para obter token
    const loginResponse = await request(app).post("/auth/authenticate").send({
      email: "test@example.com",
      password: "password123",
    });

    console.log("Login status:", loginResponse.status);
    console.log("Login body:", loginResponse.body);

    authToken = loginResponse.body.token;
    console.log("Token:", authToken);
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
        birthDate: "1990-01-01",
      })
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("João Silva");
    expect(response.body.email).toBe("joao@email.com");
  });

  it("should list clients", async () => {
    const response = await request(app)
      .get("/api/clients")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
