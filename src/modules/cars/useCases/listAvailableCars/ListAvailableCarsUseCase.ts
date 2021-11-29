import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { inject, injectable } from "tsyringe";

interface IRequest {
  name?: string;
  brand?: string;
  category_id?: string;   
}

@injectable()
class ListAvailableCarsUseCase {
  constructor(
    @inject("CarsRepository")
    private carsRepository: ICarsRepository
  ) {}
  async execute({
    name,
    brand,
    category_id
  }: IRequest) {
    const cars = await this.carsRepository.findAvailable(
      name, 
      brand, 
      category_id
    );
    return cars;
  }
}

export { ListAvailableCarsUseCase }