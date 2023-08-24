import ArticleList from "@presentation/pages/main/ArticleList";

import { NotionModule } from "@adapter/notion.module";

import ReactQueryHydrationProvider from "@shared/context/react-query/ReactQueryHydrationProvider";

function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ReactQueryHydrationProvider
        prefetch={{
          key: "databases",
          callback: () => {
            return NotionModule.getNotionDatabases({
              database_id: process.env.NOTION_DATABASE_ID as string,
            });
          },
        }}
      >
        {/* <ArticleList /> */}
      </ReactQueryHydrationProvider>
    </main>
  );
}

export default Home;
