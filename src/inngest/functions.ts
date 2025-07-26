import { inngest } from "./client";
import {Sandbox} from "@e2b/code-interpreter"
import {openai, createAgent } from "@inngest/agent-kit";
import { getSandbox } from "./utils";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" }, // Make sure this matches exactly
  async ({ event, step }) => {
    const sandboxId = await step.run("gpt-sandbox-id",async()=>{
      const sandbox = await Sandbox.create("test3");
      return sandbox.sandboxId;
    })
    
    const codeAgent = createAgent({
      name: "code-agent",
      system: "You are an expert next.js developer. You write readable, maintainable code. You write simple Next.js & react snippets.",
      model: openai({ model: "gpt-4o-mini" }),
    });

    const { output } = await codeAgent.run(`Write the following snippet: ${event.data.value}`);
    
    const sandboxUrl = await step.run("gpt-sandbox-url",async()=>{
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    })

    return { output, sandboxUrl };
  }
);