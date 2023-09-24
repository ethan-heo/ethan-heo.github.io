import {
  NotionDatabaseParams,
  NotionDatabaseResponse,
  NotionSearchDatabaseParams,
  NotionSearchDatabaseResponse,
} from "@server/domain/notion/model";

export type NotionApi = {
  getNotionDatabases: (params: NotionDatabaseParams) => Promise<NotionDatabaseResponse>;
  searchNotionDatabases: (params: NotionSearchDatabaseParams) => Promise<NotionSearchDatabaseResponse>;
};
