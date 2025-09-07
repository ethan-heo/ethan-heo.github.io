import type { BlogContent } from "./interfaces/model.interface";
import type {
    NotionBlogBlockType,
    NotionBlogContent,
} from "./interfaces/notion-blog-block.interface";

/**
 *
 * @param blogContents 변환된 Notion Block 데이터 목록
 * @description 변환된 Notion Block 데이터 목록을 입력받아 중첩할 타입의 블럭을 수집하여 구조화한다.
 * @returns
 */
const transformNestedBlockContent = (
    blogContents: NotionBlogContent[],
): BlogContent[] => {
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
};

export default transformNestedBlockContent;
