import { postChat } from "./api";

const TIMEOUT = 30000;

describe("postChat", () => {
  it(
    "returns a non-empty string",
    async () => {
      const result = await postChat("What is Fern AI Chat?");
      console.log({ result });

      expect(result).not.toBe("");
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    },
    TIMEOUT
  );
});
