import type { BlogItem, OriginalBlogItem } from "./interfaces/model.interface";

/**
 *
 * @param originalBlogItem Notion Database
 * @description Notion Database 목록에서 필요한 정보만 사용하도록 변경한다.
 * @returns
 */
const transformBlogItem = (originalBlogItem: OriginalBlogItem): BlogItem => {
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
};

export default transformBlogItem;
