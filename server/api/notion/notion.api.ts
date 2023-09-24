import { Client } from "@notionhq/client";

import { NotionDatabaseResponse, NotionSearchDatabaseResponse } from "@server/domain/notion/model";

import { NotionApi } from "./notion.types";

export const getNotionApi = (notionInstance: Client): NotionApi => ({
  getNotionDatabases: (params) => {
    return notionInstance.databases.query(params) as unknown as Promise<NotionDatabaseResponse>;
  },
  searchNotionDatabases: (params) => {
    return notionInstance.search(params) as unknown as Promise<NotionSearchDatabaseResponse>;
  },
});
