import { NotionBlockList } from "../models/normalized-notion.model"
import { NotionListBlockChildrenParams } from "../models/notion.model"
import { NotionRepository } from "../notion.repository"

type GetNotionBlockListUseCase = UseCaseMultiParamsAndPromiseResult<NotionListBlockChildrenParams, NotionBlockList>

export const getNotionBlockList = (notionRepository: NotionRepository): GetNotionBlockListUseCase => ({
  execute: (params) => {
    return notionRepository.getNotionBlocks(params)
  },
})
