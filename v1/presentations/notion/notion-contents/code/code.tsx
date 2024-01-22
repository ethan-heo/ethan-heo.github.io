import Prism from "prismjs"
import React from "react"

import Space from "@v1/presentations/components/space/space.component"

import { PickPostContent } from "@v1/domains/post/models/post.model"

import css from "./code.module.scss"

import "prismjs/themes/prism-okaidia.min.css"

type Props = PickPostContent<"code">

function Code({ code }: Props) {
  return (
    <>
      <pre className={css.code}>
        <code
          className={`language-${code.language}`}
          dangerouslySetInnerHTML={{
            __html: Prism.highlight(
              code.rich_text.map((text) => text.plain_text).join("\n"),
              Prism.languages[code.language],
              code.language,
            ),
          }}
        ></code>
      </pre>
      <Space type="small" direction="vertical" />
    </>
  )
}

export default Code
