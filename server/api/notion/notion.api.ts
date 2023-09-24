import { Client } from "@notionhq/client";

import { NotionDatabaseResponse, NotionPageResponse, NotionSearchResponse } from "@server/domain/notion/model";

import { NotionApi } from "./notion.types";

export const getNotionApi = (notionInstance: Client): NotionApi => ({
  getNotionPage: (params) => {
    return notionInstance.pages.retrieve(params) as unknown as Promise<NotionPageResponse>;
  },
  getNotionDatabases: (params) => {
    return notionInstance.databases.query(params) as unknown as Promise<NotionDatabaseResponse>;
  },
  searchNotionDatabases: (params) => {
    return notionInstance.search(params) as unknown as Promise<NotionSearchResponse>;
  },
});
