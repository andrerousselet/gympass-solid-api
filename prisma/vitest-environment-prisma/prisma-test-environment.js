// import { Environment } from "vitest";

export default {
  name: "prisma",
  transformMode: "ssr",
  async setup() {
    console.log("Setup");

    return {
      async teardown() {
        console.log("Teardown");
      },
    };
  },
};
