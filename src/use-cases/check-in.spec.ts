import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { CheckInUseCase } from "./check-in";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxCheckInsError } from "./errors/max-check-ins-error";

let inMemoryCheckInsRepository: InMemoryCheckInsRepository;
let inMemoryGymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check-in use case", () => {
  beforeEach(async () => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository();
    inMemoryGymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(
      inMemoryCheckInsRepository,
      inMemoryGymsRepository,
    );
    await inMemoryGymsRepository.create({
      id: "gym_01",
      title: "The Gym",
      description: "The Gym description",
      phone: "",
      latitude: -22.9438099,
      longitude: -43.1956681,
    });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      userId: "user_01",
      gymId: "gym_01",
      userLatitude: -22.9438099,
      userLongitude: -43.1956681,
    });
    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in more than once in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    const fakeCheckIn = {
      userId: "user_01",
      gymId: "gym_01",
      userLatitude: -22.9438099,
      userLongitude: -43.1956681,
    };

    await sut.execute(fakeCheckIn);

    await expect(() => sut.execute(fakeCheckIn)).rejects.toBeInstanceOf(
      MaxCheckInsError,
    );
  });

  it("should be able to check in more than once in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    const fakeCheckIn = {
      userId: "user_01",
      gymId: "gym_01",
      userLatitude: -22.9438099,
      userLongitude: -43.1956681,
    };

    await sut.execute(fakeCheckIn);

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute(fakeCheckIn);

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    await expect(() =>
      sut.execute({
        userId: "user_01",
        gymId: "gym_01",
        userLatitude: -22.9347785,
        userLongitude: -43.2019226,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
