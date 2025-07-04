/**
 * Notion Block Normalizer
 *
 * Notion 블럭 데이터 구조를 쉽게 사용하기 위한 구조로 변경하는 모듈
 * 각 블럭 모두 대응해야 하며 최종적으로 내보내지는 기능을 통해 사용될 것.
 *
 * 이 기능은 Notion의 getBlock 메서드에서 사용됨.
 */

import type { BlockObjectResponse } from "@notionhq/client";

const NotionBlockNormalizer: BlockNormalizer = {};

type BlockType = BlockObjectResponse["type"];

type BlockNormalizer = {
    [key in BlockType]: (
        block: Extract<BlockObjectResponse, { type: key }>
    ) => BlockNormalizerResult<key>;
};

type TextBlock = Extract<
    BlockType,
    | "paragraph"
    | "heading_1"
    | "heading_2"
    | "heading_3"
    | "bulleted_list_item"
    | "numbered_list_item"
    | "quote"
    | "toggle"
    | "link_to_page"
>;

type MediaContentBlock = Extract<
    BlockType,
    "image" | "video" | "bookmark" | "embed" | "audio" | "file" | "link_preview"
>;

type TableBlock = Extract<
    BlockType,
    "table_of_contents" | "column_list" | "column" | "table" | "table_row"
>;

type BlockNormalizerResult<T extends BlockType> = T extends TextBlock
    ? 1
    : T extends MediaContentBlock
    ? 2
    : T extends TableBlock
    ? 3
    : never;
