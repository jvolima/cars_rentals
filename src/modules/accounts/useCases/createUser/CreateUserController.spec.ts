import { Connection, SimpleConsoleLogger } from "typeorm";
import request from "supertest"
import createConnection from "@shared/infra/typeorm"
import { app } from "@shared/infra/http/app"

let connection: Connection
describe("Create user controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("should be able to create a new user", async () => {
    const response = await request(app).post("/users")
    .send({
      name: "User test",
      email: "user@test.com",
      password: "test",
      driver_license: "123456"
    })

    expect(response.status).toBe(201)
  })

  it("should not be able to create a new user if email already exists", async () => {
    const response = await request(app).post("/users")
    .send({
      name: "User test",
      email: "user@test.com",
      password: "test",
      driver_license: "123456"
    })
    
    expect(response.status).toBe(400)
  })
})