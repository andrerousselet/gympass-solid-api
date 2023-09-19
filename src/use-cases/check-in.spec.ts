import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { describe, it, expect, beforeEach } from "vitest";
import { CheckInUseCase } from "./check-in";
import { randomUUID } from "node:crypto";

let inMemoryCheckInsRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase;

describe("Check-in use case", () => {
  beforeEach(() => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository();
    sut = new CheckInUseCase(inMemoryCheckInsRepository);
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      userId: randomUUID(),
      gymId: randomUUID(),
    });
    expect(checkIn.id).toEqual(expect.any(String));
  });
});
