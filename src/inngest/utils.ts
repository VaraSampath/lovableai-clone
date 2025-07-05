import { AgentResult, TextMessage } from "@inngest/agent-kit";
import { Sandbox } from "e2b";

export const getSandBox = async (sandboxId: string) => {
  const sandbox = await Sandbox.connect(sandboxId);
  return sandbox;
};

export function lastAssistantTextMessageContent(result: AgentResult) {
  const lastAssistantTextMessageIndex = result.output.findLastIndex(
    (message) => message.role === "assistant"
  );
  const message = result.output[lastAssistantTextMessageIndex] as
    | TextMessage
    | undefined;

  return message?.content
    ? typeof message.content == "string"
      ? message.content
      : message.content.map((c) => c.text).join("")
    : undefined;
}
