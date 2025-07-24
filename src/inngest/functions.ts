import { inngest } from "./client";
import {openai, createAgent } from "@inngest/agent-kit";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" }, // Make sure this matches exactly
  async ({ event, step }) => {
    console.log("🎉 Function started with data:", event.data);
    
    const summarizer = createAgent({
      name: "summarizer",
      system: "You are an expert summarizer. You summarize into words.",
      model: openai({ model: "gpt-4o" }),
    });

    const { output } = await summarizer.run(`Summarize the following text: ${event.data.value}`);
    
    console.log("✅ Summarization complete:", output);
    
    return { output };
  }
);