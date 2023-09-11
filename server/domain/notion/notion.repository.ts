import { NotionDatabasePagingInfo, NotionDatabases, SearchNotionDatabasePagingInfo } from "./notion.model";

export type NotionRepository = {
  getNotionDatabases: (params: NotionDatabasePagingInfo) => Promise<NotionDatabases>;
  searchNotionDatabases: (params: SearchNotionDatabasePagingInfo) => Promise<NotionDatabases>;
};
