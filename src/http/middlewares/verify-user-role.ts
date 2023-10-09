import { FastifyReply, FastifyRequest } from "fastify";

export function verifyUserRole(userRole: "ADMIN" | "MEMBER") {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const { role } = req.user;
    if (role !== userRole) {
      return reply
        .status(401)
        .send({ message: "UNAUTHORIZED: You shall not pass!" });
    }
  };
}
