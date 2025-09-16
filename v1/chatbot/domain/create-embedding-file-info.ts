import type {
    EmbeddingFileInfoWithoutVector,
    EmbedFileInfo,
} from "./interfaces/model.interface.ts";

/**
 * @description fileInfo, markdownText, hash를 입력받아 Embedding 파일 정보를 반환한다.
 * @param fileInfo
 * @param markdownText
 * @param hash
 * @returns
 */
const createEmbeddingFileInfo = (
    fileInfo: EmbedFileInfo,
    markdownText: string,
    hash: string,
): EmbeddingFileInfoWithoutVector => {
    return {
        id: fileInfo.id,
        title: fileInfo.title,
        url: `/blog/${fileInfo.id}`,
        text: markdownText,
        tags: fileInfo.categories,
        version: "v1",
        hash,
        createdAt: fileInfo.createdDate,
    };
};

export default createEmbeddingFileInfo;
