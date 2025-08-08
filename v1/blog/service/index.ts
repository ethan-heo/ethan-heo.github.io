import type { BlogDomain } from "../domain/interfaces/domain.interface.ts";
import type { BlogRepository } from "../repository/repository.interface.ts";
import {
    getBlogContentAllUseCase,
    getBlogListFromJSONUseCase,
    getBlogItemAllUseCase,
    searchBlogItemsUseCase,
    createBlogListToJSONUseCase,
    initNotionClientUseCase,
    hasNextBlogListUseCase,
} from "./use-cases.ts";

const createBlogService = (domain: BlogDomain, repository: BlogRepository) => ({
    initNotionClientUseCase: initNotionClientUseCase(domain, repository),
    createBlogListToJSONUseCase: createBlogListToJSONUseCase(
        domain,
        repository,
    ),
    getBlogContentAllUseCase: getBlogContentAllUseCase(domain, repository),
    getBlogListFromJSONUseCase: getBlogListFromJSONUseCase(domain, repository),
    getBlogItemAllUseCase: getBlogItemAllUseCase(domain, repository),
    searchBlogItemsUseCase: searchBlogItemsUseCase(domain, repository),
    hasNextBlogListUseCase: hasNextBlogListUseCase(domain, repository),
});

export default createBlogService;
