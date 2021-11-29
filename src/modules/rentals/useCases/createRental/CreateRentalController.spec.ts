import { app } from "@shared/infra/http/app";
import request from "supertest";
import { Connection } from "typeorm";
import createConnection from "@shared/infra/typeorm"
import { v4 as uuidv4 } from "uuid";
import { hash } from "bcrypt";

let connection: Connection
let carId: String

describe("Create rental controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

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
  });
  
  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("should be able to create a new rental", async () => {
    const responseToken = await request(app).post("/sessions")
    .send({
      email: "user_test@rentx.com.br",
      password: "test"
    })

    const { refresh_token } = responseToken.body

    const response = await request(app).post("/rentals")
    .send({
      expected_return_date: '2021-11-22T23:45:18.977Z',
      car_id: carId
    })
    .set({
      Authorization: `Bearer ${refresh_token}`
    })

    expect(response.status).toBe(201)
  })
})