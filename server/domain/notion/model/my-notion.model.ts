export type MyNotionDatabaseStatus = "Ready" | "Doing" | "Done";

export type MyNotionDatabaseResult = {
  hasMore: boolean;
  nextCursor: string | null;
  databases: {
    status: MyNotionDatabaseStatus;
    name: string;
    id: string;
    url: string;
    lastEditedTime: string;
  }[];
};

export type MyNotionPageResult = {
  createdTime: string;
  lastEditedTime: string;
  id: string;
  archived: boolean;
};
