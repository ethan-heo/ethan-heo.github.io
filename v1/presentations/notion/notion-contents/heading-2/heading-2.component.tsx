import React from "react"

import Space from "@v1/presentations/components/space/space.component"

import { PickPostContent } from "@v1/domains/post/models/post.model"

import Annotations from "../annotations/annotations"
import Link from "../link/link.component"
import css from "./heading-2.module.scss"

type Props = PickPostContent<"heading_2">

function Heading2(props: Props) {
  return (
    <>
      <h2 className={css.Heading2}>
        {props.heading_2.rich_text.map((text, idx) => (
          <Annotations key={`${props.id}-${idx}`} {...text.annotations}>
            {text.href ? <Link href={text.href}>{text.plain_text}</Link> : text.plain_text}
          </Annotations>
        ))}
      </h2>
      <Space type="large" direction="vertical" />
    </>
  )
}

export default Heading2
