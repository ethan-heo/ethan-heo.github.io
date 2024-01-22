import { Inter } from "next/font/google"

import { NotionModule } from "@v1/adapters/notion.module"

import ReactQueryProvider from "@v1/shared/context/react-query/ReactQueryProvider"
import "@v1/shared/sass/global/global.scss"
import "@v1/shared/sass/global/reset.scss"
import "@v1/shared/sass/global/variables.scss"

const inter = Inter({ subsets: ["latin"] })

export const generateMetadata = async ({ params }: { params: { id: string } }) => {
  const page = await NotionModule.getNotionPage({
    page_id: params.id,
  })

  return {
    title: (page.properties as any).Name.title[0].plain_text,
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  )
}
