import cn from "classnames"
import Prism from "prismjs"
import React from "react"

import Space from "@client/presentation/components/Space/Space"

import { PickPostContent } from "@client/domain/posts/posts.model"

import css from "./Code.module.scss"

import "prismjs/themes/prism-okaidia.min.css"

type Props = PickPostContent<"code">

function Code({ code }: Props) {
  return (
    <>
      <pre className={cn("line-numbers", css.code)}>
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
