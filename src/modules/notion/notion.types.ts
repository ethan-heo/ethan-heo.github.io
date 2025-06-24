import type { DatabaseObjectResponse } from "@notionhq/client";

type MatchByTypeProp<T, V> = T extends { [P in "type"]: V } ? T : never;

type Properties = DatabaseObjectResponse["properties"][string];

export interface DatabaseResultProperties {
    [key: string]: Properties;
    created: MatchByTypeProp<Properties, "created_time">;
    category: MatchByTypeProp<Properties, "multi_select">;
    description: MatchByTypeProp<Properties, "rich_text">;
    related: MatchByTypeProp<Properties, "relation">;
    readTime: MatchByTypeProp<Properties, "rich_text">;
}

export type DatabaseResultCover = Exclude<
    DatabaseObjectResponse["cover"],
    null
>;
