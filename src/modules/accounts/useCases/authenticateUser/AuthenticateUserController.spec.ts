import { Connection } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { hash } from "bcrypt"
import request from "supertest"
import createConnection from "@shared/infra/typeorm"
import { app } from "@shared/infra/http/app";

let connection: Connection 

describe("Authenticate user controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const userId = uuidv4();
    const userPassword = await hash("test", 8)

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
      values('${userId}', 'user_test', 'user_test@rentx.com.br', '${userPassword}', false, 'now()', 'yyyyyy')`
    );
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("should be able to authenticate an user", async () => {
    const response = await request(app).post("/sessions")
    .send({
      email: "user_test@rentx.com.br",
      password: "test"
    })

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  })
})