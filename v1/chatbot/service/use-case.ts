import type {
    EmbeddingResult,
    EmbedFileInfo,
} from "../domain/interfaces/model.interface.ts";
import type { ChatbotUseCase } from "./use-case.interface.ts";

type CreateEmbeddingFileUseCase = ChatbotUseCase<
    [fileInfo: EmbedFileInfo, html: string],
    Promise<EmbeddingResult[]>
>;

export const createEmbeddingFileUseCase: CreateEmbeddingFileUseCase =
    (domain, repository) => async (fileInfo, html) => {
        await repository.embedding.init();

        const result: EmbeddingResult[] = [];
        const markdown = repository.htmlToMarkdown.convert(html);
        const chunks = domain.sliceChunkFromMarkdown(markdown);

        for (const chunk of chunks) {
            const vector = await repository.embedding.embed(chunk);

            result.push(
                domain.createEmbeddingResult(
                    domain.createEmbeddingFileInfo(fileInfo, chunk, "hash"),
                    vector,
                ),
            );
        }

        return result;
    };
