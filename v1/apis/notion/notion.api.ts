import { Client } from "@notionhq/client"

import {
  NormalizedNotionBlockListRes,
  NormalizedNotionDatabaseRes,
} from "@v1/domains/notion/models/normalized-notion.model"
import { NotionPageRes } from "@v1/domains/notion/models/notion.model"

import { NotionApi } from "./notion.interface"

export const getNotionApi = (notionIns: Client): NotionApi => ({
  getNotionDatabases: (params) => {
    return notionIns.databases.query(params) as unknown as Promise<NormalizedNotionDatabaseRes>
  },
  getNotionPage: (params) => {
    return notionIns.pages.retrieve(params) as unknown as Promise<NotionPageRes>
  },
  getNotionBlockList: (params) => {
    return notionIns.blocks.children.list(params) as unknown as Promise<NormalizedNotionBlockListRes>
  },
})
