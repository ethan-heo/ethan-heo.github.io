import React from "react"

import { PostContent } from "@client/domain/posts/posts.model"

import * as NotionContents from "./notion-contents"

type Props = {
  content: PostContent
}

const NotionContentMap = new Map(Object.entries(NotionContents))

function NotionMapper({ content }: Props) {
  const Component = NotionContentMap.get(content.type)

  if (!Component) {
    return <div>No Content</div>
  }

  return <Component {...(content as any)} />
}

export default NotionMapper
