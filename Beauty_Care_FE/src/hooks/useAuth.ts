import { useAuth as _useAuth } from "../context/AuthContext";

// Re-export so components that import '../../../hooks/useAuth.ts' work fine
export const useAuth = _useAuth;

export default useAuth;
