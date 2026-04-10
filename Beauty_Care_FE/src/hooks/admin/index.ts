import { useQuery } from "@tanstack/react-query";
import * as adminApi from "../../api/admin";

export const useGetDashboardStats = () => {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: adminApi.getDashboardStatsAPI,
  });
};

