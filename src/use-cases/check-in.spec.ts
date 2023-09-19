import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { CheckInUseCase } from "./check-in";
import { randomUUID } from "node:crypto";

let inMemoryCheckInsRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase;

describe("Check-in use case", () => {
  beforeEach(() => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository();
    sut = new CheckInUseCase(inMemoryCheckInsRepository);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      userId: randomUUID(),
      gymId: randomUUID(),
    });
    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in more than once in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      userId: randomUUID(),
      gymId: randomUUID(),
    });

    await expect(() =>
      sut.execute({
        userId: randomUUID(),
        gymId: randomUUID(),
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
