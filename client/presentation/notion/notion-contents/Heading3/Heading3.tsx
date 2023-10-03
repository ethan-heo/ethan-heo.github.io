import React from "react"

import Space from "@client/presentation/components/Space/Space"

import { PickPostContent } from "@client/domain/posts/posts.model"

import Annotations from "../Annotations/Annotations"
import Link from "../Link/Link"
import css from "./Heading3.module.scss"

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
