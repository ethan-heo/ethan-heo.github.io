import { NotionApi } from "@v1/apis/notion/notion.interface"

import { NotionRepository } from "@v1/domains/notion/notion.repository"

import { getNotionBlockList } from "./operations/get-notion-block-list"
import getNotionDatabaseAll from "./operations/get-notion-database-all.operation"

export const getNotionRepository = (notionApi: NotionApi): NotionRepository => ({
  getNotionDatabases: (params) => {
    return notionApi.getNotionDatabases(params)
  },
  getNotionDatabaseAll: (params) => {
    return getNotionDatabaseAll(notionApi, params)
  },
  getNotionBlocks: (params) => {
    return getNotionBlockList(notionApi, params)
  },
  getNotionPage: (params) => {
    return notionApi.getNotionPage(params)
  },
})
