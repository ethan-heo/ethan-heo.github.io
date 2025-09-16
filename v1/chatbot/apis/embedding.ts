import { FeatureExtractionPipeline, pipeline } from "@xenova/transformers";
import type { EmbeddingVector } from "../domain/interfaces/model.interface.ts";

const createEmbeddingAPI = (): EmbeddingAPI => {
    let embedder: FeatureExtractionPipeline | undefined;

    return {
        init: async () => {
            embedder = await pipeline(
                "feature-extraction",
                "Xenova/bge-small-zh-v1.5",
            );
        },
        embed: async (markdown) => {
            if (!embedder) {
                throw new Error(`Not created embedder`);
            }

            const result = await embedder(markdown, {
                pooling: "mean",
                normalize: true,
            });

            return result.data;
        },
        createHash: (str) => {
            let hash = 5381;
            for (let i = 0; i < str.length; i++) {
                hash = (hash << 5) + hash + str.charCodeAt(i);
            }
            return Math.abs(hash).toString(16).slice(0, 16);
        },
    };
};

export default createEmbeddingAPI;

export interface EmbeddingAPI {
    init: () => Promise<void>;
    embed: (markdown: string) => Promise<EmbeddingVector>;
    createHash: (str: string) => string;
}
