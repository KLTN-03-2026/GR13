import { API } from "./config";

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

export interface IDiscount {
  id: number;
  name: string;
  code: string;
  description: string | null;
  discountValue: number;
  discountType: "percentage" | "fixed";
  minOrderValue: number;
  maxDiscountValue: number | null;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  userUsageLimit: number;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

export const getDiscountsAPI = async (): Promise<IResponse<IDiscount[]>> => {
  const { data } = await API.get("/discount");
  return data;
};

export const createDiscountAPI = async (
  payload: Partial<IDiscount>
): Promise<IResponse<IDiscount>> => {
  const { data } = await API.post("/discount", payload);
  return data;
};

export const updateDiscountAPI = async (
  payload: Partial<IDiscount> & { id: number }
): Promise<IResponse<IDiscount>> => {
  const { id, ...rest } = payload;
  const { data } = await API.put(`/discount/${id}`, rest);
  return data;
};

export const deleteDiscountAPI = async (id: number): Promise<IResponse<null>> => {
  const { data } = await API.delete(`/discount/${id}`);
  return data;
};

export const checkDiscountAPI = async (code: string): Promise<IResponse<IDiscount>> => {
  const { data } = await API.get(`/discount/check/${code}`);
  return data;
};
