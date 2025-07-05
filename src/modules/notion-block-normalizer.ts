/**
 * Notion Block Normalizer
 *
 * Notion 블럭 데이터 구조를 쉽게 사용하기 위한 구조로 변경하는 모듈
 * 각 블럭 모두 대응해야 하며 최종적으로 내보내지는 기능을 통해 사용될 것.
 *
 * 이 기능은 Notion의 getBlock 메서드에서 사용됨.
 */

import type {
    BlockObjectResponse,
    RichTextItemResponse,
} from "@notionhq/client";

const NotionBlockNormalizer: BlockNormalizer = {
    paragraph: (block) => {
        return {
            id: block.id,
            has_children: block.has_children,
            children: [],
            type: "paragraph",
            text: block.paragraph.rich_text,
        };
    },
    heading_1: (block) => {
        return {
            id: block.id,
            has_children: block.has_children,
            children: [],
            type: "heading_1",
            text: block.heading_1.rich_text,
        };
    },
    heading_2: (block) => {
        return {
            id: block.id,
            has_children: block.has_children,
            children: [],
            type: "heading_2",
            text: block.heading_2.rich_text,
        };
    },
    heading_3: (block) => {
        return {
            id: block.id,
            has_children: block.has_children,
            children: [],
            type: "heading_3",
            text: block.heading_3.rich_text,
        };
    },
    bulleted_list_item: (block) => {
        return {
            id: block.id,
            has_children: block.has_children,
            children: [],
            type: "bulleted_list_item",
            text: block.bulleted_list_item.rich_text,
        };
    },
    numbered_list_item: (block) => {
        return {
            id: block.id,
            has_children: block.has_children,
            children: [],
            type: "numbered_list_item",
            text: block.numbered_list_item.rich_text,
        };
    },
    quote: (block) => {
        return {
            id: block.id,
            has_children: block.has_children,
            children: [],
            type: "quote",
            text: block.quote.rich_text,
        };
    },
    toggle: (block) => {
        return {
            id: block.id,
            has_children: block.has_children,
            children: [],
            type: "toggle",
            text: block.toggle.rich_text,
        };
    },
    link_to_page: (block) => {
        const linkToPage = block.link_to_page;
        let pageId: string;

        switch (linkToPage.type) {
            case "page_id":
                pageId = linkToPage.page_id;
                break;
            case "database_id":
                pageId = linkToPage.database_id;
                break;
            case "comment_id":
                pageId = linkToPage.comment_id;
                break;
            default:
                pageId = "";
        }

        return {
            id: block.id,
            has_children: block.has_children,
            children: [],
            type: "link_to_page",
            pageId,
        };
    },
    image: (block) => {
        let url: string;
        let caption: RichText[];

        switch (block.image.type) {
            case "external":
                url = block.image.external.url;
                caption = block.image.caption;
                break;
            case "file":
                url = block.image.file.url;
                caption = block.image.caption;
                break;
        }

        return {
            id: block.id,
            has_children: block.has_children,
            children: [],
            type: "image",
            content: {
                url,
                caption,
            },
        };
    },
    video: (block) => {
        let url: string;
        let caption: RichText[];

        switch (block.video.type) {
            case "external":
                url = block.video.external.url;
                caption = block.video.caption;
                break;
            case "file":
                url = block.video.file.url;
                caption = block.video.caption;
                break;
        }

        return {
            id: block.id,
            has_children: block.has_children,
            children: [],
            type: "video",
            content: {
                url,
                caption,
            },
        };
    },
    bookmark: (block) => {
        return {
            id: block.id,
            has_children: block.has_children,
            children: [],
            type: "bookmark",
            content: block.bookmark,
        };
    },
    embed: (block) => {
        return {
            id: block.id,
            has_children: block.has_children,
            children: [],
            type: "embed",
            content: block.embed,
        };
    },
    audio: (block) => {
        let url: string;
        let caption: RichText[];

        switch (block.audio.type) {
            case "external":
                url = block.audio.external.url;
                caption = block.audio.caption;
                break;
            case "file":
                url = block.audio.file.url;
                caption = block.audio.caption;
                break;
        }

        return {
            id: block.id,
            has_children: block.has_children,
            children: [],
            type: "audio",
            content: {
                url,
                caption,
            },
        };
    },
    file: (block) => {
        let url: string;
        let caption: RichText[];

        switch (block.file.type) {
            case "external":
                url = block.file.external.url;
                caption = block.file.caption;
                break;
            case "file":
                url = block.file.file.url;
                caption = block.file.caption;
                break;
            case "external":
                url = block.file.external.url;
                caption = block.file.caption;
                break;
        }
        return {
            id: block.id,
            has_children: block.has_children,
            children: [],
            type: "file",
            content: {
                url,
                caption,
            },
        };
    },
    link_preview: (block) => {
        return {
            id: block.id,
            has_children: block.has_children,
            children: [],
            type: "link_preview",
            content: {
                url: block.link_preview.url,
                caption: [],
            },
        };
    },
    table: (block) => {
        return {
            id: block.id,
            has_children: block.has_children,
            children: [],
            type: "table",
            has_column_header: block.table.has_column_header,
            has_row_header: block.table.has_row_header,
            contents: [],
        };
    },
    table_row: (block) => {
        return {
            id: block.id,
            has_children: block.has_children,
            children: [],
            type: "table_row",
            contents: block.table_row.cells,
        };
    },
};

const normalizeBlock = (block: BlockObjectResponse) => {
    const normalizer = NotionBlockNormalizer[block.type as BlockType];

    if (!normalizer) {
        return null;
    }

    return normalizer(block as any);
};

export default normalizeBlock;

type BlockType = Extract<
    BlockObjectResponse["type"],
    TextBlock | MediaContentBlock | TableBlock | PageLink
>;

type BlockNormalizer = {
    [key in BlockType]: (
        block: Extract<BlockObjectResponse, { type: key }>
    ) => BlockNormalizerResult<key>;
};

type TextBlock =
    | "paragraph"
    | "heading_1"
    | "heading_2"
    | "heading_3"
    | "bulleted_list_item"
    | "numbered_list_item"
    | "quote"
    | "toggle";

type RichText = RichTextItemResponse;

interface TextBlockNormalizerResult {
    type: TextBlock;
    text: RichText[];
}

type MediaContentBlock =
    | "image"
    | "video"
    | "bookmark"
    | "embed"
    | "audio"
    | "file"
    | "link_preview";

type MediaContentWithFileAndCaption = {
    url: string;
    caption: RichText[];
};

interface MediaContentNormalizerResult {
    type: MediaContentBlock;
    content: MediaContentWithFileAndCaption;
}

type TableBlock = "table" | "table_row";

interface TableBlockNormalizerResult {
    type: TableBlock;
    has_column_header?: boolean;
    has_row_header?: boolean;
    contents: RichText[][];
}

type PageLink = "link_to_page";

interface PageLinkNormalizerResult {
    type: PageLink;
    pageId: string;
}

interface CommonNormalizerResult {
    id: string;
    has_children?: boolean;
    children?: BlockNormalizerResult<BlockType>[];
}

type BlockNormalizerResult<T extends BlockType> = (T extends TextBlock
    ? TextBlockNormalizerResult
    : T extends MediaContentBlock
    ? MediaContentNormalizerResult
    : T extends TableBlock
    ? TableBlockNormalizerResult
    : T extends PageLink
    ? PageLinkNormalizerResult
    : never) &
    CommonNormalizerResult;

export type BlockResult = BlockNormalizerResult<BlockType>;
