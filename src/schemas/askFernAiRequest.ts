import z from "zod";

export const schema = z.object({ message: z.string() });
export const shape = schema.shape;
