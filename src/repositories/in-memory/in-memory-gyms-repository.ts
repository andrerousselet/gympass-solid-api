import { Gym, Prisma } from "@prisma/client";
import { FindManyNearbyParams, GymsRepository } from "../gyms-repository";
import { randomUUID } from "node:crypto";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = [];

  async findById(id: string) {
    const gym = this.items.find((item) => item.id === id);
    if (!gym) return null;
    return gym;
  }

  async findManyNearby(params: FindManyNearbyParams) {
    const TEN_KM = 10;
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        {
          // from
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          // to
          latitude: Number(item.latitude),
          longitude: Number(item.longitude),
        },
      );

      return distance < TEN_KM;
    });
  }

  async searchMany(query: string, page: number) {
    return this.items
      .filter((item) => item.title.toLowerCase().includes(query.toLowerCase()))
      .slice((page - 1) * 20, page * 20);
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(String(data.latitude)),
      longitude: new Prisma.Decimal(String(data.longitude)),
      created_at: new Date(),
    };
    this.items.push(gym);
    return gym;
  }
}
