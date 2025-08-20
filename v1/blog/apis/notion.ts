import { Client } from "@notionhq/client";
import type {
    ListBlockChildrenParameters,
    ListBlockChildrenResponse,
    QueryDatabaseParameters,
    QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import type {
    OriginalBlogContentWithChildren,
    OriginalBlogItem,
} from "../domain/interfaces/model.interface.ts";

const createNotionAPI = (): NotionAPI => {
    let client: Client;

    const init = (apiKey: string) => {
        client = new Client({ auth: apiKey });
    };

    const isInitialized = () => {
        if (!client) throw new Error(`Client 인스턴스가 생성되지 않았습니다.`);
    };

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
        let blocks: OriginalBlogContentWithChildren[] = [];
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
        init,
        getDatabaseAll: (id: string) => {
            isInitialized();
            return getDatabaseAll({
                database_id: id,
                filter: {
                    property: "publish",
                    checkbox: {
                        equals: true,
                    },
                },
            });
        },
        getBlockAll: (id: string) => {
            isInitialized();

            return getBlockAll({ block_id: id });
        },
    };
};

export default createNotionAPI;

export interface NotionAPI {
    init: (apiKey: string) => void;
    getDatabaseAll: (id: string) => Promise<OriginalBlogItem[]>;
    getBlockAll: (id: string) => Promise<OriginalBlogContentWithChildren[]>;
}

interface DatabaseResponse extends QueryDatabaseResponse {
    results: Array<OriginalBlogItem>;
}

interface BlockResponse extends ListBlockChildrenResponse {
    results: OriginalBlogContentWithChildren[];
}
