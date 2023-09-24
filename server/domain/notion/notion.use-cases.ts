import {
  NotionDatabaseParams,
  NotionDatabaseResult,
  NotionPageParams,
  NotionPageResult,
  NotionSearchParams,
} from "./model";
import { NotionRepository } from "./notion.repository";

type GetNotionDatabases = UseCaseMultiParamsAndPromiseResult<NotionDatabaseParams, NotionDatabaseResult>;

export const getNotionDatabasesUseCase = (notionRepository: NotionRepository): GetNotionDatabases => ({
  execute: (params) => {
    return notionRepository.getNotionDatabases(params);
  },
});

type GetSearchingDatabases = UseCaseMultiParamsAndPromiseResult<NotionSearchParams, NotionDatabaseResult>;

export const searchNotionDatabasesUseCase = (notionRepository: NotionRepository): GetSearchingDatabases => ({
  execute: (params) => {
    return notionRepository.searchNotionDatabases(params);
  },
});

type GetNotionPage = UseCaseMultiParamsAndPromiseResult<NotionPageParams, NotionPageResult>;

export const getNotionPageUseCase = (notionRepository: NotionRepository): GetNotionPage => ({
  execute: (params) => {
    return notionRepository.getNotionPage(params);
  },
});
