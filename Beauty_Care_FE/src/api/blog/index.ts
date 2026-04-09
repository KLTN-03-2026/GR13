import { API } from "../config";

export interface IResponse<T = any> {
  err: number;
  mess: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface IBlog {
  id: number;
  title: string;
  slug: string;
  desc: string;
  content: string;
  image?: string | null;
  category?: string | null;
  blog_category_id?: number | null;
  status: "draft" | "published" | "archived";
  views: number;
  author_id?: number | null;
  createdAt?: string;
  updatedAt?: string;
  authorData?: {
    firstName: string;
    lastName: string;
    Email: string;
  };
  blogCategoryData?: {
    name: string;
  };
}

export interface IBlogPagination {
  items: IBlog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const getBlogsAPI = async (params?: any): Promise<IResponse<IBlogPagination>> => {
  const { data } = await API.get("/blog/all", { params });
  return data;
};

export const getBlogByIdAPI = async (id: number): Promise<IResponse<IBlog>> => {
  const { data } = await API.get(`/blog/${id}`);
  return data;
};

export const createBlogAPI = async (
  payload: Partial<IBlog>
): Promise<IResponse<IBlog>> => {
  const { data } = await API.post("/blog/create", payload);
  return data;
};

export const updateBlogAPI = async (
  payload: Partial<IBlog> & { id: number }
): Promise<IResponse<IBlog>> => {
  const { id, ...rest } = payload;
  const { data } = await API.put(`/blog/update/${id}`, rest);
  return data;
};

export const deleteBlogAPI = async (
  id: number
): Promise<IResponse<null>> => {
  const { data } = await API.delete(`/blog/delete/${id}`);
  return data;
};

export interface IBlogCategory {
  id: number;
  name: string;
  description?: string | null;
  status: "active" | "inactive";
  blogsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const getBlogCategoriesAPI = async (): Promise<IResponse<IBlogCategory[]>> => {
  const { data } = await API.get("/blog-category/all");
  return data;
};

export const createBlogCategoryAPI = async (
  payload: Partial<IBlogCategory>
): Promise<IResponse<IBlogCategory>> => {
  const { data } = await API.post("/blog-category/create", payload);
  return data;
};

export const updateBlogCategoryAPI = async (
  payload: Partial<IBlogCategory> & { id: number }
): Promise<IResponse<IBlogCategory>> => {
  const { id, ...rest } = payload;
  const { data } = await API.put(`/blog-category/update/${id}`, rest);
  return data;
};

export const deleteBlogCategoryAPI = async (
  id: number
): Promise<IResponse<null>> => {
  const { data } = await API.delete(`/blog-category/delete/${id}`);
  return data;
};
