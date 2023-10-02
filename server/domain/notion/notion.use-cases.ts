import {
  NotionBlockListParams,
  NotionBlockListResult,
  NotionDatabaseParams,
  NotionDatabaseResult,
  NotionOnlyDatabaseResult,
  NotionPageParams,
  NotionPageResult,
  NotionSearchParams,
} from "./model/notion.model";
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

type GetNotionPageUseCase = UseCaseMultiParamsAndPromiseResult<NotionPageParams, NotionPageResult>;

export const getNotionPageUseCase = (notionRepository: NotionRepository): GetNotionPageUseCase => ({
  execute: (params) => {
    return notionRepository.getNotionPage(params);
  },
});

type GetNotionBlockListUseCase = UseCaseMultiParamsAndPromiseResult<NotionBlockListParams, NotionBlockListResult>;

export const getNotionBlockList = (notionRepository: NotionRepository): GetNotionBlockListUseCase => ({
  execute: (params) => {
    return notionRepository.getNotionBlockList(params);
  },
});

type GetNotionDatabaseAll = UseCaseMultiParamsAndPromiseResult<NotionDatabaseParams, NotionOnlyDatabaseResult>;

export const getNotionDatabaseAllUseCase = (notionRepository: NotionRepository): GetNotionDatabaseAll => ({
  execute: (params) => {
    return notionRepository.getNotionDatabaseAll(params);
  },
});
