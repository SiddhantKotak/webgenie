import { Sandbox } from '@e2b/code-interpreter';
import { AgentResult, TextMessage } from '@inngest/agent-kit';

export async function getSandbox(sandboxId: string) {
  try {
    // Connect to existing sandbox
    const sandbox = await Sandbox.connect(sandboxId);
    return sandbox;
  } catch (error) {
    console.error(`Failed to connect to sandbox ${sandboxId}:`, error);
    throw new Error(`Sandbox ${sandboxId} is no longer available. Please create a new one.`);
  }
}

export function lastAssistantTextMessageContent(result: AgentResult) {
  const lastAssitantTextMessageIndex = result.output.findLastIndex(
    (message) => message.role === 'assistant',
  );

  const message = result.output[lastAssitantTextMessageIndex] as
    | TextMessage
    | undefined;

  return message?.content
    ? typeof message.content === 'string'
      ? message.content
      : message.content.map((c) => c.text).join('')
    : undefined;
}