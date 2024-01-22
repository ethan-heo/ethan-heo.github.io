import { NotionDatabaseRes, NotionListBlockChildrenRes } from "./notion.model"

export type NotionDatabaseStatusProperty = "Ready" | "Doing" | "Done"

export type NotionProperties = {}

type DatabaseObj = Extract<ArrayElement<NotionDatabaseRes["results"]>, { title: any[] }>

type DatabasePropertyValues = DatabaseObj["properties"][string]

export type NotionTextAnnotation = {
  bold: boolean
  italic: boolean
  strikethrough: boolean
  underline: boolean
  code: boolean
}

export type NormalizedNotionDatabaseRes = Pick<
  OverrideObject<
    NotionDatabaseRes,
    "results",
    {
      results: OverrideObject<
        DatabaseObj,
        "properties",
        {
          properties: {
            Tags: Extract<DatabasePropertyValues, { type: "multi_select" }>
            Description: Extract<DatabasePropertyValues, { type: "rich_text" }>
            Created: Extract<DatabasePropertyValues, { type: "created_time" }>
            Status: OverrideObject<
              Extract<DatabasePropertyValues, { type: "status" }>,
              "status",
              {
                status: {
                  id: string
                  name: "Ready" | "Doing" | "Done"
                }
              }
            >
            Name: OverrideObject<
              Extract<DatabasePropertyValues, { type: "title" }>,
              "title",
              {
                title: [
                  {
                    type: "text"
                    text: { content: string; link: string | null }
                    annotations: NotionTextAnnotation
                    plain_text: string
                    href: string | null
                  },
                ]
              }
            >
          }
        }
      >[]
    }
  >,
  "has_more" | "next_cursor" | "results"
>

export type NotionDatabase = ArrayElement<NormalizedNotionDatabaseRes["results"]>

export type NormalizedNotionBlockListRes = OverrideObject<
  NotionListBlockChildrenRes,
  "results",
  {
    results: Extract<ArrayElement<NotionListBlockChildrenRes["results"]>, { type: string }>[]
  }
>

export type NotionBlockList = (ArrayElement<NormalizedNotionBlockListRes["results"]> & {
  children: NotionBlockList
})[]
