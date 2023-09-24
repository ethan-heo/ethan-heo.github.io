import {
  NotionBlockListParams,
  NotionBlockListResult,
  NotionDatabaseParams,
  NotionDatabaseResult,
  NotionPageParams,
  NotionPageResult,
  NotionSearchParams,
} from "./model/notion.model";

export type NotionRepository = {
  getNotionDatabases: (params: NotionDatabaseParams) => Promise<NotionDatabaseResult>;
  searchNotionDatabases: (params: NotionSearchParams) => Promise<NotionDatabaseResult>;
  getNotionPage: (params: NotionPageParams) => Promise<NotionPageResult>;
  getNotionBlockList: (params: NotionBlockListParams) => Promise<NotionBlockListResult>;
};
