import React from "react";

import { NotionModule } from "@server/adapter/notion.module";

type PostProps = {
  params: {
    id: string;
  };
};

async function Post({ params }: PostProps) {
  const page = await NotionModule.getNotionPage({
    page_id: params.id,
  });
  const blocks = await NotionModule.getNotionBlockList({
    block_id: page.id,
  });

  return (
    <div>
      Post {JSON.stringify(page)}
      {JSON.stringify(blocks)}
    </div>
  );
}

export default Post;

export async function generateStaticParams() {
  const databases = await NotionModule.getNotionDatabaseAll({
    database_id: process.env.NEXT_PUBLIC_NOTION_DATABASE_ID as string,
  });

  return databases.map((database) => ({
    id: database.id,
  }));
}
