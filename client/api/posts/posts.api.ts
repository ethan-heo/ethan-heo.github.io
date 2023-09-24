import { AxiosInstance } from "axios";

import { PostApi } from "./posts.types";

export const getPostApi = (axiosInstance: AxiosInstance): PostApi => ({
  getPosts: async (params) => {
    return (await axiosInstance.get("/posts", { params })).data;
  },
  searchPosts: async (params) => {
    return (await axiosInstance.get("/search", { params })).data;
  },
  getPost: async (params) => {
    return (await axiosInstance.get("/post", { params })).data;
  },
});
