import { Client } from "@notionhq/client";
import type {
    ListBlockChildrenParameters,
    ListBlockChildrenResponse,
    QueryDatabaseParameters,
    QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import type {
    OriginalBlogContent,
    OriginalBlogItem,
} from "../domain/interfaces/model.interface";

const createNotionAPI = (apiKey: string): NotionAPI => {
    const client = new Client({ auth: apiKey });

    const getDatabase = async (params: QueryDatabaseParameters) => {
        return client.databases.query(params) as Promise<DatabaseResponse>;
    };

    const getDatabaseAll = async (params: QueryDatabaseParameters) => {
        let hasMore = true;
        let startCursor;
        let result: OriginalBlogItem[] = [];

        while (hasMore) {
            const blogItem = await getDatabase({
                ...params,
                start_cursor: startCursor,
            });

            result.push(...blogItem.results);
            hasMore = blogItem.has_more;
            startCursor = blogItem.next_cursor ?? undefined;
        }

        return result;
    };

    const getBlockAll = async (params: ListBlockChildrenParameters) => {
        let blocks: BlockResponseResults[] = [];
        let hasMore = true;
        let startCursor;

        while (hasMore) {
            const block = await getBlock({
                ...params,
                start_cursor: startCursor,
            });
            const result = block.results.filter((result) => result !== null);

            blocks = [...blocks, ...result];
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
    };

    const getBlock = async (params: ListBlockChildrenParameters) => {
        return client.blocks.children.list(params) as Promise<BlockResponse>;
    };

    return {
        getDatabaseAll: (id: string) => getDatabaseAll({ database_id: id }),
        getBlockAll: (id: string) => getBlockAll({ block_id: id }),
    };
};

export default createNotionAPI;

export interface NotionAPI {
    getDatabaseAll: (id: string) => Promise<OriginalBlogItem[]>;
    getBlockAll: (id: string) => Promise<OriginalBlogContent[]>;
}

interface DatabaseResponse extends QueryDatabaseResponse {
    results: Array<OriginalBlogItem>;
}

interface BlockResponse extends ListBlockChildrenResponse {
    results: BlockResponseResults[];
}

type BlockResponseResults = OriginalBlogContent & {
    children: OriginalBlogContent[];
};
