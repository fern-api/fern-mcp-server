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
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    // Convert the Uint8Array to a string and append
    result += new TextDecoder().decode(value);
  }

  return result;
}
