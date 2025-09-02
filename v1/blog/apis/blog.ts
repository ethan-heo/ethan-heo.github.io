import type { BlogItem } from "../domain/interfaces/model.interface.ts";
import blogs from "../../../src/assets/blogs.json" assert { type: "json" };
import fs from "node:fs";

const createBlogAPI = (): BlogAPI => {
    return {
        getBlogList(page, size) {
            let _page = page > 0 ? page - 1 : 0;

            if (!size) {
                return blogs.slice(0) as unknown as BlogItem[];
            }

            return blogs.slice(
                size * _page,
                size * _page + size,
            ) as unknown as BlogItem[];
        },
        hasNextBlogList: (page, size) => {
            if (!size) {
                return blogs.length > 0;
            }
            return !!blogs[page * size + size];
        },
        toJSON(data, target) {
            fs.writeFileSync(target, JSON.stringify(data));
        },
    };
};

export default createBlogAPI;

export interface BlogAPI {
    getBlogList: (page: number, size?: number) => BlogItem[];
    hasNextBlogList: (page: number, size?: number) => boolean;
    toJSON: (blogItems: any, target: string) => void;
}
