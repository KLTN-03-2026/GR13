import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App";
import { AuthProvider } from './context/AuthContext';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID_HERE">
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </QueryClientProvider>,
);
