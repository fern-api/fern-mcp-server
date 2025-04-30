import { askFernAi } from "./api";

const TIMEOUT = 30000;

describe("askFernAi", () => {
  it(
    "returns a non-empty string",
    async () => {
      const result = await askFernAi({ message: "What is Fern AI Chat?" });
      console.log({ result });

      expect(result).not.toBe("");
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    },
    TIMEOUT
  );
});
