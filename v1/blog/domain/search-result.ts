import type { BlogItem } from "./interfaces/model.interface";

/**
 *
 * @param searchQuery 검색어
 * @param blogItems 변환된 Notion Database 목록
 * @description 검색어와 변환된 Notion Database 목록을 입력받아 목록 내 검색어와 일치하는 아이템을 찾아 반환한다.
 * @returns
 */
const searchResult = (
    searchQuery: string,
    blogItems: BlogItem[],
): BlogItem[] => {
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
            normalizedCategories.some((category) => category.includes(query))
        );
    });
};

export default searchResult;
