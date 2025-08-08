import blogDomain from "./domain/index.ts";
import createBlogRepository from "./repository/index.ts";
import type { NotionAPI } from "./apis/notion.ts";
import type { BlogAPI } from "./apis/blog.ts";
import createBlogService from "./service/index.ts";
import type { BlogItem } from "./domain/interfaces/model.interface.ts";

const createBlogController = (notionAPI: NotionAPI, blogAPI: BlogAPI) => {
    const service = createBlogService(
        blogDomain,
        createBlogRepository(notionAPI, blogAPI),
    );

    return {
        createBlogListToJSON: (originalBlogItems: BlogItem[], target: string) =>
            service.createBlogListToJSONUseCase(originalBlogItems, target),
        getBlogContentAll: (id: string) => service.getBlogContentAllUseCase(id),
        getBlogListFromJSON: (page: number, size: number) =>
            service.getBlogListFromJSONUseCase(page, size),
        getBlogItemAll: (id: string) => service.getBlogItemAllUseCase(id),
        searchBlogItems: (searchQuery: string) =>
            service.searchBlogItemsUseCase(searchQuery),
    };
};

export default createBlogController;
