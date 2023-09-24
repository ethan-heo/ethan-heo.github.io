import { NotionDatabaseParams, NotionDatabaseResult, NotionSearchDatabaseParams } from "./model";

export type NotionRepository = {
  getNotionDatabases: (params: NotionDatabaseParams) => Promise<NotionDatabaseResult>;
  searchNotionDatabases: (params: NotionSearchDatabaseParams) => Promise<NotionDatabaseResult>;
};
