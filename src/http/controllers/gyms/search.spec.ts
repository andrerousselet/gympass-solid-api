import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Search gyms controller (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to search gyms by title", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "The Gym",
        description: "This is a gym to be found",
        phone: "21999999999",
        latitude: -22.9438099,
        longitude: -43.1956681,
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "The Gym Copy",
        description: "This is also gym to be found",
        phone: "11999999999",
        latitude: -23.9438099,
        longitude: -44.1956681,
      });

    const response = await request(app.server)
      .get("/gyms/search")
      .query({
        query: "copy",
      })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({ title: "The Gym Copy" }),
    ]);
  });
});
