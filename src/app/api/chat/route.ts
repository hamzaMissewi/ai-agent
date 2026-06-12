import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages,
    system: "You are Antigravity AI Agent, a highly capable assistant for a full-stack engineer. You are helpful, concise, and technical.",
  });

  return result.toTextStreamResponse();
}
