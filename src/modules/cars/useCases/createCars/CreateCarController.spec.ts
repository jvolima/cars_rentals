import { Connection } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { hash } from "bcrypt"
import request from "supertest";
import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";

let connection: Connection
let categoryId: String

describe("Create car controller", () => {
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

    categoryId = uuidv4();

    await connection.query(
      `INSERT INTO CATEGORIES(id, name, description, created_at)
      values('${categoryId}', 'Category test', 'Category description test', 'now()')`
    )
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("should be able to create a new car", async () => {
    const responseToken = await request(app).post("/sessions")
    .send({
      email: "admin@rentx.com.br",
      password: "admin"
    })

    const { refresh_token } = responseToken.body;

    const response = await request(app).post("/cars")
    .send({
      name: "Car test", 
      description: "Car test description", 
      daily_rate: 100, 
      license_plate: "1234-ABC", 
      fine_amount: 60, 
      brand: "Test", 
      category_id: categoryId 
    })
    .set({
      Authorization: `Bearer ${refresh_token}`
    })

    expect(response.status).toBe(201)
  })

  it("should not be able to create a new car if license_plate already exists", async () => {
    const responseToken = await request(app).post("/sessions")
    .send({
      email: "admin@rentx.com.br",
      password: "admin"
    })

    const { refresh_token } = responseToken.body;

    const response = await request(app).post("/cars")
    .send({
      name: "Car test", 
      description: "Car test description", 
      daily_rate: 100, 
      license_plate: "1234-ABC", 
      fine_amount: 60, 
      brand: "Test", 
      category_id: categoryId 
    })
    .set({
      Authorization: `Bearer ${refresh_token}`
    })

    expect(response.status).toBe(400)
  })

  it("should not be able to create a new car if user is not authenticated", async () => {
    const response = await request(app).post("/cars")
    .send({
      name: "Car test", 
      description: "Car test description", 
      daily_rate: 100, 
      license_plate: "4321-CBA", 
      fine_amount: 60, 
      brand: "Test", 
      category_id: categoryId 
    })
  
    expect(response.status).toBe(401)
  })

  it("should not be able to create a new car if user is not admin", async () => {
    const responseToken = await request(app).post("/sessions")
    .send({
      email: "user_test@rentx.com.br",
      password: "test"
    })

    const { refresh_token } = responseToken.body;

    const response = await request(app).post("/cars")
    .send({
      name: "Car test", 
      description: "Car test description", 
      daily_rate: 100, 
      license_plate: "3524-ADF", 
      fine_amount: 60, 
      brand: "Test", 
      category_id: categoryId 
    })
    .set({
      Authorization: `Bearer ${refresh_token}`
    })

    expect(response.status).toBe(401)
  })
})