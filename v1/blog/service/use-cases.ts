import type {
    BlogContent,
    BlogItem,
    HeadingInfo,
    OriginalBlogContentWithChildren,
    SearchedBlogItem,
} from "../domain/interfaces/model.interface.ts";
import type { NotionBlogContent } from "../domain/interfaces/notion-blog-block.interface.ts";
import type { BlogUseCase } from "./use-case.interface.ts";

type CreateBlogListToJSONUseCase = BlogUseCase<[BlogItem[], string], void>;

export const createBlogListToJSONUseCase: CreateBlogListToJSONUseCase =
    (_, repository) => (blogItems, target) => {
        repository.blog.toJSON(blogItems, target);
    };

type GetBlogContentAllUseCase = BlogUseCase<[string], Promise<BlogContent[]>>;

export const getBlogContentAllUseCase: GetBlogContentAllUseCase =
    (domain, repository) => async (id) => {
        const transformContents = (
            originalContents: OriginalBlogContentWithChildren[],
        ): BlogContent[] => {
            const contents = originalContents.map((originalContent) => {
                return {
                    ...domain.transformOriginalBlogContent(originalContent),
                    children: Array.isArray(originalContent.children)
                        ? transformContents(originalContent.children)
                        : [],
                };
            });

            return domain.transformNestedBlockContent(
                contents as NotionBlogContent[],
            );
        };

        return transformContents(
            await repository.notion.getOriginalContentAll(id),
        );
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

type SearchBlogItemsUseCase = BlogUseCase<[string], SearchedBlogItem[] | Error>;

export const searchBlogItemsUseCase: SearchBlogItemsUseCase =
    (domain, repository) => (searchQuery) => {
        // validateSearchQuery 에서 반환되는 결과를 boolean으로 하면 어떨까? 그럼 조금 깔끔하게 처리가 가능할지도?
        // 확실히 boolean으로 처리하는 것이 결과 처리에 대한 여러 상황에 대처하기 용이해보임.

        if (!domain.validateSearchQuery(searchQuery)) {
            return new Error(`잘못된 입력입니다.`);
        }

        return domain.transformSearchResult(
            domain.searchResult(searchQuery, repository.blog.getBlogList(1)),
        );
    };

type InitNotionClientUseCase = BlogUseCase<[string], void>;

export const initNotionClientUseCase: InitNotionClientUseCase =
    (_, repository) => (apiKey) => {
        repository.notion.init(apiKey);
    };

type HasNextBlogListUseCase = BlogUseCase<[number, number], boolean>;

export const hasNextBlogListUseCase: HasNextBlogListUseCase =
    (_, repository) => (page, size) => {
        return repository.blog.hasNextBlogList(page, size);
    };

type TransformJumpLinkFromElementUseCase = BlogUseCase<
    [Element],
    HeadingInfo[]
>;

export const transformJumpLinkFromElementUseCase: TransformJumpLinkFromElementUseCase =
    (domain) => (element) => {
        const result = domain.transformHeadingNodeAttrToHeadingInfo(
            domain.findHeadingNodesToDOM(element),
        );
        return result;
    };
