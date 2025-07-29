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

/**
 * 추가 아이디어.
 *
 * 1. 데이터를 가져올 때 Semantic 마크업 데이터로 활용할 수 있는 구조로 변환하도록 만들어보면 어떨까?
 *  -> h1 + div -> sectioning > h1 + div 이런식으로?
 * 2. NotionAPI -> blog Adapter 와의 관계에서 Notion API -> CMS -> blog Adapter 로 변경하면 좀 더 유연하게 사용할 수 있지 않을까 생각 되는데?
 *  -> 이렇게 하면 바꿔야 할 부분이 많음. (데이터 구조, 형식)
 *  -> 추상적인 개념이 필요함. 예를들어 Blog에서 사용되는 데이터의 형식이 blog에 종속되지 않도록 개념이 추가되야 함.
 *  -> NotionAPI 인터페이스를 CMSAPI로 교체해야 하고 이 때 메서드의 시그니처가 변경되어야 함.
 */

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
