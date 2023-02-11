import natural from "natural";
import GPT3Tokenizer from "gpt3-tokenizer";
import { Document } from "..";

export interface TextSplitterOptions {
  lengthFn?: (text: string) => number;
  chunkSize?: number;
  overlap?: number;
}

export abstract class TextSplitter {
  chunkSize = 4000;
  overlap = 200;

  protected tokenizer = new GPT3Tokenizer({ type: "gpt3" });

  constructor(opts?: TextSplitterOptions) {
    if (typeof opts?.chunkSize !== "undefined") {
      this.chunkSize = opts.chunkSize;
    }
    if (typeof opts?.overlap !== "undefined") {
      if (opts.overlap > this.chunkSize) {
        throw Error(
          `Error: Overlap is greater than chunkSize, overlap ${opts.overlap}, chunksize: ${this.chunkSize}`
        );
      }
      this.overlap = opts.overlap;
    }

    if (typeof opts?.lengthFn !== "undefined") {
      this.lengthFn = opts.lengthFn;
    }
  }

  abstract splitText(text: string): string[];

  splitDocuments(documents: Document[]): Document[] {
    let texts = documents.map((doc) => doc.content);
    let metas = documents.map((doc) => doc.meta);
    return this.createDocuments(texts, metas);
  }

  createDocuments(texts: string[], metas?: Record<string, any>[]): Document[] {
    let _metas = metas || new Array(texts.length).fill({});
    let documents: Document[] = [];
    for (let i = 0; i < texts.length; i++) {
      for (const chunk of this.splitText(texts[i])) {
        documents.push({ content: chunk, meta: _metas[i] });
      }
    }
    return documents;
  }

  protected createChunks(texts: string[], separator: string): string[] {
    // build up chunks based on chunk size
    return texts.reduce((chunks: string[], text) => {
      let chunk = "";

      // Check if the last chunk is below the chunkSize + overlap.
      const lastChunk = (chunks.length && chunks[chunks.length - 1]) || "";
      const lastChunkLength = this.lengthFn(lastChunk);
      if (lastChunkLength < this.chunkSize + this.overlap) {
        chunk = chunks.pop() || "";
      }

      chunk = chunk === "" ? text : chunk + separator + text;

      chunks.push(chunk);

      return chunks;
    }, []);
  }

  getLength: (text: string) => number = (text: string) => {
    return this.lengthFn(text);
  };

  private lengthFn = (text: string) => {
    const encoded: { bpe: number[]; text: string[] } =
      this.tokenizer.encode(text);

    return encoded.bpe.length;
  };
}

export class CharacterTextSplitter extends TextSplitter {
  character: string;

  constructor(character: string = "\n\n", opts?: TextSplitterOptions) {
    super(opts);
    this.character = character;
  }

  splitText = (text: string): string[] => {
    // TODO: Maybe use something like https://github.com/Tessmore/sbd instead
    const texts = text.split(this.character);
    return this.createChunks(texts, this.character);
  };
}

export class SentenceTextSplitter extends TextSplitter {
  splitText(text: string): string[] {
    const tokenizer = new natural.SentenceTokenizer();
    const texts = tokenizer.tokenize(text);
    return this.createChunks(texts, " ");
  }
}