import type { BlogItem } from "../../domain/interfaces/model.interface";
import blogs from "../../../../src/assets/blogs.json";
import fs from "node:fs";
import path from "node:path";

const createBlogAPI = (): BlogAPI => {
    return {
        getBlogList(page: number, size: number) {
            return blogs.slice(
                size * page,
                size * page + size,
            ) as unknown as BlogItem[];
        },
        toJSON(blogItems) {
            fs.writeFileSync(
                path.resolve(__dirname, "../src/assets/blogs.json"),
                JSON.stringify(blogItems),
            );
        },
    };
};

export default createBlogAPI;

export interface BlogAPI {
    getBlogList: (page: number, size: number) => BlogItem[];
    toJSON: (blogItems: BlogItem[]) => void;
}
