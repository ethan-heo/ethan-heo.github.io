import { NormalizedNotionDatabaseRes, NotionBlockList, NotionDatabase } from "./models/normalized-notion.model"
import {
  NotionDatabaseParams,
  NotionListBlockChildrenParams,
  NotionPageParams,
  NotionPageRes,
} from "./models/notion.model"

export type NotionRepository = {
  getNotionDatabases: (params: NotionDatabaseParams) => Promise<NormalizedNotionDatabaseRes>
  getNotionDatabaseAll: (params: NotionDatabaseParams) => Promise<NotionDatabase[]>
  getNotionPage: (params: NotionPageParams) => Promise<NotionPageRes>
  getNotionBlocks: (params: NotionListBlockChildrenParams) => Promise<NotionBlockList>
}
