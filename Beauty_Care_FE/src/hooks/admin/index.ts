import { useQuery } from "@tanstack/react-query";
import * as adminApi from "../../api/admin/index";

export const useGetDashboardStats = () => {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: adminApi.getDashboardStatsAPI,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
};

export const useGetAnalyticsStats = () => {
  return useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: adminApi.getAnalyticsStatsAPI,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
};

