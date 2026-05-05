import { RouterProvider } from "react-router-dom";
import router from "./routers/router";
import { App as AntdApp } from "antd";
import { SocketProvider } from "./contexts/SocketContext";

const App = () => {
  return (
    <SocketProvider>
      <AntdApp>
        <RouterProvider router={router} />
      </AntdApp>
    </SocketProvider>
  );
};

export default App;
