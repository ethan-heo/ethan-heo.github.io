import React from "react"

import Space from "@client/presentation/components/Space/Space"

import { PickPostContent } from "@client/domain/posts/posts.model"

import Annotations from "../Annotations/Annotations"
import css from "./Paragraph.module.scss"

type Props = PickPostContent<"paragraph">

function Paragraph(props: Props) {
  return (
    <>
      <p className={css.paragraph}>
        {props.paragraph.rich_text.map((text, idx) => (
          <Annotations key={`${props.id}-${idx}`} {...text.annotations}>
            {text.plain_text}
          </Annotations>
        ))}
      </p>
      <Space type="small" direction="vertical" />
    </>
  )
}

export default Paragraph
