import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as blogApi from "../../api/blog";

export const useGetBlogs = (params?: any) => {
  return useQuery({
    queryKey: ["blogs", params],
    queryFn: () => blogApi.getBlogsAPI(params),
  });
};

export const useGetBlogById = (id: number) => {
  return useQuery({
    queryKey: ["blogs", id],
    queryFn: () => blogApi.getBlogByIdAPI(id),
    enabled: !!id,
  });
};

export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: blogApi.createBlogAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: blogApi.updateBlogAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => blogApi.deleteBlogAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};

export const useGetBlogCategories = () => {
  return useQuery({
    queryKey: ["blog-categories"],
    queryFn: blogApi.getBlogCategoriesAPI,
  });
};

export const useCreateBlogCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: blogApi.createBlogCategoryAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
    },
  });
};

export const useUpdateBlogCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: blogApi.updateBlogCategoryAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
    },
  });
};

export const useDeleteBlogCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => blogApi.deleteBlogCategoryAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
    },
  });
};
