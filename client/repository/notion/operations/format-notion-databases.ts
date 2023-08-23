import { NotionDatabases, NotionDatabaseResult } from "@domain/notion/notion.model";

export const formatNotionDatabases = (notionDatabase: NotionDatabaseResult): NotionDatabases => {
    const { has_more, next_cursor, results } = notionDatabase

    return {
        hasMore: has_more,
        nextCursor: next_cursor,
        databases: results.map(result => ({
            status: result.properties.Status.status.name,
            name: result.properties.Name.title[0].plain_text,
            id: result.id,
            url: `/${result.id}`,
            lastEditedTime: result.last_edited_time,
        }))
    }
}