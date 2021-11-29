import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { SpecificationsRepositoryInMemory } from "@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";
import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";

let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;
let createCarSpecificationUseCase: CreateCarSpecificationUseCase;

describe("Create Car Specification", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepositoryInMemory, specificationsRepositoryInMemory
    );
  });

  it("should be able to add a new car specification", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Name car", 
      description: "Description car", 
      daily_rate: 100, 
      license_plate: "ABC-1234", 
      fine_amount: 60, 
      brand: "Brand", 
      category_id: "category"      
    });

    const specification = await specificationsRepositoryInMemory.create({
      name: "test",
      description: "test",
    })

    const specifications_id = [specification.id];

    const specificationsCars = await createCarSpecificationUseCase.execute({ 
      car_id: car.id, 
      specifications_id 
    });

    expect(specificationsCars).toHaveProperty("specifications")
    expect(specificationsCars.specifications.length).toBe(1)
  });

  it("should not be able to add create a new specification to a non-existing car", async () => {
    const car_id = "1234";
    const specifications_id = ["54321"];
    
    await expect(async () => {
      await createCarSpecificationUseCase.execute({ car_id, specifications_id });
    }).rejects.toEqual(new AppError("Car does not exists!"))
  })
})