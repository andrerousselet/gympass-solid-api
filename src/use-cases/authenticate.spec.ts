import { expect, describe, it } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-reporitory";
import { AuthenticateUseCase } from "./authenticate";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

describe("Authenticate use case", () => {
  it("should be able to authenticate", async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(inMemoryUsersRepository); // System Under Test: avoid name errors when copying/pasting

    await inMemoryUsersRepository.create({
      name: "Fulano Silva",
      email: "fulanosilva@email.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      email: "fulanosilva@email.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with wrong email", async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(inMemoryUsersRepository); // System Under Test: avoid name errors when copying/pasting

    expect(() =>
      sut.execute({
        email: "fulano@email.com",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(inMemoryUsersRepository); // System Under Test: avoid name errors when copying/pasting

    await inMemoryUsersRepository.create({
      name: "Fulano Silva",
      email: "fulanosilva@email.com",
      password_hash: await hash("123456", 6),
    });

    expect(() =>
      sut.execute({
        email: "fulanosilva@email.com",
        password: "1234567",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
