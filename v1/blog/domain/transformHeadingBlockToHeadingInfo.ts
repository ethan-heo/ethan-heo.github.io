import type { BlogContent, HeadingInfo } from "./interfaces/model.interface";
import type { TextBlockType } from "./interfaces/notion-blog-block.interface";

/**
 *
 * @param blogContents Heading Block 목록
 * @description 입력받은 데이터 목록에서 ToC 에 사용되는 데이터로 변환하여 반환한다.
 * @returns
 */
const transformHeadingBlockToHeadingInfo = (
    headingBlogContents: Extract<BlogContent, { type: TextBlockType }>[],
): HeadingInfo[] => {
    return headingBlogContents.map((headingBlogContent) => ({
        text: headingBlogContent.content
            .reduce((acc, { plain_text }) => acc + plain_text, "")
            .trim(),
        level: Number(headingBlogContent.type.match(/[0-9]/g)),
        id: headingBlogContent.id,
    }));
};

export default transformHeadingBlockToHeadingInfo;
