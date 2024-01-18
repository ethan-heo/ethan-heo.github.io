"use client"

import { useQuery } from "@tanstack/react-query"
import cn from "classnames"
import Link from "next/link"
import React from "react"

import { PostsModule } from "@client/adapter/posts.module"

import { formatPostDate } from "@client/shared/utils/format/date-format.utils"

import css from "./Posts.module.scss"

function Posts() {
  const { data } = useQuery(["posts"], () => PostsModule.getPosts(), {
    enabled: false,
  })

  if (data?.databases.length === 0) {
    return <div className={cn(css["posts-empty"])}>아직 보여드릴 내용이 없어요 🥲</div>
  }

  return (
    <ul className={css.posts}>
      {data?.databases?.map((database) => (
        <li key={database.id} className={css[`posts__item`]}>
          <Link href={`/post/${database.id}`} className={css[`posts__item__title`]}>
            <h3>{database.name}</h3>
          </Link>
          <p className={css[`posts__item__date`]}>{formatPostDate(database.lastEditedTime)}</p>
        </li>
      ))}
    </ul>
  )
}

export default Posts
