import type { BlogItem } from "../domain/interfaces/model.interface.ts";
import blogs from "../../../src/assets/blogs.json" assert { type: "json" };
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const createBlogAPI = (): BlogAPI => {
    return {
        getBlogList(page: number, size) {
            let _page = page > 0 ? page - 1 : 0;

            if (!size) {
                return blogs.slice(0) as unknown as BlogItem[];
            }

            return blogs.slice(
                size * _page,
                size * _page + size,
            ) as unknown as BlogItem[];
        },
        toJSON(blogItems, target) {
            fs.writeFileSync(target, JSON.stringify(blogItems));
        },
    };
};

export default createBlogAPI;

export interface BlogAPI {
    getBlogList: (page: number, size?: number) => BlogItem[];
    toJSON: (blogItems: BlogItem[], target: string) => void;
}
