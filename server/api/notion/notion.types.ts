import {
  NotionDatabasePagingInfo,
  NotionDatabaseResult,
  SearchNotionDatabasePagingInfo,
} from "@server/domain/notion/notion.model";

export type NotionApi = {
  getNotionDatabases: (params: NotionDatabasePagingInfo) => Promise<NotionDatabaseResult>;
  searchNotionDatabases: (params: SearchNotionDatabasePagingInfo) => Promise<NotionDatabaseResult>;
};
