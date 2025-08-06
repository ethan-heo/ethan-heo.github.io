import type {
    BlogContent,
    BlogItem,
    Category,
    OriginalBlogContent,
    OriginalBlogItem,
    SearchedBlogItem,
} from "./domain.interface";
import type { TransformerMap } from "./transformer";
import transformerMap from "./transformer";
import type { NotionBlogBlockType } from "./notion-blog-block.interface";

/**
 * @description OriginalBlogItem 형식의 목록을 받아 BlogItem 형식의 목록으로 변환한다.
 */
type TransformBlogItems = (originalBlogItems: OriginalBlogItem[]) => BlogItem[];

/**
 * @description 검색어를 입력 받아 유효한 검색어인지 확인한다.
 */
type ValidateSearchQuery = (str: string) => void;

/**
 * @description 검색 결과인 blogItems를 입력받아 SearchedBlogItem[] 형식으로 변환한다.
 */
type TransformSearchResult = (blogItems: BlogItem[]) => SearchedBlogItem[];

/**
 * @description 검색 결과를 반환합니다.
 */
type SearchResult = (searchQuery: string, blogItems: BlogItem[]) => BlogItem[];

/**
 * @description 외부 서비스의 컨텐츠를 입력받아 BlogContent 형식으로 변환하여 반환한다.
 */
type TransformOriginalBlogContent = (
    originalBlogContent: OriginalBlogContent,
) => BlogContent;

export const createOriginalBlogContentTransformer =
    (
        transformerMap: TransformerMap<NotionBlogBlockType>,
    ): TransformOriginalBlogContent =>
    (originalBlogContent) => {
        const transformer = transformerMap[originalBlogContent.type];

        if (!transformer)
            throw new Error(
                `${originalBlogContent.type} 을 변환할 수 없습니다.`,
            );

        return transformer(originalBlogContent as any);
    };

export const transformOriginalBlogContent =
    createOriginalBlogContentTransformer(transformerMap);

export const transformSearchResult: TransformSearchResult = (blogItems) => {
    return blogItems.map((blogItem) => ({
        id: blogItem.id,
        title: blogItem.title,
    }));
};

export const searchResult: SearchResult = (searchQuery, blogItems) => {
    const query = searchQuery.toLowerCase().trim();

    return blogItems.filter((blogItem) => {
        const { title, description, categories } = blogItem;

        const normalizedTitle = title.toLocaleLowerCase();
        const normalizedDescription = description.toLocaleLowerCase();
        const normalizedCategories = categories.map((category) =>
            category.toLocaleLowerCase(),
        );

        return (
            normalizedTitle.includes(query) ||
            normalizedDescription.includes(query) ||
            normalizedCategories.some((category) => query.includes(category))
        );
    });
};

export const validateSearchQuery: ValidateSearchQuery = (searchQuery) => {
    if (searchQuery.trim().length === 0) {
        throw new Error(`검색 결과가 존재하지 않음.`);
    }
};

export const transformBlogItems: TransformBlogItems = (originalBlogItems) => {
    return originalBlogItems.map((originalBlogItem) => {
        const { id, title, properties, created_time, cover } = originalBlogItem;
        let backgroundImg: string;

        if (cover.type === "external") {
            backgroundImg = cover.external.url;
        } else {
            backgroundImg = cover.file.url;
        }

        return {
            id,
            backgroundImg,
            title: title.map((text) => text.plain_text).join(" "),
            description: properties.description.rich_text
                .map((text) => text.plain_text)
                .join(" "),
            createdDate: created_time,
            categories: properties.category.multi_select.map(
                (select) => select.name,
            ),
            related: properties.related.relation.map((relation) => relation.id),
        };
    });
};
