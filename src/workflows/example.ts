import { sleep } from "workflow";

export async function exampleWorkflow(input: string) {
  "use workflow";

  const result = await processInput(input);
  await sleep("5s");
  await notifyCompletion(result);

  return { status: "done", result };
}

async function processInput(input: string) {
  "use step";
  return `Processed: ${input}`;
}

async function notifyCompletion(result: string) {
  "use step";
  console.log(`Workflow completed with result: ${result}`);
}
