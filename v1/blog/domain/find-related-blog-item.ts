import type { BlogItem } from "./interfaces/model.interface";

const findRelatedBlogItems = (blogIds: string[], blogItems: BlogItem[]) => {
    return blogItems.filter((blogItem) => blogIds.includes(blogItem.id));
};

export default findRelatedBlogItems;
