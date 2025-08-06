import type { BlogAPI } from "./apis/blog";
import type { NotionAPI } from "./apis/notion";
import type { BlogRepository } from "./repository.interface";

const blogRepository = (
    notionAPI: NotionAPI,
    blogAPI: BlogAPI,
): BlogRepository => ({
    getOriginalBlogList(id) {
        return notionAPI.getDatabaseAll(id);
    },
    getOriginalContents(id) {
        return notionAPI.getBlockAll(id);
    },
    getBlogList(page, size) {
        return blogAPI.getBlogList(page, size);
    },
});

export default blogRepository;
