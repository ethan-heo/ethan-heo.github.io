import Posts from "@v1/presentations/post/posts.component"

import { NotionModule } from "@v1/adapters/notion.module"

import withReactQueryHydration from "@v1/shared/context/react-query/withReactQueryHydration"

function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Posts />
    </main>
  )
}

export default withReactQueryHydration(Home, {
  key: "posts",
  callback: () => {
    // server 모듈을 가져와서 사용하는 것이 맞을까?
    return NotionModule.getNotionDatabases({
      database_id: process.env.NEXT_PUBLIC_NOTION_DATABASE_ID as string,
    })
  },
})
