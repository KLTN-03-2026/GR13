import { Navigate, useLocation } from "react-router-dom";

const RequireAdminAuth = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");
  let role: string | null = null;
  try {
    role = userRaw ? JSON.parse(userRaw)?.role_code ?? null : null;
  } catch {
    role = null;  
  }

  const ok = !!token && (role === "R1" || role === "R2");
  if (!ok) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/auth-admin/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default RequireAdminAuth;

