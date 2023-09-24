import { NotionDatabaseResponse, NotionDatabaseResult } from "@server/domain/notion/model";

export const formatNotionDatabases = (notionDatabase: NotionDatabaseResponse): NotionDatabaseResult => {
  const { has_more, next_cursor, results } = notionDatabase;

  return {
    hasMore: has_more,
    nextCursor: next_cursor,
    databases: results.map((result) => ({
      status: result.properties.Status.status.name,
      name: result.properties.Name.title[0].plain_text,
      id: result.id,
      url: `/${result.id}`,
      lastEditedTime: result.last_edited_time,
    })),
  };
};
