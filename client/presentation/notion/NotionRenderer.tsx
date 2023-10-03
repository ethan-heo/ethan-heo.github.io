import React from "react"

import { GetPostResponse } from "@client/domain/posts/posts.model"

import NotionMapper from "./NotionMapper"

type NotionRendererProps = {
  blocks: GetPostResponse["blocks"]
}

function NotionRenderer({ blocks }: NotionRendererProps) {
  return (
    <>
      {blocks.map((block) => (
        <NotionMapper key={block.id} content={block as any} />
      ))}
    </>
  )
}

export default NotionRenderer
