import type { BlogContent } from "./interfaces/model.interface";
import type {
    NotionBlogContent,
    TextBlock,
    TextBlockType,
} from "./interfaces/notion-blog-block.interface";

/**
 *
 * @param blogContents 변환된 Notion Block 데이터 목록
 * @description 입력받은 데이터 목록에서 heading 타입의 목록을 분류해 반환한다.
 * @returns
 */
const findHeadingBlock = (
    blogContents: BlogContent[],
): Extract<BlogContent, { type: TextBlockType }>[] => {
    const result: TextBlock[] = [];
    const HEADING_TYPES = ["heading_1", "heading_2", "heading_3"];
    const isNotionBlockType = (
        blogContent: BlogContent,
    ): blogContent is NotionBlogContent => {
        return blogContent.type !== "nested_items";
    };
    const isTextBlockType = (
        blogContent: BlogContent,
    ): blogContent is TextBlock => {
        return HEADING_TYPES.includes(blogContent.type);
    };

    for (const blogContent of blogContents) {
        if (
            isTextBlockType(blogContent) &&
            /heading_[1-3]/g.test(blogContent.type)
        ) {
            result.push(blogContent);
            continue;
        }

        if (isNotionBlockType(blogContent)) {
            result.push(...findHeadingBlock(blogContent.children));
        }
    }

    return result;
};

export default findHeadingBlock;
