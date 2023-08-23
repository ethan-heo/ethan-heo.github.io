import { getNotionRepository } from "@repository/notion/notion.repository";

import { getNotionApi } from "@api/notion/notion.api";

import { getNotionDatabasesUseCase } from "@domain/notion/notion.use-cases";

import notionInstance from "@shared/notion.instance";

const notionApi = getNotionApi(notionInstance);
const notionRepository = getNotionRepository(notionApi);

export const NotionModule = {
  getNotionDatabases: getNotionDatabasesUseCase(notionRepository).execute,
};
