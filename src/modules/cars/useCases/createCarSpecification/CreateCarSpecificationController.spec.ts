import { Connection } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { hash } from "bcrypt"
import request from "supertest"
import createConnection from "@shared/infra/typeorm"
import { app } from "@shared/infra/http/app";

let connection: Connection
let specificationId: String
let carId: String

describe("Create car specification controller", () => {
  beforeAll(async () => {
    connection = await createConnection()
    await connection.runMigrations()

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

    const categoryId = uuidv4();

    await connection.query(
      `INSERT INTO CATEGORIES(id, name, description, created_at)
      values('${categoryId}', 'Category test', 'Category description test', 'now()')`
    )

    carId = uuidv4();

    await connection.query(
      `INSERT INTO CARS(id, name, description, daily_rate, available, license_plate, fine_amount, brand, category_id, created_at)
      values('${carId}', 'Car test', 'Car test description', 150, true, 'xxxxxxx', 60, 'test', '${categoryId}', 'now()')`
    )

    specificationId = uuidv4();

    await connection.query(
      `INSERT INTO SPECIFICATIONS(id, name, description, created_at)
      values('${specificationId}', 'Specification test', 'Specification description test', 'now()')`
    )
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it("should be able to add a new specification to a car", async () => {
    const responseToken = await request(app).post("/sessions")
    .send({
      email: "admin@rentx.com.br",
      password: "admin"
    })

    const { refresh_token } = responseToken.body

    const response = await request(app).post(`/cars/specifications/${carId}`)
    .send({
      specifications_id: specificationId,
    })
    .set({
      Authorization: `Bearer ${refresh_token}`
    })

    expect(response.status).toBe(200)
  })

  it("should not be able to add a new specification to a car if user is not authenticated", async () => { 
    const response = await request(app).post(`/cars/specifications/${carId}`)
    .send({
      specifications_id: specificationId,
    })

    expect(response.status).toBe(401)
  })

  it("should not be able to add a new specification to car if user is not admin", async () => {
    const responseToken = await request(app).post("/sessions")
    .send({
      email: "user_test@rentx.com.br",
      password: "test"
    })

    const { refresh_token } = responseToken.body

    const response = await request(app).post(`/cars/specifications/${carId}`)
    .send({
      specifications_id: specificationId,
    })
    .set({
      Authorization: `Bearer ${refresh_token}`
    })

    expect(response.status).toBe(401)
  })
})