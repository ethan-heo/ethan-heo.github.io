import blogDomain from "./domain/index.ts";
import createBlogRepository from "./repository/index.ts";
import createBlogService from "./service/index.ts";
import type { BlogItem } from "./domain/interfaces/model.interface.ts";
import createNotionAPI from "./apis/notion.ts";
import createBlogAPI from "./apis/blog.ts";

const service = createBlogService(
    blogDomain,
    createBlogRepository(createNotionAPI(), createBlogAPI()),
);

const blogController = {
    notion: {
        init: (apiKey: string) => service.initNotionClientUseCase(apiKey),
        getBlogContentAll: (id: string) => service.getBlogContentAllUseCase(id),
        getBlogItemAll: (id: string) => service.getBlogItemAllUseCase(id),
    },
    blog: {
        createBlogListToJSON: (originalBlogItems: BlogItem[], target: string) =>
            service.createBlogListToJSONUseCase(originalBlogItems, target),
        getBlogListFromJSON: (page: number, size: number) =>
            service.getBlogListFromJSONUseCase(page, size),
        searchBlogItems: (searchQuery: string) =>
            service.searchBlogItemsUseCase(searchQuery),
        hasNextBlogList: (page: number, size: number) =>
            service.hasNextBlogListUseCase(page, size),
    },
};

export default blogController;
