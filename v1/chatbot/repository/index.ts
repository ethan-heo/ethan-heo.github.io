import type { EmbeddingAPI } from "../apis/embedding.ts";
import type { HTMLToMarkdownAPI } from "../apis/html-to-markdown.ts";
import type { ChatbotRepository } from "./repository.interface.ts";

const createChatbotRepository = (
    embeddingAPI: EmbeddingAPI,
    htmlToMarkdownAPI: HTMLToMarkdownAPI,
): ChatbotRepository => ({
    embedding: {
        init: () => embeddingAPI.init(),
        embed: (markdown: string) => embeddingAPI.embed(markdown),
        createHash: (str: string) => embeddingAPI.createHash(str),
    },
    htmlToMarkdown: {
        convert: (html: string) => htmlToMarkdownAPI.convert(html),
    },
});

export default createChatbotRepository;
