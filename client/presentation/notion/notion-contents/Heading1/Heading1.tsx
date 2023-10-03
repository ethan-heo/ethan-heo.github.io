import React from "react"

import Space from "@client/presentation/components/Space/Space"

import { PickPostContent } from "@client/domain/posts/posts.model"

import Annotations from "../Annotations/Annotations"
import css from "./Heading1.module.scss"

type Props = PickPostContent<"heading_1">

function Heading1(props: Props) {
  return (
    <>
      <h1 className={css.Heading1}>
        {props.heading_1.rich_text.map((text, idx) => (
          <Annotations key={`${props.id}-${idx}`} {...text.annotations}>
            {text.plain_text}
          </Annotations>
        ))}
      </h1>
      <Space type="large" direction="vertical" />
    </>
  )
}

export default Heading1
