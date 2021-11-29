import { Request, Response } from "express";
import { ListCategoriesUseCase } from "./ListCategoriesUseCase";
import { container } from "tsyringe";

class ListCategoriesController{
  async handle(request: Request, response: Response): Promise<Response>{
    const listCategoryUseCase = container.resolve(ListCategoriesUseCase);
    const all = await listCategoryUseCase.execute();

    return response.json(all);
  }
}

export { ListCategoriesController }