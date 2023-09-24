import {
  NotionDatabaseParams,
  NotionDatabaseResult,
  NotionPageParams,
  NotionPageResult,
  NotionSearchParams,
} from "./model";

export type NotionRepository = {
  getNotionDatabases: (params: NotionDatabaseParams) => Promise<NotionDatabaseResult>;
  searchNotionDatabases: (params: NotionSearchParams) => Promise<NotionDatabaseResult>;
  getNotionPage: (params: NotionPageParams) => Promise<NotionPageResult>;
};
