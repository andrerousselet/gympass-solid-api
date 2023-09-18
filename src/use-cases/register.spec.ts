import { expect, describe, it } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-reporitory";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

describe("Register use case", () => {
  it("should be able to register user", async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(inMemoryUsersRepository);

    const { user } = await registerUseCase.execute({
      name: "Fulano Silva",
      email: "fulano@email.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(inMemoryUsersRepository);

    const { user } = await registerUseCase.execute({
      name: "Fulano Silva",
      email: "fulano@email.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash,
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to register with same email more than once", async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(inMemoryUsersRepository);

    const email = "fulanosilva@email.com";

    await registerUseCase.execute({
      name: "Fulano Silva",
      email,
      password: "123456",
    });

    await expect(() =>
      registerUseCase.execute({
        name: "Fulano Silva",
        email,
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
