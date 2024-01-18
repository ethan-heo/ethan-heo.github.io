import { NotionBlockListParams, NotionBlockListResult } from "@server/domain/notion/model/notion.model"

import { NotionApi } from "@v1/apis/notion/notion.interface"

export async function getNotionBlockList(notionApi: NotionApi, params: NotionBlockListParams) {
  let isStopGettingBlockLists = true
  let _params = params
  const blocks: NotionBlockListResult = []

  while (isStopGettingBlockLists) {
    const originalBlockList = await notionApi.getNotionBlockList(_params)

    isStopGettingBlockLists = originalBlockList.has_more
    _params = {
      ..._params,
      start_cursor: originalBlockList.next_cursor as string,
    }
    blocks.push(...originalBlockList.results.map((result) => ({ ...result, children: [] })))
  }

  const results = Promise.all(
    blocks.map(async (block) => {
      if (block.has_children) {
        const children = (await getNotionBlockList(notionApi, {
          block_id: block.id,
        })) as NotionBlockListResult
        return {
          ...block,
          children,
        }
      } else {
        return block
      }
    }),
  )

  return results
}
