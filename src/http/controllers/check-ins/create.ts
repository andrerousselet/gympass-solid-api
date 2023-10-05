import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeCheckInUseCase } from "@/use-cases/factories/make-check-in-use-case";

export async function create(req: FastifyRequest, reply: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  });
  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.number().refine((value) => Math.abs(value) <= 180),
  });

  const { gymId } = createCheckInParamsSchema.parse(req.params);
  const { latitude, longitude } = createCheckInBodySchema.parse(req.body);

  const checkInUseCase = makeCheckInUseCase();
  await checkInUseCase.execute({
    userId: req.user.sub,
    gymId,
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(201).send();
}
