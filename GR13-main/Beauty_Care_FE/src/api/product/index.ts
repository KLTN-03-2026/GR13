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

export interface ICategory {
  id: number;
  name: string;
  description?: string | null;
  image?: string | null;
  status: "active" | "inactive";
  productsCount?: number;
  soldQty?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IProduct {
  id: number;
  name: string;
  description: string;
  usage?: string | null;
  price: number;
  discountPrice?: number | null;
  image: string;
  images?: string | null;
  stock: number;
  categoryId: number;
  brand?: string | null;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
  categoryData?: {
    name: string;
  };
}

export const getProductsAPI = async (
  params?: any
): Promise<IResponse<IProduct[]>> => {
  const { data } = await API.get("/product", { params });
  return data;
};

export const getProductByIdAPI = async (
  id: number
): Promise<IResponse<IProduct>> => {
  const { data } = await API.get(`/product/${id}`);
  return data;
};

export const createProductAPI = async (
  payload: Partial<IProduct>
): Promise<IResponse<IProduct>> => {
  const { data } = await API.post("/product", payload);
  return data;
};

export const updateProductAPI = async (
  payload: Partial<IProduct> & { id: number }
): Promise<IResponse<IProduct>> => {
  const { id, ...rest } = payload;
  const { data } = await API.put(`/product/${id}`, rest);
  return data;
};

export const deleteProductAPI = async (
  id: number
): Promise<IResponse<null>> => {
  const { data } = await API.delete(`/product/${id}`);
  return data;
};

export const getAllCategoriesAPI = async (): Promise<
  IResponse<ICategory[]>
> => {
  const { data } = await API.get("/product/categories");
  return data;
};

export const createCategoryAPI = async (
  payload: Partial<ICategory>
): Promise<IResponse<ICategory>> => {
  const { data } = await API.post("/product/categories", payload);
  return data;
};

export const updateCategoryAPI = async (
  payload: Partial<ICategory> & { id: number }
): Promise<IResponse<ICategory>> => {
  const { id, ...rest } = payload;
  const { data } = await API.put(`/product/categories/${id}`, rest);
  return data;
};

export const deleteCategoryAPI = async (
  id: number
): Promise<IResponse<null>> => {
  const { data } = await API.delete(`/product/categories/${id}`);
  return data;
};
