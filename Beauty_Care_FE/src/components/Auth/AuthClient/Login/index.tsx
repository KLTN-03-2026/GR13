import "./style.scss";
import {
  InputCommonEmail,
  InputCommonPassword,
} from "../../../Common/InputCommon";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../hooks/useAuth";
import { message } from "antd";
import { useGoogleLogin } from "@react-oauth/google";

interface FormErrors {
  email?: string;
  password?: string;
} 

const LoginComponent = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const { loginUser, loginGoogle } = useAuth();
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsPending(true);
        await loginGoogle(tokenResponse.access_token);
        message.success("Đăng nhập bằng Google thành công");
        navigate("/");
      } catch (err: any) {
        message.error(err.message || "Đăng nhập Google thất bại");
      } finally {
        setIsPending(false);
      }
    },
    onError: () => message.error("Đăng nhập Google thất bại"),
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    }
    return newErrors;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      (async () => {
        try {
          setIsPending(true);
          await loginUser(formData.email, formData.password);
          message.success("Đăng nhập thành công");
          navigate("/");
        } catch (err: any) {
          message.error(err.message || "Đăng nhập thất bại");
        } finally {
          setIsPending(false);
        }
      })();
    }
  };

  return (
    <div className="auth-form-wrapper">
      <div className="auth-title">
        <h1>Đăng nhập</h1>
        <p>Chào mừng bạn quay trở lại với BeautyCare!</p>
      </div>

      <div className="auth-form-content">
        <form className="form-main" onSubmit={handleSubmit}>
          <InputCommonEmail
            label="Email"
            id="email"
            name="email"
            placeholder=" "
            value={formData.email}
onChange={handleChange}
            isError={!!errors.email}
            messageError={errors.email}
          />

          <InputCommonPassword
            label="Mật khẩu"
            id="password"
            name="password"
            placeholder=" "
            value={formData.password}
            onChange={handleChange}
            isError={!!errors.password}
            messageError={errors.password}
          />

          <div className="forgot-password">
            <Link to="/forgot">Quên mật khẩu?</Link>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-submit"
              disabled={isPending}
              style={{ opacity: isPending ? 0.7 : 1 }}
            >
              {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </div>

          <div className="divider">
          </div>
            <p className="txt-divider" style={{textAlign: 'center',fontSize: '14px',color: '#999',marginTop: '20px',marginBottom: '20px'}}>  Hoặc tiếp tục với Google</p>
          <button 
            type="button" 
            className="googleBtn" 
            style={{ width: '100%'}}
            onClick={() => googleLogin()}
            disabled={isPending}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" width="18" style={{marginRight: '10px',marginBottom:"-5px"}}/>
            Đăng nhập với Google
          </button>

          <div className="auth-footer">
            <p>
              Bạn chưa có tài khoản?{" "}
              <Link to="/register" className="link-register">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginComponent;