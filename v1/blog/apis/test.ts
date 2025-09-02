import type { BlogContent } from "../domain/interfaces/model.interface";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const createTestAPI = (): TestAPI => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const MOCK_DIR_PATH = path.resolve(__dirname, "../../../src/mock");

    return {
        getOriginalBlogContents: (id: string) => {
            const content = fs.readFileSync(
                path.resolve(MOCK_DIR_PATH, `./${id}.json`),
                { encoding: "utf-8" },
            );

            return JSON.parse(content);
        },
    };
};

export default createTestAPI;

export interface TestAPI {
    getOriginalBlogContents: (id: string) => BlogContent[];
}
