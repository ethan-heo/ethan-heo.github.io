import { Client } from "@notionhq/client";
import type {
    BlockObjectResponse,
    DatabaseObjectResponse,
    ListBlockChildrenParameters,
    ListBlockChildrenResponse,
    QueryDatabaseParameters,
    QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import normalizeBlock, { type BlockResult } from "./notion-block-normalizer.ts";

export interface NotionAPI {
    getDatabaseAll: (
        params: QueryDatabaseParameters,
    ) => Promise<DatabaseResult[]>;
    getBlockAll: (
        params: ListBlockChildrenParameters,
    ) => Promise<BlockResult[]>;
    getDatabase: (params: QueryDatabaseParameters) => Promise<DatabaseResponse>;
    getBlock: (params: ListBlockChildrenParameters) => Promise<BlockResponse>;
}

class Notion implements NotionAPI {
    client: Client;
    constructor(apiKey: string) {
        this.client = new Client({ auth: apiKey });
    }

    async getDatabaseAll(params: QueryDatabaseParameters) {
        let hasMore = true;
        let startCursor;
        let result: DatabaseResult[] = [];

        while (hasMore) {
            const blogItem = await this.getDatabase({
                ...params,
                start_cursor: startCursor,
            });

            result = [...result, ...blogItem.results];
            hasMore = blogItem.has_more;
            startCursor = blogItem.next_cursor ?? undefined;
        }

        return result;
    }

    getDatabase(params: QueryDatabaseParameters) {
        return this.client.databases.query(params) as Promise<DatabaseResponse>;
    }

    async getBlockAll(params: ListBlockChildrenParameters) {
        let blocks: BlockResult[] = [];
        let hasMore = true;
        let startCursor;

        while (hasMore) {
            const block = await this.getBlock({
                ...params,
                start_cursor: startCursor,
            });
            const result = block.results
                .map(normalizeBlock)
                .filter((result) => result !== null);

            blocks = [...blocks, ...result];
            hasMore = block.has_more;
            startCursor = block.next_cursor ?? undefined;
        }

        for (const block of blocks) {
            if (!block.has_children) {
                continue;
            }

            block.children = await this.getBlockAll({
                ...params,
                block_id: block.id,
            });
        }

        return blocks;
    }

    getBlock(params: ListBlockChildrenParameters) {
        return this.client.blocks.children.list(
            params,
        ) as Promise<BlockResponse>;
    }
}

export default Notion;

interface DatabaseResponse extends QueryDatabaseResponse {
    results: Array<DatabaseResult>;
}

export type DatabaseResult = DatabaseObjectResponse & {
    properties: DatabaseResultProperties;
    cover: DatabaseResultCover;
};

interface BlockResponse extends ListBlockChildrenResponse {
    results: BlockObjectResponse[];
}

export interface DatabaseResultProperties {
    category: MultiSelect;
    description: Description;
    related: Related;
    readTime: ReadTime;
    Name: Name;
}

export type DatabaseResultCover = Exclude<
    DatabaseObjectResponse["cover"],
    null
>;

interface MultiSelect {
    id: string;
    type: "multi_select";
    multi_select: {
        id: string;
        name: string;
        color: string;
    }[];
}

interface Related {
    id: string;
    type: "relation";
    relation: {
        id: string;
    }[];
    name: string;
    description: string | null;
    has_more: boolean;
}

interface Description {
    id: string;
    type: "rich_text";
    rich_text: {
        type: "text";
        text: {
            content: string;
            link: string | null;
        };
        annotations: {
            bold: boolean;
            italic: boolean;
            strikethrough: boolean;
            underline: boolean;
            code: boolean;
            color: string;
        };
        plain_text: string;
        href: string | null;
    }[];
}

interface ReadTime {
    id: string;
    type: "number";
    number: number;
}

interface Name {
    id: string;
    type: "title";
    title: {
        type: "text";
        text: {
            content: string;
            link: null;
        };
        annotations: {
            bold: boolean;
            italic: boolean;
            strikethrough: boolean;
            underline: boolean;
            code: boolean;
            color: string;
        };
        plain_text: string;
        href: null;
    }[];
}
