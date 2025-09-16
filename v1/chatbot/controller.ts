import createEmbeddingAPI from "./apis/embedding.ts";
import createHTMLToMarkdownAPI from "./apis/html-to-markdown.ts";
import chatbotDomain from "./domain/index.ts";
import createChatbotRepository from "./repository/index.ts";
import createChatbotService from "./service/index.ts";

const service = createChatbotService(
    chatbotDomain,
    createChatbotRepository(createEmbeddingAPI(), createHTMLToMarkdownAPI()),
);

const chatbotController = {
    createEmbeddingFile: service.createEmbeddingFileUseCase,
};

export default chatbotController;
