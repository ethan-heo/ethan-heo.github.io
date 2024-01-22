import React from "react"

import Space from "@v1/presentations/components/space/space.component"

import { PickPostContent } from "@v1/domains/post/models/post.model"

import Annotations from "../annotations/annotations"
import Link from "../link/link.component"
import css from "./heading-3.module.scss"

type Props = PickPostContent<"heading_3">

function Heading3(props: Props) {
  return (
    <>
      <h3 className={css.Heading3}>
        {props.heading_3.rich_text.map((text, idx) => (
          <Annotations key={`${props.id}-${idx}`} {...text.annotations}>
            {text.href ? <Link href={text.href}>{text.plain_text}</Link> : text.plain_text}
          </Annotations>
        ))}
      </h3>
      <Space type="large" direction="vertical" />
    </>
  )
}

export default Heading3
