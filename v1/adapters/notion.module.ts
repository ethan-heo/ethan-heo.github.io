import { getNotionRepository } from "@v1/repositories/notion/notion.repository"

import { getNotionApi } from "@v1/apis/notion/notion.api"

import { getNotionBlocks } from "@v1/domains/notion/use-cases/get-notion-blocks.use-case"
import { getNotionDatabaseAllUseCase } from "@v1/domains/notion/use-cases/get-notion-database-all.use-case"
import { getNotionDatabasesUseCase } from "@v1/domains/notion/use-cases/get-notion-databases.use-case"
import { getNotionPageUseCase } from "@v1/domains/notion/use-cases/get-notion-page.use-case"

import notionInstance from "@v1/shared/notion.instance"

const notionApi = getNotionApi(notionInstance)
const notionRepository = getNotionRepository(notionApi)

export const NotionModule = {
  getNotionDatabases: getNotionDatabasesUseCase(notionRepository).execute,
  getNotionDatabaseAll: getNotionDatabaseAllUseCase(notionRepository).execute,
  getNotionPage: getNotionPageUseCase(notionRepository).execute,
  getNotionBlocks: getNotionBlocks(notionRepository).execute,
}
