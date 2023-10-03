import React from "react"

import { GetPostResponse } from "@client/domain/posts/posts.model"

import NotionMapper from "..//NotionMapper"
import css from "./NotionChildren.module.scss"

type NotionChildrenProps = {
  blocks: GetPostResponse["blocks"]
}

function NotionChildren({ blocks }: NotionChildrenProps) {
  if (blocks.length === 0) return null

  return (
    <div className={css["notion-children"]}>
      {blocks.map((block) => (
        <NotionMapper key={block.id} content={block as any} />
      ))}
    </div>
  )
}

export default NotionChildren
