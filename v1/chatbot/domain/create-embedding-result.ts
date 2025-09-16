import type {
    EmbeddingFileInfoWithoutVector,
    EmbeddingResult,
    EmbeddingVector,
} from "./interfaces/model.interface.ts";

/**
 *
 * @description fileInfo, vector를 받아 EmbeddingResult를 생성한다.
 * @param fileInfo
 * @param vector
 * @returns
 */
const createEmbeddingResult = (
    fileInfo: EmbeddingFileInfoWithoutVector,
    vector: EmbeddingVector,
): EmbeddingResult => {
    return {
        ...fileInfo,
        vector,
    };
};

export default createEmbeddingResult;
