import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { FetchUserCheckInsHistoryUseCase } from "./fetch-user-check-ins-history";

let inMemoryCheckInsRepository: InMemoryCheckInsRepository;
let sut: FetchUserCheckInsHistoryUseCase;

describe("Fetch User check-ins history use case", () => {
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
    });
    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym_01" }),
      expect.objectContaining({ gym_id: "gym_02" }),
    ]);
  });
});
