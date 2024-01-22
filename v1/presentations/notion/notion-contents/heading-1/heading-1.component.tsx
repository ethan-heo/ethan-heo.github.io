import React from "react"

import Space from "@v1/presentations/components/space/space.component"

import { PickPostContent } from "@v1/domains/post/models/post.model"

import Annotations from "../annotations/annotations"
import Link from "../link/link.component"
import css from "./heading-1.module.scss"

type Props = PickPostContent<"heading_1">

function Heading1(props: Props) {
  return (
    <>
      <h1 className={css.Heading1}>
        {props.heading_1.rich_text.map((text, idx) => (
          <Annotations key={`${props.id}-${idx}`} {...text.annotations}>
            {text.href ? <Link href={text.href}>{text.plain_text}</Link> : text.plain_text}
          </Annotations>
        ))}
      </h1>
      <Space type="large" direction="vertical" />
    </>
  )
}

export default Heading1
