import type { BlogItem } from "../../domain/interfaces/model.interface";
import blogs from "../../../../src/assets/blogs.json";

const createBlogAPI = (): BlogAPI => {
    return {
        getBlogList(page: number, size: number) {
            return blogs.slice(
                size * page,
                size * page + size,
            ) as unknown as BlogItem[];
        },
    };
};

export default createBlogAPI;

export interface BlogAPI {
    getBlogList: (page: number, size: number) => BlogItem[];
}
