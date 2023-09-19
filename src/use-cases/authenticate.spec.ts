import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe("Authenticate use case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(inMemoryUsersRepository);
  });

  it("should be able to authenticate", async () => {
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
    await expect(() =>
      sut.execute({
        email: "fulano@email.com",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    await inMemoryUsersRepository.create({
      name: "Fulano Silva",
      email: "fulanosilva@email.com",
      password_hash: await hash("123456", 6),
    });

    await expect(() =>
      sut.execute({
        email: "fulanosilva@email.com",
        password: "1234567",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
