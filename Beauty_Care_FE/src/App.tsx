import { RouterProvider } from "react-router-dom";
import router from "./routers/router";
import { App as AntdApp } from "antd";
import ChatboxAI from "./layouts/ChatboxAI";
import { SocketProvider } from "./contexts/SocketContext";

const App = () => {
  return (
    <SocketProvider>
      <AntdApp>
        <RouterProvider router={router} />
        <ChatboxAI />
      </AntdApp>
    </SocketProvider>
  );
};

export default App;
