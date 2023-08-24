"use client";

import ArticleList from "@presentation/pages/main/ArticleList";

import { NotionModule } from "@adapter/notion.module";

import withReactQueryHydration from "@shared/context/react-query/withReactQueryHydration";

function Home() {
  return <main className="flex min-h-screen flex-col items-center justify-between p-24">{/* <ArticleList /> */}</main>;
}

export default withReactQueryHydration(Home, {
  key: "databases",
  callback: () => {
    return NotionModule.getNotionDatabases({
      database_id: process.env.NOTION_DATABASE_ID as string,
    });
  },
});
