import type { Metadata } from "next"
import { Inter } from "next/font/google"

import ReactQueryProvider from "@v1/shared/context/react-query/ReactQueryProvider"
import "@v1/shared/sass/global/global.scss"
import "@v1/shared/sass/global/reset.scss"
import "@v1/shared/sass/global/variables.scss"

import meta from "@meta/metadata.json"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  ...meta,
  title: {
    default: meta.title,
    template: `${meta.title} | %s`,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content={meta.keywords.join(", ")} />
        <title>{meta.title}</title>
      </head>
      <body className={inter.className}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  )
}
