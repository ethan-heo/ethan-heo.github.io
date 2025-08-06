import type { BlogDomain } from "../domain/interfaces/domain.interface";
import type { BlogRepository } from "../repository/repository.interface";
import {
    getBlogContentsUseCase,
    getBlogListUseCase,
    searchBlogItemsUseCase,
    transformBlogListToJSONUseCase,
} from "./use-cases";

const BlogService = (domain: BlogDomain, repository: BlogRepository) => ({
    transformBlogListToJSONUseCase: transformBlogListToJSONUseCase(
        domain,
        repository,
    ),
    getBlogContentsUseCase: getBlogContentsUseCase(domain, repository),
    getBlogListUseCase: getBlogListUseCase(domain, repository),
    searchBlogItemsUseCase: searchBlogItemsUseCase(domain, repository),
});

export default BlogService;
