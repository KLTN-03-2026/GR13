import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as userApi from "../../api/user";

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: userApi.getAllUsersAPI,
  });
};

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: ["user", "current"],
    queryFn: userApi.getCurrentUserAPI,
  });
};

export const useUpdateCurrentUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.updateCurrentUserAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "current"] });
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.createUserAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.updateUserByAdminAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => userApi.deleteUserAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
