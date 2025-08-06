import type {
    BlogContent,
    BlogItem,
    SearchedBlogItem,
} from "../domain/interfaces/model.interface";
import type { BlogUseCase } from "./use-case.interface";

type TransformBlogListToJSONUseCase = BlogUseCase<[string, string], void>;

export const transformBlogListToJSONUseCase: TransformBlogListToJSONUseCase =
    (domain, repository) => async (id, target) => {
        const blogList = await repository.getOriginalBlogList(id);

        repository.toJSON(domain.transformBlogItems(blogList), target);
    };

type GetBlogContentsUseCase = BlogUseCase<[string], Promise<BlogContent[]>>;

export const getBlogContentsUseCase: GetBlogContentsUseCase =
    (domain, repository) => async (id) => {
        const originalContents = await repository.getOriginalContents(id);

        return originalContents.map(domain.transformOriginalBlogContent);
    };

type GetBlogListUseCase = BlogUseCase<[number, number], BlogItem[]>;

export const getBlogListUseCase: GetBlogListUseCase =
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
