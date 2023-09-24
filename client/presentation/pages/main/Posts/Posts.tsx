"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";

import { PostsModule } from "@client/adapter/posts.module";

function Posts() {
  const { data } = useQuery(["posts"], () => PostsModule.getPosts(), {
    enabled: false,
  });

  useEffect(() => {
    data?.databases.forEach((database) => {
      PostsModule.getPost({ page_id: database.id }).then((result) => console.log(result));
      // PostsModule.searchPosts({
      //   start_cursor: database.id,
      // }).then((result) => console.log(result));
    });
  }, [data]);

  return (
    <ul>
      {data?.databases?.map((database) => (
        <li key={database.id}>
          <h3>{database.name}</h3>
          <p>{database.lastEditedTime}</p>
        </li>
      ))}
    </ul>
  );
}

export default Posts;
