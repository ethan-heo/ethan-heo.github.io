"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";

import { PostsModule } from "@client/adapter/posts.module";

function Posts() {
  const { data } = useQuery(["posts"], () => PostsModule.getPosts(), {
    enabled: false,
  });

  return (
    <ul>
      {data?.databases?.map((database) => (
        <li key={database.id}>
          <Link href={`/post/${database.id}`}>
            <h3>{database.name}</h3>
          </Link>
          <p>{database.lastEditedTime}</p>
        </li>
      ))}
    </ul>
  );
}

export default Posts;
