import React from "react"

import Space from "@v1/presentations/components/space/space.component"

import { PickPostContent } from "@v1/domains/post/models/post.model"

import NotionChildren from "../../notion-children/notion-children.component"
import Annotations from "../annotations/annotations"
import Link from "../link/link.component"
import css from "./paragraph.module.scss"

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
