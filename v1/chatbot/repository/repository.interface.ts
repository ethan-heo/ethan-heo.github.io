import type { EmbeddingVector } from "../domain/interfaces/model.interface.ts";

export interface ChatbotRepository {
    embedding: {
        init: () => Promise<void>;
        embed: (markdown: string) => Promise<EmbeddingVector>;
        createHash: (str: string) => string;
    };
    htmlToMarkdown: {
        convert: (html: string) => string;
    };
}
