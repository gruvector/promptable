import dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import chalk from "chalk";
import {
  CharacterTextSplitter,
  FileLoader,
  OpenAI,
  QAExtractPrompt,
} from "promptable";

const apiKey = process.env.OPENAI_API_KEY || "";

/**
 * Run Prompt Document to Extract notes relavant to a Question.
 *
 * First, chunks the document into smaller chunks.
 *
 * Then, runs the prompt on each chunk to extract notes.
 *
 * Returns a list of notes.
 *
 * @param args
 */
const run = async (args: string[]) => {
  const openai = new OpenAI(apiKey);
  const prompt = QAExtractPrompt;

  // Load the file
  const filepath = "./data/startup-mistakes.txt";
  const loader = new FileLoader(filepath);
  const splitter = new CharacterTextSplitter("\n");

  // load and split the documents
  let docs = loader.load();
  docs = splitter.splitDocuments(docs, {
    chunk: true,
  });

  // The Question to use for extraction
  const question = args[0] || "What is the most common mistake founders make?";

  console.log(chalk.blue.bold("\nRunning QA Extraction: startup-mistakes.txt"));
  console.log(chalk.white(`Question: ${question}`));

  // Run the Question-Answer prompt on each chunk asyncronously
  const notes = await Promise.all(
    docs.map((doc) => {
      return openai.generate(prompt, {
        document: doc.content,
        question,
      });
    })
  );

  console.log(
    chalk.greenBright(
      `Notes: ${JSON.stringify(
        {
          question,
          notes,
        },
        null,
        4
      )}`
    )
  );
};

export default run;
