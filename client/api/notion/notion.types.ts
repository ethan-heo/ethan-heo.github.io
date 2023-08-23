import { NotionDatabasePagingInfo, NotionDatabaseResult } from '@domain/notion/notion.model';

export type NotionApi = {
    getNotionDatabases: (params: NotionDatabasePagingInfo) => Promise<NotionDatabaseResult>
}