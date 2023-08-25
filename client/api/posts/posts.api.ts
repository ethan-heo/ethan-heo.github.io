import { AxiosInstance } from "axios";

import { PostApi } from "./posts.types";

export const getPostApi = (axiosInstance: AxiosInstance): PostApi => ({
  getPosts: async (params) => {
    return (await axiosInstance.get("/posts", { params })).data;
  },
});
