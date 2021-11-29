import { CategoriesRepositoryInMemory } from "@modules/cars/repositories/in-memory/CategoriesRepositoryInMemory"
import { ListCategoriesUseCase } from "./ListCategoriesUseCase"

let categoriesRepositoryInMemory: CategoriesRepositoryInMemory
let listCategoriesUseCase: ListCategoriesUseCase

describe("List categories", () => {
  beforeEach(() => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
    listCategoriesUseCase = new ListCategoriesUseCase(categoriesRepositoryInMemory);
  })

  it("should be able to list all categories", async () => {
    await categoriesRepositoryInMemory.create({
      name: "Category test",
      description: "Category description test"
    })

    const categories = await listCategoriesUseCase.execute()

    expect(categories.length).toBe(1)
  })
})