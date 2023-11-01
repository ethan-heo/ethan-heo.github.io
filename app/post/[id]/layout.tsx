import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "@client/presentation/sass/global/global.scss"
import "@client/presentation/sass/global/reset.scss"
import "@client/presentation/sass/global/variables.scss"

import ReactQueryProvider from "@client/shared/context/react-query/ReactQueryProvider"
import meta from "@client/shared/metadata.json"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = meta

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
