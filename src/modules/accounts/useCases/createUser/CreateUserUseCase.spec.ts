import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";
import { CreateUserUseCase } from "./CreateUserUseCase";


let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;

describe("Create user", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  })

  it("should be able to create a new user", async () => {
    const user = {
      name: "User test",
      email: "user@test.com",
      password: "test",
      driver_license: "123456"
    }

    await createUserUseCase.execute(user);

    const userCreated = await usersRepositoryInMemory.findByEmail(user.email)

    expect(userCreated).toHaveProperty("id")
  })

  it("should not be able to create a new user if email already exists", async () => {
    expect(async() => {
      const user = {
        name: "User test",
        email: "user@test.com",
        password: "test",
        driver_license: "123456"
      }
  
      await createUserUseCase.execute(user);
      await createUserUseCase.execute(user);
    }).rejects.toEqual(new AppError("User already exists!"))
  })
})