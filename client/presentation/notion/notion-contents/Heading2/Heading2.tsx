import React from "react"

import Space from "@client/presentation/components/Space/Space"

import { PickPostContent } from "@client/domain/posts/posts.model"

import Annotations from "../Annotations/Annotations"
import css from "./Heading2.module.scss"

type Props = PickPostContent<"heading_2">

function Heading2(props: Props) {
  return (
    <>
      <h2 className={css.Heading2}>
        {props.heading_2.rich_text.map((text, idx) => (
          <Annotations key={`${props.id}-${idx}`} {...text.annotations}>
            {text.plain_text}
          </Annotations>
        ))}
      </h2>
      <Space type="large" direction="vertical" />
    </>
  )
}

export default Heading2
