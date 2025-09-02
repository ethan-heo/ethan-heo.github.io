import type {
    BlockObjectResponse,
    DatabaseObjectResponse,
} from "@notionhq/client";
import type {
    NestedNotionBlogContent,
    NotionBlogBlockType,
    NotionBlogContent,
    RichText,
} from "./notion-blog-block.interface.ts";

export interface BlogItem {
    id: string;
    title: string;
    description: string;
    createdDate: string;
    backgroundImg: string;
    categories: string[];
    related: string[];
}

export type OriginalBlogItem = DatabaseObjectResponse & {
    properties: {
        category: {
            id: string;
            type: "multi_select";
            multi_select: {
                id: string;
                name: string;
                color: string;
            }[];
        };
        description: {
            id: string;
            type: "rich_text";
            rich_text: RichText[];
        };
        related: {
            id: string;
            type: "relation";
            relation: {
                id: string;
            }[];
            name: string;
            description: string | null;
            has_more: boolean;
        };
        Name: {
            id: string;
            type: "title";
            title: RichText[];
        };
    };
    cover: Exclude<DatabaseObjectResponse["cover"], null>;
};

export type OriginalBlogContent = Extract<
    BlockObjectResponse,
    { type: NotionBlogBlockType }
>;

export type OriginalBlogContentWithChildren = OriginalBlogContent & {
    children?: OriginalBlogContentWithChildren[];
};

export type BlogContent = NotionBlogContent | NestedNotionBlogContent;

export type BlogContentType = BlogContent["type"];

export type Category = string;

export interface SearchedBlogItem {
    id: string;
    title: string;
    descriptions: string;
    categories: string[];
    backgroundImg: string;
}

export interface HeadingInfo {
    text: string;
    level: number;
    id: string;
}
