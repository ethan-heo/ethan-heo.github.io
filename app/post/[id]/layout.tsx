import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "@client/presentation/sass/global/global.scss"
import "@client/presentation/sass/global/reset.scss"
import "@client/presentation/sass/global/variables.scss"

import { NotionModule } from "@server/adapter/notion.module"

import ReactQueryProvider from "@client/shared/context/react-query/ReactQueryProvider"

const inter = Inter({ subsets: ["latin"] })

export const generateMetadata = async ({ params }: { params: { id: string } }) => {
  const page = await NotionModule.getNotionPage({
    page_id: params.id,
  })

  return {
    title: page.title,
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
