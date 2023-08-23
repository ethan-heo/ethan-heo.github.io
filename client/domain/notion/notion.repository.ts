import { NotionDatabases, NotionDatabasePagingInfo } from "./notion.model"

export type NotionRepository = {
    getNotionDatabases: (params: NotionDatabasePagingInfo) => Promise<NotionDatabases>
}