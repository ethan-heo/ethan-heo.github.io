import type { OriginalBlogContent } from "./interfaces/model.interface";
import type {
    CodeBlock,
    CodeBlockType,
    DividerBlock,
    DividerBlockType,
    MediaBlock,
    MediaBlockType,
    NotionBlogBlockType,
    PageLinkBlock,
    PageLinkBlockType,
    RichText,
    TableBlock,
    TableBlockType,
    TextBlock,
    TextBlockType,
    TodoBlock,
    TodoBlockType,
} from "./notion-blog-block.interface";

type TransformerResult<T extends NotionBlogBlockType> = T extends TextBlockType
    ? TextBlock
    : T extends MediaBlockType
      ? MediaBlock
      : T extends TableBlockType
        ? TableBlock
        : T extends PageLinkBlockType
          ? PageLinkBlock
          : T extends CodeBlockType
            ? CodeBlock
            : T extends TodoBlockType
              ? TodoBlock
              : T extends DividerBlockType
                ? DividerBlock
                : never;

export type TransformerMap<T extends NotionBlogBlockType> = {
    [key in T]: (
        originalBlogContent: Extract<OriginalBlogContent, { type: key }>,
    ) => TransformerResult<T>;
};

const transformerMap: TransformerMap<NotionBlogBlockType> = {
    paragraph: (content) => {
        return {
            type: content.type,
            id: content.id,
            has_children: content.has_children,
            children: [],
            content: content.paragraph.rich_text as RichText[],
        };
    },
    heading_1: (content) => {
        return {
            type: content.type,
            id: content.id,
            has_children: content.has_children,
            children: [],
            content: content.heading_1.rich_text as RichText[],
        };
    },
    heading_2: (content) => {
        return {
            type: content.type,
            id: content.id,
            has_children: content.has_children,
            children: [],
            content: content.heading_2.rich_text as RichText[],
        };
    },
    heading_3: (content) => {
        return {
            type: content.type,
            id: content.id,
            has_children: content.has_children,
            children: [],
            content: content.heading_3.rich_text as RichText[],
        };
    },
    bulleted_list_item: (content) => {
        return {
            type: content.type,
            id: content.id,
            has_children: content.has_children,
            children: [],
            content: content.bulleted_list_item.rich_text as RichText[],
        };
    },
    numbered_list_item: (content) => {
        return {
            type: content.type,
            id: content.id,
            has_children: content.has_children,
            children: [],
            content: content.numbered_list_item.rich_text as RichText[],
        };
    },
    quote: (content) => {
        return {
            type: content.type,
            id: content.id,
            has_children: content.has_children,
            children: [],
            content: content.quote.rich_text as RichText[],
        };
    },
    toggle: (content) => {
        return {
            type: content.type,
            id: content.id,
            has_children: content.has_children,
            children: [],
            content: content.toggle.rich_text as RichText[],
        };
    },
    link_to_page: (content) => {
        return {
            type: content.type,
            id: content.id,
            has_children: content.has_children,
            children: [],
            content: null,
        };
    },
    image: (content) => {
        const type = content.image.type;
        let url;

        if (type === "external") {
            url = content.image.external.url;
        } else {
            url = content.image.file.url;
        }

        return {
            type: content.type,
            id: content.id,
            has_children: content.has_children,
            children: [],
            content: {
                caption: content.image.caption as RichText[],
                url,
            },
        };
    },
    video: (content) => {
        const type = content.video.type;
        let url;

        if (type === "external") {
            url = content.video.external.url;
        } else {
            url = content.video.file.url;
        }

        return {
            type: content.type,
            id: content.id,
            has_children: content.has_children,
            children: [],
            content: {
                caption: content.video.caption as RichText[],
                url,
            },
        };
    },
    audio: (content) => {
        const type = content.audio.type;
        let url;

        if (type === "external") {
            url = content.audio.external.url;
        } else {
            url = content.audio.file.url;
        }

        return {
            type: content.type,
            id: content.id,
            has_children: content.has_children,
            children: [],
            content: {
                caption: content.audio.caption as RichText[],
                url,
            },
        };
    },
    file: (content) => {
        const type = content.file.type;
        let url;

        if (type === "external") {
            url = content.file.external.url;
        } else {
            url = content.file.file.url;
        }

        return {
            type: content.type,
            id: content.id,
            has_children: content.has_children,
            children: [],
            content: {
                caption: content.file.caption as RichText[],
                url,
            },
        };
    },
    link_preview: (content) => {
        return {
            type: content.type,
            id: content.id,
            has_children: content.has_children,
            children: [],
            content: {
                caption: [] as RichText[],
                url: content.link_preview.url,
            },
        };
    },
    bookmark: (content) => {
        return {
            type: content.type,
            id: content.id,
            has_children: content.has_children,
            children: [],
            content: {
                caption: content.bookmark.caption as RichText[],
                url: content.bookmark.url,
            },
        };
    },
    embed: (content) => {
        return {
            type: content.type,
            id: content.id,
            has_children: content.has_children,
            children: [],
            content: {
                caption: content.embed.caption as RichText[],
                url: content.embed.url,
            },
        };
    },
    table: (content) => {
        return {
            type: content.type,
            id: content.id,
            has_children: content.has_children,
            children: [],
            content: {
                has_column_header: content.table.has_column_header,
                has_row_header: content.table.has_row_header,
                table: [],
            },
        };
    },
    table_row: (content) => {
        return {
            type: content.type,
            id: content.id,
            has_children: content.has_children,
            children: [],
            content: {
                table: content.table_row.cells as RichText[][],
            },
        };
    },

    code: (content) => {
        return {
            type: content.type,
            id: content.id,
            has_children: content.has_children,
            children: [],
            content: {
                texts: content.code.rich_text as RichText[],
                caption: content.code.rich_text as RichText[],
                language: content.code.language,
            },
        };
    },
    to_do: (content) => {
        return {
            type: content.type,
            id: content.id,
            has_children: content.has_children,
            children: [],
            content: {
                checked: content.to_do.checked,
                texts: content.to_do.rich_text as RichText[],
            },
        };
    },
    divider: (content) => {
        return {
            type: content.type,
            id: content.id,
            has_children: content.has_children,
            children: [],
            content: null,
        };
    },
};

export default transformerMap;
