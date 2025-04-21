import { Low, Memory } from "lowdb";

export type Thread = Array<{
  role: "user" | "assistant";
  content: string;
}>;

export type Data = {
  threads: Record<string, Thread>;
};

export type DB = Low<Data>;

const defaultData: Data = { threads: {} };

export function createDb() {
  // TODO: Use JSONFilePreset instead
  const db = new Low<Data>(new Memory(), defaultData);
  return db;
}
