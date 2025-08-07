import blogDomain from "./domain";
import createBlogRepository from "./repository";
import type { NotionAPI } from "./apis/notion";
import type { BlogAPI } from "./apis/blog";
import createBlogService from "./service";
import type { BlogItem } from "./domain/interfaces/model.interface";

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
