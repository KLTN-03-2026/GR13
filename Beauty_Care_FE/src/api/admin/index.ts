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

export type DashboardStats = {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalBookings: number;
  ordersByStatus: {
    pending: number;
    paid: number;
    shipping: number;
    completed: number;
    cancelled: number;
  };
  totalRevenue: string;
};

export const getDashboardStatsAPI = async (): Promise<IResponse<DashboardStats>> => {
  const { data } = await API.get("/admin/dashboard");
  return data;
};

