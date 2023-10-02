import {
  NotionBlockListParams,
  NotionBlockListResult,
  NotionDatabaseParams,
  NotionDatabaseResult,
  NotionOnlyDatabaseResult,
  NotionPageParams,
  NotionPageResult,
  NotionSearchParams,
} from "./model/notion.model";

export type NotionRepository = {
  getNotionDatabases: (params: NotionDatabaseParams) => Promise<NotionDatabaseResult>;
  getNotionDatabaseAll: (params: NotionDatabaseParams) => Promise<NotionOnlyDatabaseResult>;
  searchNotionDatabases: (params: NotionSearchParams) => Promise<NotionDatabaseResult>;
  getNotionPage: (params: NotionPageParams) => Promise<NotionPageResult>;
  getNotionBlockList: (params: NotionBlockListParams) => Promise<NotionBlockListResult>;
};
