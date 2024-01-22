"use client"

import { useQuery } from "@tanstack/react-query"
import cn from "classnames"
import Link from "next/link"
import React from "react"

import { PostsModule } from "@v1/adapters/post.module"

import { formatPostDate } from "@v1/shared/utils/format/date-format.utils"

import css from "./posts.module.scss"

function Posts() {
  const { data } = useQuery(["posts"], () => PostsModule.getPosts(), {
    enabled: false,
  })

  if (data?.results.length === 0) {
    return <div className={cn(css["posts-empty"])}>아직 보여드릴 내용이 없어요 🥲</div>
  }

  return (
    <ul className={css.posts}>
      {data?.results?.map((database) => {
        return (
          <li key={database.id} className={css[`posts__item`]}>
            <Link href={`/post/${database.id}`} className={css[`posts__item__title`]}>
              <h3>{database.properties.Name.title[0].plain_text}</h3>
            </Link>
            <p className={css[`posts__item__date`]}>{formatPostDate(database.last_edited_time)}</p>
          </li>
        )
      })}
    </ul>
  )
}

export default Posts
