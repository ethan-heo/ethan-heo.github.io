"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";

import axiosInstance from "@client/shared/axios.instance";

function ArticleList() {
  const { data } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => (await axiosInstance.get("/posts")).data,
  });
  // const { databases } = await NotionModule.getNotionDatabases({
  //   database_id: process.env.NOTION_DATABASE_ID as string,
  // });

  console.log(data);

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

export default ArticleList;
