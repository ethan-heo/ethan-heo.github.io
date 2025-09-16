import type { ChatbotDomain } from "../domain/index.ts";
import type { ChatbotRepository } from "../repository/repository.interface.ts";

export type ChatbotUseCase<P extends any[], R> = (
    domain: ChatbotDomain,
    repository: ChatbotRepository,
) => (...param: P) => R;
