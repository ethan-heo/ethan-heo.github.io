import { getNotionRepository } from "@server/repository/notion/notion.repository";

import { getNotionApi } from "@server/api/notion/notion.api";

import { getNotionDatabasesUseCase } from "@server/domain/notion/notion.use-cases";

import notionInstance from "@server/shared/notion.instance";

const notionApi = getNotionApi(notionInstance);
const notionRepository = getNotionRepository(notionApi);

export const NotionModule = {
  getNotionDatabases: getNotionDatabasesUseCase(notionRepository).execute,
};
