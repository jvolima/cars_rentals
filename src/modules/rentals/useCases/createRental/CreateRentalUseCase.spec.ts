import dayjs from "dayjs";
import { AppError } from "@shared/errors/AppError";
import { CreateRentalUseCase } from "./CreateRentalUseCase"
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";

let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory
let dayjsDateProvider: DayjsDateProvider;
let createRentalUseCase: CreateRentalUseCase;

describe("Create Rental", () => {
  const dayAdd24Hours = dayjs().add(1, "day").toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    dayjsDateProvider = new DayjsDateProvider();
    createRentalUseCase = new CreateRentalUseCase(rentalsRepositoryInMemory, dayjsDateProvider, carsRepositoryInMemory);
  });

  it("should be able to create a new rental", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car test",
      description: "Description test",
      daily_rate: 100,
      brand: "Brand",
      fine_amount: 50,
      license_plate: "test",
      category_id: "1234"
    })

    const rental = await createRentalUseCase.execute({
      car_id: car.id,
      user_id: "12345",
      expected_return_date: dayAdd24Hours,
    });

    expect(rental).toHaveProperty("id")
    expect(rental).toHaveProperty("start_date")
  });

  it("should not be able to create a new rental if there is another open to the same user", async () => {
    await rentalsRepositoryInMemory.create({
      user_id: "123",
      car_id: "121212",
      expected_return_date: dayAdd24Hours
    })
    
    await expect(async () => {
      await createRentalUseCase.execute({
        car_id: "141414",
        user_id: "123",
        expected_return_date: dayAdd24Hours,
      });
    }).rejects.toEqual(new AppError("There's a rental in progress for user!"))
  });

  it("should not be able to create a new rental if there is another open to the same car", async () => {
    await rentalsRepositoryInMemory.create({
      user_id: "987",
      car_id: "161616",
      expected_return_date: dayAdd24Hours
    })
    
    await expect(async () => {
      await createRentalUseCase.execute({
        car_id: "161616",
        user_id: "321",
        expected_return_date: dayAdd24Hours,
      });
    }).rejects.toEqual(new AppError("Car is unavailable!"))
  });

  it("should not be able to create a new rental with invalid return time", async () => {
    await expect(async () => {
      await createRentalUseCase.execute({
        car_id: "teste",
        user_id: "123",
        expected_return_date: dayjs().toDate(),
      })
    }).rejects.toEqual(new AppError("Invalid return time!"))
  })
})