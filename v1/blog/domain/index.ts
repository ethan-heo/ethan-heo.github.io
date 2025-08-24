import transformerMap from "./transformer.ts";
import type { BlogDomain } from "./interfaces/domain.interface.ts";
import type {
    NotionBlogBlockType,
    NotionBlogContent,
} from "./interfaces/notion-blog-block.interface.ts";
import type { BlogContent } from "./interfaces/model.interface.ts";

const blogDomain: BlogDomain = {
    transformBlogItem: (originalBlogItem) => {
        const { id, properties, created_time, cover } = originalBlogItem;
        let backgroundImg: string;

        if (cover.type === "external") {
            backgroundImg = cover.external.url;
        } else {
            backgroundImg = cover.file.url;
        }

        return {
            id,
            backgroundImg,
            title: properties.Name.title[0].text.content,
            description: properties.description.rich_text
                .map((text) => text.plain_text)
                .join(" "),
            createdDate: created_time,
            categories: properties.category.multi_select.map(
                (select) => select.name,
            ),
            related: properties.related.relation.map((relation) => relation.id),
        };
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
                    category.includes(query),
                )
            );
        });
    },
    validateSearchQuery: (searchQuery) => {
        if (searchQuery.trim().length === 0) {
            return false;
        }

        return true;
    },
    transformSearchResult: (blogItems) => {
        return blogItems.map((blogItem) => ({
            id: blogItem.id,
            title: blogItem.title,
            descriptions: blogItem.description,
            categories: blogItem.categories,
            backgroundImg: blogItem.backgroundImg,
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
    transformNestedBlockContent: (blogContents) => {
        const NESTED_CONTENT_TYPES = [
            "bulleted_list_item",
            "numbered_list_item",
            "to_do",
        ];

        let type: NotionBlogBlockType | null = null;
        let nestedContents: NotionBlogContent[] = [];

        const canCollect = (blogContent: NotionBlogContent) => {
            if (type === null) {
                return NESTED_CONTENT_TYPES.includes(blogContent.type);
            } else {
                return blogContent.type === type;
            }
        };
        const reset = () => {
            type = null;
            nestedContents = [];
        };
        const canDrain = () => {
            return type !== null && nestedContents.length > 0;
        };
        const drain = () => {
            const result = nestedContents.slice();

            reset();

            return result;
        };

        const result: BlogContent[] = [];

        for (const blogContent of blogContents) {
            if (canCollect(blogContent)) {
                type = blogContent.type;
                nestedContents.push(blogContent);
                continue;
            } else {
                if (canDrain()) {
                    result.push({
                        type: "nested_items",
                        contentType: type as NotionBlogBlockType,
                        content: drain(),
                    });
                }

                result.push(blogContent);
            }
        }

        if (canDrain()) {
            result.push({
                type: "nested_items",
                contentType: type as NotionBlogBlockType,
                content: drain(),
            });
        }

        return result;
    },
};

export default blogDomain;
