import type { DataArray } from "@xenova/transformers";

export interface EmbeddingResult {
    id: string;
    title: string;
    url: string;
    text: string;
    vector: EmbeddingVector;
    tags: string[];
    version: string;
    hash: string;
    createdAt: string;
}

export type EmbeddingFileInfoWithoutVector = Omit<EmbeddingResult, "vector">;

export type EmbeddingVector = DataArray;

export interface EmbedFileInfo {
    id: string;
    title: string;
    createdDate: string;
    categories: string[];
}
