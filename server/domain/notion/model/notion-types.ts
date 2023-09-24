export type NotionStatusProperty<Name> = {
  Status: {
    id: string;
    type: "status";
    status: {
      id: string;
      name: Name;
      color: string;
    };
  };
};

export type NotionNameProperty = {
  Name: {
    title: {
      plain_text: string;
    }[];
  };
};
