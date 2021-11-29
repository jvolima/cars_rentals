import { Connection, PrimaryColumn } from "typeorm"
import createConnection from "@shared/infra/typeorm"
import { v4 as uuidv4 } from "uuid"
import { hash } from "bcrypt"
import request from "supertest"
import { app } from "@shared/infra/http/app"

let connection: Connection
describe("Create specifications controller", () => {
  beforeAll(async() => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidv4();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
      values('${id}', 'admin', 'admin@rentx.com.br', '${password}', true, 'now()', 'xxxxxx')`
    );

    const id2 = uuidv4();
    const password2 = await hash("test", 8)

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
      values('${id2}', 'user_test', 'user_test@rentx.com.br', '${password2}', false, 'now()', 'yyyyyy')`
    );
  })

  afterAll(async() => {
    await connection.dropDatabase();
    await connection.close();
  })
  
  it("should be able to create a new specification", async () => {
    const responseToken = await request(app).post("/sessions")
    .send({
      email: "admin@rentx.com.br",
      password: "admin"
    })

    const { refresh_token } = responseToken.body;

    const response = await request(app).post("/specifications")
    .send({
      name: "Specification supertest",
      description: "Specification description"
    })
    .set({
      Authorization: `Bearer ${refresh_token}`
    })

    expect(response.status).toBe(201)
  })

  it("should not be able to create a new specification if name already exists", async () => {
    const responseToken = await request(app).post("/sessions")
    .send({
      email: "admin@rentx.com.br",
      password: "admin"
    })

    const { refresh_token } = responseToken.body;

    const response = await request(app).post("/specifications")
    .send({
      name: "Specification supertest",
      description: "Specification description"
    })
    .set({
      Authorization: `Bearer ${refresh_token}`
    })

    expect(response.status).toBe(400)
  })

  it("should not be able to create a new specification if user is not authenticated", async () => {
    const response = await request(app).post("/specifications")
    .send({
      name: "Specification test",
      description: "Specification description"
    })

    expect(response.status).toBe(401)
  })

  it("should not be able to create a new specification if user is not admin", async () => {
    const responseToken = await request(app).post("/sessions")
    .send({
      email: "user_test@rentx.com.br",
      password: "test"
    })

    const { refresh_token } = responseToken.body;

    const response = await request(app).post("/specifications")
    .send({
      name: "Specification test",
      description: "Specification description"
    })
    .set({
      Authorization: `Bearer ${refresh_token}`
    })

    expect(response.status).toBe(401)
  })
})