import NextLink from "next/link"
import React from "react"

import css from "./link.module.scss"

type Props = {
  href: string
}

function Link({ href, children }: React.PropsWithChildren<Props>) {
  return (
    <NextLink className={css.link} href={href}>
      {children}
    </NextLink>
  )
}

export default Link
