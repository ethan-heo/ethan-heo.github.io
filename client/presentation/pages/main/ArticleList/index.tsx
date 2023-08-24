"use client";

import React from "react";
import { useQuery } from "react-query";

import { NotionModule } from "@adapter/notion.module";

function ArticleList() {
  const { data } = useQuery({
    queryKey: "databases",
    queryFn: () =>
      NotionModule.getNotionDatabases({
        database_id: process.env.NOTION_DATABASE_ID as string,
      }),
  });
  // const { databases } = await NotionModule.getNotionDatabases({
  //   database_id: process.env.NOTION_DATABASE_ID as string,
  // });

  return (
    <ul>
      {data?.databases.map((database) => (
        <li key={database.id}>
          <h3>{database.name}</h3>
          <p>{database.lastEditedTime}</p>
        </li>
      ))}
    </ul>
  );
}

export default ArticleList;
