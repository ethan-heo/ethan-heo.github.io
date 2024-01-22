import React from "react"

import { GetPostRes } from "@v1/domains/post/models/post.model"

import NotionMapper from "../notion-mapper.component"
import css from "./notion-children.module.scss"

type NotionChildrenProps = {
  blocks: GetPostRes["blocks"]
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
