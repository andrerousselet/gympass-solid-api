import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { describe, it, expect, beforeEach } from "vitest";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";

let inMemoryGymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe("Fetch nearby gyms use case", () => {
  beforeEach(async () => {
    inMemoryGymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(inMemoryGymsRepository);
  });

  it("should be able to fetch nearby gyms", async () => {
    await inMemoryGymsRepository.create({
      title: "Near Gym",
      description: null,
      phone: null,
      latitude: -22.9438099,
      longitude: -43.1956681,
    });

    await inMemoryGymsRepository.create({
      title: "Far Gym",
      description: null,
      phone: null,
      latitude: -23.0157937,
      longitude: -43.459455,
    });

    const { gyms } = await sut.execute({
      userLatitude: -22.9438099,
      userLongitude: -43.1956681,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Near Gym" })]);
  });
});
