import { randomUUID } from "crypto";

const BASE_URL = "https://buildwithfern.com/learn";
const X_FERN_HOST = "buildwithfern.com";

export async function postChat(message: string) {
  const response = await fetch(`${BASE_URL}/api/fern-docs/search/v2/chat`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-fern-host": X_FERN_HOST,
    },
    body: JSON.stringify({
      messages: [{ role: "user", parts: [{ type: "text", text: message }] }],
      conversationId: randomUUID(),
      url: BASE_URL,
    }),
  });

  const result = await streamToString(response);
  return result;
}

async function streamToString(response: Response) {
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("!reader");
  }

  let result = "";
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    // Convert the Uint8Array to a string and append to buffer
    buffer += new TextDecoder().decode(value);

    // Process complete lines in the buffer
    const lines = buffer.split("\n");
    // Keep the last incomplete line in the buffer
    buffer = lines.pop() || "";

    for (const line of lines) {
      // SSE format: "data: {...}"
      if (line.startsWith("data: ") && line !== "data: [DONE]") {
        try {
          const jsonStr = line.substring(6); // Remove "data: " prefix
          const data = JSON.parse(jsonStr);

          // Extract text deltas which contain the actual response
          if (data.type === "text-delta" && data.delta) {
            result += data.delta;
          }
        } catch (e) {
          // Skip invalid JSON lines
          continue;
        }
      }
    }
  }

  return result;
}
