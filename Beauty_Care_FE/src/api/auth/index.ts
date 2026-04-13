import { API } from "../config";

export interface IResponse<T = any> {
  err: number;
  mess: string;
  data?: T;
}

export type AuthUser = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role_code: string;
  avatar: string | null;
};

export type LoginResponse = {
  err: number;
  mess: string;
  accessToken?: string;
  user?: AuthUser;
};

export const loginAPI = async (payload: {
  email: string;
  password: string;
}): Promise<LoginResponse> => {
  const { data } = await API.post("/auth/login", {
    account: payload.email,
    password: payload.password,
  });
  return data;
};

