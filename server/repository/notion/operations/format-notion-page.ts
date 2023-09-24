import { NotionPageResponse, NotionPageResult } from "@server/domain/notion/model/notion.model";

export const formatNotionPage = (notionPage: NotionPageResponse): NotionPageResult => {
  const { created_time, last_edited_time, id, archived } = notionPage;

  return {
    createdTime: created_time,
    lastEditedTime: last_edited_time,
    id,
    archived,
  };
};
