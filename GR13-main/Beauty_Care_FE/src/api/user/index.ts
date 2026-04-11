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

export interface IUser {
  id?: number;
  Email?: string;
  Phone?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string | null;
  img?: string | null;
  role_code?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getAllUsersAPI = async (): Promise<IResponse<IUser[]>> => {
  const { data } = await API.get("/user/all");
  return data;
};

export const createUserAPI = async (
  payload: {
    email: string;
    phone: string;
    password: string;
    firstName: string;
    lastName: string;
    role: "admin" | "staff" | "customer";
    avatar?: string | null;
  }
): Promise<IResponse<IUser>> => {
  const { data } = await API.post("/user/create", {
    ...payload,
    Email: payload.email,
    Phone: payload.phone,
  });
  return data;
};

export const updateUserByAdminAPI = async (
  payload: {
    id: number;
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    role?: "admin" | "staff" | "customer";
    avatar?: string | null;
  }
): Promise<IResponse<IUser>> => {
  const { id, ...rest } = payload;
  const { data } = await API.put(`/user/update-admin/${id}`, {
    ...rest,
    Email: rest.email,
    Phone: rest.phone,
  });
  return data;
};

export const deleteUserAPI = async (id: number): Promise<IResponse<null>> => {
  const { data } = await API.delete("/user/delete", { params: { id } });
  return data;
};
