import fs from "fs/promises"
import path from "path"
import React from "react"

import NotionRenderer from "@v1/presentations/notion/notion-renderer.component"

import { NotionModule } from "@v1/adapters/notion.module"

type PostProps = {
  params: {
    id: string
  }
}

async function Post({ params }: PostProps) {
  const page = await NotionModule.getNotionPage({
    page_id: params.id,
  })
  const blocks = await NotionModule.getNotionBlocks({
    block_id: page.id,
  })

  return <NotionRenderer blocks={blocks} />
}

export default Post

export async function generateStaticParams() {
  const databases = await NotionModule.getNotionDatabaseAll({
    database_id: process.env.NEXT_PUBLIC_NOTION_DATABASE_ID as string,
  })

  const filePath = path.resolve(process.env.PWD as string, "meta")
  const fileName = "posts.json"

  await fs.writeFile(
    path.resolve(filePath, fileName),
    JSON.stringify(
      {
        posts: databases,
      },
      null,
      2,
    ),
    "utf-8",
  )

  return databases.map((database) => ({
    id: database.id,
  }))
}
