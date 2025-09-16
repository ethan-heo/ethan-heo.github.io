import createEmbeddingFileInfo from "./create-embedding-file-info.ts";
import createEmbeddingResult from "./create-embedding-result.ts";
import sliceChunkFromMarkdown from "./slice-chunk-from-markdown.ts";

const chatbotDomain = {
    createEmbeddingResult,
    createEmbeddingFileInfo,
    sliceChunkFromMarkdown,
};

export type ChatbotDomain = typeof chatbotDomain;

export default chatbotDomain;
