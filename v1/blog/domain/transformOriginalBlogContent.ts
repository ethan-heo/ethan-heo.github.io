import type { OriginalBlogContentWithChildren } from "./interfaces/model.interface.ts";
import type { NotionBlogContent } from "./interfaces/notion-blog-block.interface.ts";
import transformerMap from "./modules/transformer.ts";

/**
 *
 * @param originalBlogContent Notion Block
 * @description Notion Block 데이터를 입력받아 Block 타입 별로 데이터를 변환한다.
 * @returns
 */
const transformOriginalBlogContent = (
    originalBlogContent: OriginalBlogContentWithChildren,
): NotionBlogContent => {
    const transformer = transformerMap[originalBlogContent.type];

    if (!transformer)
        throw new Error(`${originalBlogContent.type} 을 변환할 수 없습니다.`);

    return transformer(originalBlogContent as any);
};

export default transformOriginalBlogContent;
