import React from "react"

import Space from "@client/presentation/components/Space/Space"

import { PickPostContent } from "@client/domain/posts/posts.model"

import NotionChildren from "../../NotionChildren/NotionChildren"
import Annotations from "../Annotations/Annotations"
import Link from "../Link/Link"
import css from "./Paragraph.module.scss"

type Props = PickPostContent<"paragraph">

function Paragraph(props: Props) {
  return (
    <>
      <div className={css.paragraph}>
        {props.paragraph.rich_text.map((text, idx) => (
          <Annotations key={`${props.id}-${idx}`} {...text.annotations}>
            {text.href ? <Link href={text.href}>{text.plain_text}</Link> : text.plain_text}
          </Annotations>
        ))}
        <NotionChildren blocks={props.children as any} />
      </div>
      <Space type="small" direction="vertical" />
    </>
  )
}

export default Paragraph
