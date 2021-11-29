import { app } from "@shared/infra/http/app";
import request from "supertest";
import { Connection } from "typeorm";
import createConnection from "@shared/infra/typeorm"
import { v4 as uuidv4 } from "uuid";
import { hash } from "bcrypt";

let connection: Connection
describe("Create Category Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const admId = uuidv4();
    const admPassword = await hash("admin", 8)

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
      values('${admId}', 'admin', 'admin@rentx.com.br', '${admPassword}', true, 'now()', 'xxxxxx')`
    );

    const userId = uuidv4();
    const userPassword = await hash("test", 8)

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
      values('${userId}', 'user_test', 'user_test@rentx.com.br', '${userPassword}', false, 'now()', 'yyyyyy')`
    );
  });
  
  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("should be able to create a new category", async () => {
    const responseToken = await request(app).post("/sessions")
    .send({
      email: "admin@rentx.com.br",
      password: "admin"
    })

    const { refresh_token } = responseToken.body;

    const response = await request(app).post("/categories")
    .send({
      name: "Category supertest",
      description: "Category description supertest"
    })
    .set({
      Authorization: `Bearer ${refresh_token}`
    })

    expect(response.status).toBe(201)
  })

  it("should not be able to create a new category if name already exists", async () => {
    const responseToken = await request(app).post("/sessions")
    .send({
      email: "admin@rentx.com.br",
      password: "admin"
    })

    const { refresh_token } = responseToken.body;

    const response = await request(app).post("/categories")
    .send({
      name: "Category supertest",
      description: "Category description supertest"
    })
    .set({
      Authorization: `Bearer ${refresh_token}`
    })

    expect(response.status).toBe(400)
  })

  it("should not be able to create a new category if user is not authenticated", async () => {
    const response = await request(app).post("/categories")
    .send({
      name: "Category test",
      description: "Category description test"
    })
  
    expect(response.status).toBe(401)
  })

  it("should not be able to create a new category if user is not admin", async () => {
    const responseToken = await request(app).post("/sessions")
    .send({
      email: "user_test@rentx.com.br",
      password: "test"
    })

    const { refresh_token } = responseToken.body;

    const response = await request(app).post("/categories")
    .send({
      name: "Category test",
      description: "Category description test"
    })
    .set({
      Authorization: `Bearer ${refresh_token}`
    })

    expect(response.status).toBe(401)
  })
})