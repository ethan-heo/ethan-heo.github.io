import { NotionPageResponse, NotionPageResult } from "@server/domain/notion/model";

export const formatNotionPage = (notionDatabase: NotionPageResponse): NotionPageResult => {
  const { created_time, last_edited_time, id, archived } = notionDatabase;

  return {
    createdTime: created_time,
    lastEditedTime: last_edited_time,
    id,
    archived,
  };
};
