export type NotionBlogBlockType =
    | TextBlockType
    | MediaBlockType
    | TableBlockType
    | PageLinkBlockType
    | CodeBlockType
    | TodoBlockType
    | DividerBlockType;

type CreateBlock<T, A = never> = {
    type: T;
    id: string;
    has_children: boolean;
    content: A extends Array<infer C>
        ? {
              [K in keyof C]: K extends keyof C ? C[K] : never;
          }[]
        : A extends {}
          ? {
                [K in keyof A]: K extends keyof A ? A[K] : never;
            }
          : never;
};

interface Annotations {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
}

export interface RichText {
    type: "text";
    text: {
        content: string;
        link: {
            url: string;
        } | null;
    };
    annotations: Annotations;
    plain_text: string;
    href: string | null;
}

export type TextBlockType =
    | "paragraph"
    | "heading_1"
    | "heading_2"
    | "heading_3"
    | "bulleted_list_item"
    | "numbered_list_item"
    | "quote"
    | "toggle";

export type TextBlock = CreateBlock<TextBlockType, RichText[]>;

export type MediaBlockType =
    | "image"
    | "video"
    | "bookmark"
    | "embed"
    | "audio"
    | "file"
    | "link_preview";
export type MediaBlock = CreateBlock<
    MediaBlockType,
    {
        url: string;
        caption: RichText[];
    }
>;

export type TableBlockType = "table" | "table_row";

export type TableBlock = CreateBlock<
    TableBlockType,
    {
        has_column_header?: boolean;
        has_row_header?: boolean;
        table: RichText[][];
    }
>;

export type PageLinkBlockType = "link_to_page";

export type PageLinkBlock = CreateBlock<PageLinkBlockType>;

export type CodeBlockType = "code";

export type CodeBlock = CreateBlock<
    CodeBlockType,
    {
        texts: RichText[];
        caption: RichText[];
        language: string;
    }
>;

export type TodoBlockType = "to_do";

export type TodoBlock = CreateBlock<
    TodoBlockType,
    {
        checked: boolean;
        texts: RichText[];
    }
>;

export type DividerBlockType = "divider";

export type DividerBlock = CreateBlock<DividerBlockType>;

export type NotionBlogContent =
    | TextBlock
    | MediaBlock
    | TableBlock
    | PageLinkBlock
    | CodeBlock
    | TodoBlock
    | DividerBlock;
