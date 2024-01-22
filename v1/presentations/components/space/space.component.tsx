import React from "react"

import css from "./space.module.scss"

type Props = {
  direction: "vertical" | "horizontal"
  type: "large" | "medium" | "small"
}

const SpaceCSSPrefix = "space"

function Space({ direction, type }: Props) {
  return <div className={css[`${SpaceCSSPrefix}__${direction}-${type}`]} />
}

export default Space
