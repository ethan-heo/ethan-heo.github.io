import type { BlogDomain } from "../domain/index.ts";
import type { BlogRepository } from "../repository/repository.interface.ts";
import {
    getBlogContentAllUseCase,
    getBlogListFromJSONUseCase,
    getBlogItemAllUseCase,
    searchBlogItemsUseCase,
    toJSONUseCase,
    initNotionClientUseCase,
    hasNextBlogListUseCase,
    transformJumpLinkFromBlogContentsUseCase,
} from "./use-cases.ts";

const createBlogService = (domain: BlogDomain, repository: BlogRepository) => ({
    initNotionClientUseCase: initNotionClientUseCase(domain, repository),
    toJSONUseCase: toJSONUseCase(domain, repository),
    getBlogContentAllUseCase: getBlogContentAllUseCase(domain, repository),
    getBlogListFromJSONUseCase: getBlogListFromJSONUseCase(domain, repository),
    getBlogItemAllUseCase: getBlogItemAllUseCase(domain, repository),
    searchBlogItemsUseCase: searchBlogItemsUseCase(domain, repository),
    hasNextBlogListUseCase: hasNextBlogListUseCase(domain, repository),
    transformJumpLinkFromBlogContentsUseCase:
        transformJumpLinkFromBlogContentsUseCase(domain, repository),
});

export default createBlogService;
