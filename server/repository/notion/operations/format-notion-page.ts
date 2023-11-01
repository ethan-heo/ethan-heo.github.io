import { NotionPageResponse, NotionPageResult } from "@server/domain/notion/model/notion.model"

export const formatNotionPage = (notionPage: NotionPageResponse): NotionPageResult => {
  const { created_time, last_edited_time, id, archived, properties } = notionPage

  return {
    createdTime: created_time,
    lastEditedTime: last_edited_time,
    id,
    archived,
    title: (properties as any).Name.title[0].plain_text,
  }
}
