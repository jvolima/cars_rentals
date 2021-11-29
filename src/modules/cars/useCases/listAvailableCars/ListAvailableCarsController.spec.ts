import { app } from "@shared/infra/http/app";
import request from "supertest";
import { Connection } from "typeorm";
import createConnection from "@shared/infra/typeorm"
import { v4 as uuidv4 } from "uuid";

let connection: Connection

describe("List available cars", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const categoryId = uuidv4();

    await connection.query(
      `INSERT INTO CATEGORIES(id, name, description, created_at)
      values('${categoryId}', 'Category test', 'Category description test', 'now()')`
    )

    const carId = uuidv4();

    await connection.query(
      `INSERT INTO CARS(id, name, description, daily_rate, available, license_plate, fine_amount, brand, category_id, created_at)
      values('${carId}', 'Car test', 'Car test description', 150, true, 'xxxxxxx', 60, 'test', '${categoryId}', 'now()')`
    )
  });
  
  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("should be able to list all available cars", async () => {
    const response = await request(app).get("/cars/available")

    expect(response.status).toBe(200)
  })
})