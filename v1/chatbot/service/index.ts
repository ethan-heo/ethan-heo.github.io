import type { ChatbotDomain } from "../domain/index.ts";
import type { ChatbotRepository } from "../repository/repository.interface.ts";
import { createEmbeddingFileUseCase } from "./use-case.ts";

const createChatbotService = (
    domain: ChatbotDomain,
    repository: ChatbotRepository,
) => ({
    createEmbeddingFileUseCase: createEmbeddingFileUseCase(domain, repository),
});

export default createChatbotService;
