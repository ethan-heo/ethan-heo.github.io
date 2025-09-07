import type { BlogItem, SearchedBlogItem } from "./interfaces/model.interface";

/**
 *
 * @param blogItems 변환된 Notion Database 목록
 * @description 변환된 Notion Database 목록을 입력받아 검색 영역에서 사용하기 용이한 형태로 반환한다.
 * @returns
 */
const transformSearchResult = (blogItems: BlogItem[]): SearchedBlogItem[] => {
    return blogItems.map((blogItem) => ({
        id: blogItem.id,
        title: blogItem.title,
        descriptions: blogItem.description,
        categories: blogItem.categories,
        backgroundImg: blogItem.backgroundImg,
    }));
};

export default transformSearchResult;
