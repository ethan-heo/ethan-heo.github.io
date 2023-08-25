import { NotionDatabasePagingInfo, NotionDatabaseResult } from "@server/domain/notion/notion.model";

export type NotionApi = {
  getNotionDatabases: (params: NotionDatabasePagingInfo) => Promise<NotionDatabaseResult>;
};
