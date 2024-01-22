import React from "react"

import { GetPostRes } from "@v1/domains/post/models/post.model"

import NotionMapper from "./notion-mapper.component"

type NotionRendererProps = {
  blocks: GetPostRes["blocks"]
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
