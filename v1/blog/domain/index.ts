import type {
    BlogContent,
    BlogItem,
    Category,
    OriginalBlogContent,
    OriginalBlogItem,
} from "./domain.interface";

/**
 * @description OriginalBlogItem 형식의 목록을 받아 BlogItem 형식의 목록으로 변환한다.
 */
type TransformOriginalBlogItems = (
    originalBlogItems: OriginalBlogItem[],
) => BlogItem[];

/**
 * @description 검색어를 입력 받아 유효한 검색어인지 확인한다.
 */
type ValidateSearchQuery = (str: string) => string;

/**
 * @description 검색 결과를 입력 받아 Category 형식으로 변환하여 반환한다.
 */
type TransformSearchResult = (blogItems: BlogItem[]) => Category[];

/**
 * @description 외부 서비스의 컨텐츠를 입력받아 BlogContent 형식으로 변환하여 반환한다.
 */
type TransformOriginalBlogContent = (
    originalBlogContent: OriginalBlogContent,
) => BlogContent;
