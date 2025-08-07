import type { BlogAPI } from "../apis/blog";
import type { NotionAPI } from "../apis/notion";
import type { BlogRepository } from "./repository.interface";

const createBlogRepository = (
    notionAPI: NotionAPI,
    blogAPI: BlogAPI,
): BlogRepository => ({
    getOriginalBlogItemAll(id) {
        return notionAPI.getDatabaseAll(id);
    },
    getOriginalContentAll(id) {
        return notionAPI.getBlockAll(id);
    },
    getBlogList(page, size) {
        return blogAPI.getBlogList(page, size);
    },
    toJSON(blogItems, target) {
        return blogAPI.toJSON(blogItems, target);
    },
});

export default createBlogRepository;
