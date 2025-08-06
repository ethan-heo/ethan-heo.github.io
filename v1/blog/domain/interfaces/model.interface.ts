import type {
    BlockObjectResponse,
    DatabaseObjectResponse,
} from "@notionhq/client";
import type {
    NotionBlogBlockType,
    NotionBlogContent,
    RichText,
} from "../notion-blog-block.interface";

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
            title: {
                type: "text";
                text: RichText[];
            };
        };
    };
    cover: Exclude<DatabaseObjectResponse["cover"], null>;
};

export type OriginalBlogContent = Extract<
    BlockObjectResponse,
    { type: NotionBlogBlockType }
>;

export type BlogContent = NotionBlogContent;

export type Category = string;

export interface SearchedBlogItem {
    id: string;
    title: string;
}
