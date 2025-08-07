import blogDomain from "./domain";
import createBlogRepository from "./repository";
import type { NotionAPI } from "./apis/notion";
import type { BlogAPI } from "./apis/blog";
import createBlogService from "./service";

const createBlogController = (notionAPI: NotionAPI, blogAPI: BlogAPI) => {
    const service = createBlogService(
        blogDomain,
        createBlogRepository(notionAPI, blogAPI),
    );

    return {
        transformBlogListToJSON: (id: string, target: string) =>
            service.transformBlogListToJSONUseCase(id, target),
        getBlogContents: (id: string) => service.getBlogContentsUseCase(id),
        getBlogList: (page: number, size: number) =>
            service.getBlogListUseCase(page, size),
        searchBlogItems: (searchQuery: string) =>
            service.searchBlogItemsUseCase(searchQuery),
    };
};

export default createBlogController;
