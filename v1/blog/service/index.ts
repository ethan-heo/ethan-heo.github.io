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
    findRelatedBlogItemsUseCase,
} from "./use-cases.ts";

const createBlogService = (domain: BlogDomain, repository: BlogRepository) => ({
    initNotionClientUseCase: initNotionClientUseCase(repository),
    toJSONUseCase: toJSONUseCase(repository),
    getBlogContentAllUseCase: getBlogContentAllUseCase(domain, repository),
    getBlogListFromJSONUseCase: getBlogListFromJSONUseCase(repository),
    getBlogItemAllUseCase: getBlogItemAllUseCase(domain, repository),
    searchBlogItemsUseCase: searchBlogItemsUseCase(domain, repository),
    hasNextBlogListUseCase: hasNextBlogListUseCase(repository),
    transformJumpLinkFromBlogContentsUseCase:
        transformJumpLinkFromBlogContentsUseCase(domain),
    findRelatedBlogItemsUseCase: findRelatedBlogItemsUseCase(
        domain,
        repository,
    ),
});

export default createBlogService;
