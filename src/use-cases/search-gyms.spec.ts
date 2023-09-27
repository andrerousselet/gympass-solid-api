import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { describe, it, expect, beforeEach } from "vitest";
import { SearchGymsUseCase } from "./search-gyms";

let inMemoryGymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe("Search gyms use case", () => {
  beforeEach(async () => {
    inMemoryGymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(inMemoryGymsRepository);
  });

  it("should be able to search for gyms", async () => {
    await inMemoryGymsRepository.create({
      title: "JavaScript Gym",
      description: null,
      phone: null,
      latitude: -22.9438099,
      longitude: -43.1956681,
    });

    await inMemoryGymsRepository.create({
      title: "TypeScript Gym",
      description: null,
      phone: null,
      latitude: -22.9438099,
      longitude: -43.1956681,
    });

    const { gyms } = await sut.execute({
      query: "java",
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "JavaScript Gym" }),
    ]);
  });

  it("should be able to fetch paginated check-ins history", async () => {
    for (let i = 1; i <= 22; i += 1) {
      await inMemoryGymsRepository.create({
        title: `JavaScript Gym ${i}`,
        description: null,
        phone: null,
        latitude: -22.9438099,
        longitude: -43.1956681,
      });
    }

    const { gyms } = await sut.execute({
      query: "java",
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "JavaScript Gym 21" }),
      expect.objectContaining({ title: "JavaScript Gym 22" }),
    ]);
  });
});
