import {
  NotionBlockListParams,
  NotionBlockListResponse,
  NotionDatabaseParams,
  NotionDatabaseResponse,
  NotionPageParams,
  NotionPageResponse,
  NotionSearchParams,
  NotionSearchResponse,
} from "@server/domain/notion/model/notion.model";

export type NotionApi = {
  getNotionPage: (params: NotionPageParams) => Promise<NotionPageResponse>;
  getNotionDatabases: (params: NotionDatabaseParams) => Promise<NotionDatabaseResponse>;
  searchNotionDatabases: (params: NotionSearchParams) => Promise<NotionSearchResponse>;
  getNotionBlockList: (params: NotionBlockListParams) => Promise<NotionBlockListResponse>;
};
