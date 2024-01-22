import cn from "classnames"
import React from "react"

import { PostContentAnnotation } from "@v1/domains/post/models/post.model"

import css from "./annotations.module.scss"

type Props = React.PropsWithChildren<PostContentAnnotation>

function Annotations({ children, ...annotations }: Props) {
  const annotationStyles = Object.entries(annotations).map(([key, value]) => (value ? css[key] : ""))

  return <div className={cn(css.annotations, annotationStyles)}>{children}</div>
}

export default Annotations
