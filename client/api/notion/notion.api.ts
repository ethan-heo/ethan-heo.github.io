import { NotionApi } from "./notion.types";
import { NotionDatabaseResult } from "@domain/notion/notion.model";
import { Client } from "@notionhq/client";

export const getNotionApi = (notionInstance: Client): NotionApi => ({
    getNotionDatabases: (params) => {
        return notionInstance.databases.query(params) as unknown as Promise<NotionDatabaseResult>
    }
})