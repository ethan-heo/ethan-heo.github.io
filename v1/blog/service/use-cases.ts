import type {
    BlogContent,
    BlogItem,
    SearchedBlogItem,
} from "../domain/interfaces/model.interface";
import type { BlogUseCase } from "./use-case.interface";

type TransformBlogListToJSONUseCase = BlogUseCase<[string, string], void>;

export const transformBlogListToJSONUseCase: TransformBlogListToJSONUseCase =
    (domain, repository) => async (id, target) => {
        const blogList = await repository.getOriginalBlogItemAll(id);

        repository.toJSON(blogList.map(domain.transformBlogItem), target);
    };

type GetBlogContentAllUseCase = BlogUseCase<[string], Promise<BlogContent[]>>;

export const getBlogContentAllUseCase: GetBlogContentAllUseCase =
    (domain, repository) => async (id) => {
        const originalContents = await repository.getOriginalContentAll(id);

        return originalContents.map(domain.transformOriginalBlogContent);
    };

type GetBlogItemAllUseCase = BlogUseCase<[string], Promise<BlogItem[]>>;

export const getBlogItemAllUseCase: GetBlogItemAllUseCase =
    (domain, repository) => async (id) => {
        const blogList = await repository.getOriginalBlogItemAll(id);

        return blogList.map(domain.transformBlogItem);
    };

type GetBlogListFromJSONUseCase = BlogUseCase<[number, number], BlogItem[]>;

export const getBlogListFromJSONUseCase: GetBlogListFromJSONUseCase =
    (_, repository) => (page, size) => {
        return repository.getBlogList(page, size);
    };

type SearchBlogItemsUseCase = BlogUseCase<[string], SearchedBlogItem[]>;

export const searchBlogItemsUseCase: SearchBlogItemsUseCase =
    (domain, repository) => (searchQuery) => {
        domain.validateSearchQuery(searchQuery);

        return domain.transformSearchResult(
            domain.searchResult(searchQuery, repository.getBlogList(1)),
        );
    };
