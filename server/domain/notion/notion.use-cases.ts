import { NotionDatabaseParams, NotionDatabaseResult, NotionSearchDatabaseParams } from "./model";
import { NotionRepository } from "./notion.repository";

type GetNotionDatabases = UseCaseMultiParamsAndPromiseResult<NotionDatabaseParams, NotionDatabaseResult>;

export const getNotionDatabasesUseCase = (notionRepository: NotionRepository): GetNotionDatabases => ({
  execute: (params) => {
    return notionRepository.getNotionDatabases(params);
  },
});

type GetSearchingDatabases = UseCaseMultiParamsAndPromiseResult<NotionSearchDatabaseParams, NotionDatabaseResult>;

export const searchNotionDatabasesUseCase = (notionRepository: NotionRepository): GetSearchingDatabases => ({
  execute: (params) => {
    return notionRepository.searchNotionDatabases(params);
  },
});
