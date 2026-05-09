import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/productRecommendation";

export const useGetRecommendations = () => {
  return useQuery({
    queryKey: ["productRecommendations"],
    queryFn: () => api.getAllRecommendationsAPI(),
  });
};

export const useCreateRecommendation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<api.IRecommendation>) => api.createRecommendationAPI(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productRecommendations"] });
    },
  });
};

export const useUpdateRecommendation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<api.IRecommendation> & { id: number }) =>
      api.updateRecommendationAPI(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productRecommendations"] });
    },
  });
};

export const useDeleteRecommendation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.deleteRecommendationAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productRecommendations"] });
    },
  });
};
