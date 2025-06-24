import { Client } from "@notionhq/client";
import type {
    BlockObjectResponse,
    DatabaseObjectResponse,
    ListBlockChildrenParameters,
    ListBlockChildrenResponse,
    QueryDatabaseParameters,
    QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import type {
    DatabaseResultCover,
    DatabaseResultProperties,
} from "./notion.types";

let client: Client;

export const initialize = (apiKey: string) => {
    client = new Client({ auth: apiKey });
};

const getBlogItem = (params: QueryDatabaseParameters) => {
    return client.databases.query(params) as Promise<DatabaseResponse>;
};

export const getBlogItemAll = validClient(
    async (params: QueryDatabaseParameters) => {
        let hasMore = true;
        let startCursor;
        let result: DatabaseResult[] = [];

        while (hasMore) {
            const blogItem = await getBlogItem({
                ...params,
                start_cursor: startCursor,
            });

            result = [...result, ...blogItem.results];
            hasMore = blogItem.has_more;
            startCursor = blogItem.next_cursor ?? undefined;
        }

        return result;
    }
);

const getBlockItem = (params: ListBlockChildrenParameters) => {
    return client.blocks.children.list(params) as Promise<BlockResponse>;
};

export const getBlockAll = validClient(
    async (params: ListBlockChildrenParameters) => {
        let blocks: BlockResult[] = [];
        let hasMore = true;
        let startCursor;

        while (hasMore) {
            const block = await getBlockItem({
                ...params,
                start_cursor: startCursor,
            });

            blocks = [...blocks, ...block.results];
            hasMore = block.has_more;
            startCursor = block.next_cursor ?? undefined;
        }

        for (const block of blocks) {
            if (!block.has_children) {
                continue;
            }

            block.children = await getBlockAll({
                ...params,
                block_id: block.id,
            });
        }

        return blocks;
    }
);

function validClient<T extends (...args: any[]) => any>(fn: T) {
    return (...params: Parameters<T>): ReturnType<T> => {
        if (!client) {
            throw new TypeError(`Not initialized Client instance`);
        }
        return fn(...params);
    };
}

interface DatabaseResponse extends QueryDatabaseResponse {
    results: Array<DatabaseResult>;
}

export interface DatabaseResult extends DatabaseObjectResponse {
    properties: DatabaseResultProperties;
    cover: DatabaseResultCover;
}

interface BlockResponse extends ListBlockChildrenResponse {
    results: BlockObjectResponse[];
}

export type BlockResult = BlockObjectResponse & {
    children?: BlockResult[];
};
