import { OpenAIApi, Configuration } from "openai";

const apiKey = process.env.OPENAI_API_KEY || "missing";

const run = async (args: string[]) => {
  const config = new Configuration({
    apiKey,
  });

  const openai = new OpenAIApi(config);

  const res: any = await openai.createCompletion(
    {
      prompt: "Write a poem about dogs",
      model: "text-davinci-003",
      max_tokens: 128,
      stream: true,
    },
    { responseType: "stream" }
  );

  try {
    res.data.on("data", (data: any) => {
      const lines = data
        .toString()
        .split("\n")
        .filter((line: any) => line.trim() !== "");

      for (const line of lines) {
        const message = line.replace(/^data: /, "");
        if (message === "[DONE]") {
          return; // Stream finished
        }
        try {
          const parsed = JSON.parse(message);
          console.log(parsed.choices[0].text);
        } catch (error) {
          console.error("Could not JSON parse stream message", message, error);
        }
      }
    });
  } catch (error) {
    console.error("An error occurred during OpenAI request: ", error);
  }
};

export default run;
