import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { GetUserMetricsUseCase } from "./get-user-metrics";

let inMemoryCheckInsRepository: InMemoryCheckInsRepository;
let sut: GetUserMetricsUseCase;

describe("Get user metrics use case", () => {
  beforeEach(async () => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsUseCase(inMemoryCheckInsRepository);
  });

  it("should be able to get number of check-ins from user metrics", async () => {
    await inMemoryCheckInsRepository.create({
      user_id: "user_01",
      gym_id: "gym_01",
    });

    await inMemoryCheckInsRepository.create({
      user_id: "user_01",
      gym_id: "gym_02",
    });

    const { checkInsCount } = await sut.execute({
      userId: "user_01",
    });

    expect(checkInsCount).toEqual(2);
  });
});
