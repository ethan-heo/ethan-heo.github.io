import type { BlogAPI } from "../apis/blog.ts";
import type { NotionAPI } from "../apis/notion.ts";
import type { BlogRepository } from "./repository.interface.ts";

const createBlogRepository = (
    notionAPI: NotionAPI,
    blogAPI: BlogAPI,
): BlogRepository => ({
    notion: {
        init: (apiKey) => notionAPI.init(apiKey),
        getOriginalBlogItemAll(id) {
            return notionAPI.getDatabaseAll(id);
        },
        getOriginalContentAll(id) {
            return notionAPI.getBlockAll(id);
        },
    },
    blog: {
        getBlogList(page, size) {
            return blogAPI.getBlogList(page, size);
        },

        hasNextBlogList(page, size) {
            return blogAPI.hasNextBlogList(page, size);
        },
    },
    toJSON(data, target) {
        return blogAPI.toJSON(data, target);
    },
});

export default createBlogRepository;
