import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory"
import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase"


let listAvailableCarsUseCase: ListAvailableCarsUseCase
let carsRepository: CarsRepositoryInMemory

describe("List cars", () => {
  beforeEach(() => {
    carsRepository = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(carsRepository);
  })

  it("should be able to list all available cars", async () => {
    const car = await carsRepository.create({
      "name": "Car1", 
      "description": "Car description",
      "daily_rate": 140.00, 
      "license_plate": "FTI-1113", 
      "fine_amount": 90.00, 
      "brand": "Car_brand", 
      "category_id": "category id"
    })

    const cars = await listAvailableCarsUseCase.execute({})
    
    expect(cars).toEqual([car])
  });

  it("should be able to list all available cars by name", async () => {
    const car = await carsRepository.create({
      "name": "Car_test", 
      "description": "Car description",
      "daily_rate": 140.00, 
      "license_plate": "FLP-1227", 
      "fine_amount": 90.00, 
      "brand": "Car_brand", 
      "category_id": "category id"
    })

    const cars = await listAvailableCarsUseCase.execute({
      name: "Car_test"
    })
    
    expect(cars).toEqual([car])
  })

  it("should be able to list all available cars by brand", async () => {
    const car = await carsRepository.create({
      "name": "Car2", 
      "description": "Car description",
      "daily_rate": 140.00, 
      "license_plate": "FLP-1798", 
      "fine_amount": 90.00, 
      "brand": "Car_brand_test", 
      "category_id": "category id"
    })

    const cars = await listAvailableCarsUseCase.execute({
      brand: "Car_brand_test", 
    })
    
    expect(cars).toEqual([car])
  })

  it("should be able to list all available cars by category", async () => {
    const car = await carsRepository.create({
      "name": "Car2", 
      "description": "Car description",
      "daily_rate": 140.00, 
      "license_plate": "FLP-1495", 
      "fine_amount": 90.00, 
      "brand": "Car_brand_test", 
      "category_id": "12345"
    })

    const cars = await listAvailableCarsUseCase.execute({
      category_id: "12345", 
    })
    
    expect(cars).toEqual([car])
  })
})

