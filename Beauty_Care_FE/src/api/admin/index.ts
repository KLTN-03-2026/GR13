import { API } from "../config";

export interface IResponse<T = unknown> {
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

export type AnalyticsStats = {
  productInteractions: { name: string; clicks: number; adds: number }[];
  priceRangeData: { range: string; many: number; little: number; none: number }[];
  peakHoursData: { hour: string; orders: number }[];
  trendingFavorites: { name: string; likes: number }[];
  spaServicesStats: { name: string; value: number }[];
  topStaffs: { key: string; name: string; specialty: string; rating: number; reviews: number }[];
  revenueData: { name: string; revenue: number; orders: number }[];
  categoryData: { name: string; value: number }[];
  topProducts: { key: string; name: string; category: string; sales: number; stock: number; revenue: string; status: string; rawSales: number }[];
  potentialCustomers: { key: string; name: string; orders: number; totalSpent: string; lastOrder: string; level: string; rawSpent: number }[];
  importExportData: {
    week: { name: string; import: number; export: number }[];
    month: { name: string; import: number; export: number }[];
    year: { name: string; import: number; export: number }[];
    custom: { name: string; import: number; export: number }[];
  };
};

export const getAnalyticsStatsAPI = async (): Promise<IResponse<AnalyticsStats>> => {
  const { data } = await API.get("/admin/analytics");
  return data;
};

