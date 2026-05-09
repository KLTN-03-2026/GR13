import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as discountApi from "../api/discount";

export const useGetDiscounts = () => {
  return useQuery({
    queryKey: ["discounts"],
    queryFn: discountApi.getDiscountsAPI,
  });
};

export const useCreateDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: discountApi.createDiscountAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
    },
  });
};

export const useUpdateDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: discountApi.updateDiscountAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
    },
  });
};

export const useDeleteDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => discountApi.deleteDiscountAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
    },
  });
};
