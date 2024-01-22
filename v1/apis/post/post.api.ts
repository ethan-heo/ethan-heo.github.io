import { AxiosInstance } from "axios"

import { PostApi } from "./post.interface"

export const getPostApi = (axiosInstance: AxiosInstance): PostApi => ({
  getPosts: async (params) => {
    return (await axiosInstance.get("/posts", { params })).data
  },
  getPost: async (params) => {
    return (await axiosInstance.get("/post", { params })).data
  },
})
