import { Client } from "@notionhq/client";

import { NotionDatabaseResult } from "@server/domain/notion/notion.model";

import { NotionApi } from "./notion.types";

export const getNotionApi = (notionInstance: Client): NotionApi => ({
  getNotionDatabases: (params) => {
    return notionInstance.databases.query(params) as unknown as Promise<NotionDatabaseResult>;
  },
  searchNotionDatabases: (params) => {
    return notionInstance.search(params) as unknown as Promise<NotionDatabaseResult>;
  },
});
