import transformerMap from "./transformer";
import type { BlogDomain } from "./interfaces/domain.interface";

const blogDomain: BlogDomain = {
    transformBlogItems: (originalBlogItems) => {
        return originalBlogItems.map((originalBlogItem) => {
            const { id, title, properties, created_time, cover } =
                originalBlogItem;
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
                related: properties.related.relation.map(
                    (relation) => relation.id,
                ),
            };
        });
    },
    searchResult: (searchQuery, blogItems) => {
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
                normalizedCategories.some((category) =>
                    query.includes(category),
                )
            );
        });
    },
    validateSearchQuery: (searchQuery) => {
        if (searchQuery.trim().length === 0) {
            throw new Error(`검색 결과가 존재하지 않음.`);
        }
    },
    transformSearchResult: (blogItems) => {
        return blogItems.map((blogItem) => ({
            id: blogItem.id,
            title: blogItem.title,
        }));
    },
    transformOriginalBlogContent: (originalBlogContent) => {
        const transformer = transformerMap[originalBlogContent.type];

        if (!transformer)
            throw new Error(
                `${originalBlogContent.type} 을 변환할 수 없습니다.`,
            );

        return transformer(originalBlogContent as any);
    },
};

export default blogDomain;
