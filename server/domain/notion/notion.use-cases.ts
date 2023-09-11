import { NotionDatabasePagingInfo, NotionDatabases, SearchNotionDatabasePagingInfo } from "./notion.model";
import { NotionRepository } from "./notion.repository";

type GetNotionDatabases = UseCaseMultiParamsAndPromiseResult<NotionDatabasePagingInfo, NotionDatabases>;

export const getNotionDatabasesUseCase = (notionRepository: NotionRepository): GetNotionDatabases => ({
  execute: (params) => {
    return notionRepository.getNotionDatabases(params);
  },
});

type GetSearchingDatabases = UseCaseMultiParamsAndPromiseResult<SearchNotionDatabasePagingInfo, NotionDatabases>;

export const searchNotionDatabasesUseCase = (notionRepository: NotionRepository): GetSearchingDatabases => ({
  execute: (params) => {
    return notionRepository.searchNotionDatabases(params);
  },
});
