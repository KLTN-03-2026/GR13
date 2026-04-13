import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import * as authApi from "../../api/auth";

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.loginAPI,
    onSuccess: (res) => {
      if (res?.err) {
        message.error(res?.mess || "Đăng nhập thất bại");
        return;
      }

      const user = res?.user;
      const role = user?.role_code;
      if (role !== "R1" && role !== "R2") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        message.error("Tài khoản không có quyền truy cập quản trị");
        return;
      }

      const token = res?.accessToken;
      if (token) localStorage.setItem("token", token);
      if (user) localStorage.setItem("user", JSON.stringify(user));

      message.success("Đăng nhập thành công");
      navigate("/admin/dashboard");
    },
    onError: () => {
      message.error("Đăng nhập thất bại");
    },
  });
};

export const useLoginAdmin = useLogin;
