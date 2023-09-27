import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { FetchUserCheckInsHistoryUseCase } from "./fetch-user-check-ins-history";

let inMemoryCheckInsRepository: InMemoryCheckInsRepository;
let sut: FetchUserCheckInsHistoryUseCase;

describe("Fetch user check-ins history use case", () => {
  beforeEach(async () => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository();
    sut = new FetchUserCheckInsHistoryUseCase(inMemoryCheckInsRepository);
  });

  it("should be able to fetch check-ins history", async () => {
    await inMemoryCheckInsRepository.create({
      user_id: "user_01",
      gym_id: "gym_01",
    });

    await inMemoryCheckInsRepository.create({
      user_id: "user_01",
      gym_id: "gym_02",
    });

    const { checkIns } = await sut.execute({
      userId: "user_01",
      page: 1,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym_01" }),
      expect.objectContaining({ gym_id: "gym_02" }),
    ]);
  });

  it("should be able to fetch paginated check-ins history", async () => {
    for (let i = 1; i <= 22; i += 1) {
      await inMemoryCheckInsRepository.create({
        user_id: "user_01",
        gym_id: `gym_${i}`,
      });
    }
    const { checkIns } = await sut.execute({
      userId: "user_01",
      page: 2,
    });
    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym_21" }),
      expect.objectContaining({ gym_id: "gym_22" }),
    ]);
  });
});
