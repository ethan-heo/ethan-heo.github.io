import type { BlogDomain } from "../domain/interfaces/domain.interface";
import type { BlogRepository } from "../repository/repository.interface";
import {
    getBlogContentAllUseCase,
    getBlogListFromJSONUseCase,
    getBlogItemAllUseCase,
    searchBlogItemsUseCase,
    transformBlogListToJSONUseCase,
} from "./use-cases";

const createBlogService = (domain: BlogDomain, repository: BlogRepository) => ({
    transformBlogListToJSONUseCase: transformBlogListToJSONUseCase(
        domain,
        repository,
    ),
    getBlogContentAllUseCase: getBlogContentAllUseCase(domain, repository),
    getBlogListFromJSONUseCase: getBlogListFromJSONUseCase(domain, repository),
    getBlogItemAllUseCase: getBlogItemAllUseCase(domain, repository),
    searchBlogItemsUseCase: searchBlogItemsUseCase(domain, repository),
});

export default createBlogService;
