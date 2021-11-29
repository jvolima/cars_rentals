import { SpecificationsRepositoryInMemory } from "@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory"
import { AppError } from "@shared/errors/AppError"
import { CreateSpecificationUseCase } from "./CreateSpecificationUseCase"

let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory
let createSpecificationUseCase: CreateSpecificationUseCase

describe("Create specification", () => {
  beforeEach(() => {
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();
    createSpecificationUseCase = new CreateSpecificationUseCase(specificationsRepositoryInMemory);
  })

  it("should be able to create a new specification", async () => {
    const specification = {
      name: "Specification test",
      description: "Specification description test"
    }

    await createSpecificationUseCase.execute(specification)

    const specificationCreated = await specificationsRepositoryInMemory.findByName(specification.name);

    expect(specificationCreated).toHaveProperty("id")
  })

  it("should not be able to create a new specification if name already exists", async () => {
    const specification = {
      name: "Specification test",
      description: "Specification description test"
    }

    await createSpecificationUseCase.execute(specification)

    await expect(async () => {
      await createSpecificationUseCase.execute(specification)
    }).rejects.toEqual(new AppError("Specification already exists!"))
  })
})