import type {
    BlogContent,
    BlogItem,
    SearchedBlogItem,
} from "../domain/interfaces/model.interface.ts";
import type { BlogUseCase } from "./use-case.interface.ts";

type CreateBlogListToJSONUseCase = BlogUseCase<[BlogItem[], string], void>;

export const createBlogListToJSONUseCase: CreateBlogListToJSONUseCase =
    (_, repository) => (blogItems, target) => {
        repository.blog.toJSON(blogItems, target);
    };

type GetBlogContentAllUseCase = BlogUseCase<[string], Promise<BlogContent[]>>;

export const getBlogContentAllUseCase: GetBlogContentAllUseCase =
    (domain, repository) => async (id) => {
        const originalContents =
            await repository.notion.getOriginalContentAll(id);

        return originalContents.map(domain.transformOriginalBlogContent);
    };

type GetBlogItemAllUseCase = BlogUseCase<[string], Promise<BlogItem[]>>;

export const getBlogItemAllUseCase: GetBlogItemAllUseCase =
    (domain, repository) => async (id) => {
        const blogList = await repository.notion.getOriginalBlogItemAll(id);

        return blogList.map(domain.transformBlogItem);
    };

type GetBlogListFromJSONUseCase = BlogUseCase<[number, number], BlogItem[]>;

export const getBlogListFromJSONUseCase: GetBlogListFromJSONUseCase =
    (_, repository) => (page, size) => {
        return repository.blog.getBlogList(page, size);
    };

type SearchBlogItemsUseCase = BlogUseCase<[string], SearchedBlogItem[]>;

export const searchBlogItemsUseCase: SearchBlogItemsUseCase =
    (domain, repository) => (searchQuery) => {
        domain.validateSearchQuery(searchQuery);

        return domain.transformSearchResult(
            domain.searchResult(searchQuery, repository.blog.getBlogList(1)),
        );
    };

type InitNotionClientUseCase = BlogUseCase<[string], void>;

export const initNotionClientUseCase: InitNotionClientUseCase =
    (_, repository) => (apiKey) => {
        repository.notion.init(apiKey);
    };
