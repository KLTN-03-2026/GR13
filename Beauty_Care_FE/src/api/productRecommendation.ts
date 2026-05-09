import { API } from "./config";

export interface IRecommendation {
  id: number;
  title: string;
  description: string;
  morning_routine: string | null;
  evening_routine: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IResponse<T = any> {
  err: number;
  mess: string;
  data: T;
}

export const getAllRecommendationsAPI = async (): Promise<IResponse<IRecommendation[]>> => {
  const { data } = await API.get("/product-recommendation/all");
  return data;
};

export const createRecommendationAPI = async (payload: Partial<IRecommendation>): Promise<IResponse<IRecommendation>> => {
  const { data } = await API.post("/product-recommendation", payload);
  return data;
};

export const updateRecommendationAPI = async (payload: Partial<IRecommendation> & { id: number }): Promise<IResponse<IRecommendation>> => {
  const { id, ...rest } = payload;
  const { data } = await API.put(`/product-recommendation/${id}`, rest);
  return data;
};

export const deleteRecommendationAPI = async (id: number): Promise<IResponse<null>> => {
  const { data } = await API.delete(`/product-recommendation/${id}`);
  return data;
};
