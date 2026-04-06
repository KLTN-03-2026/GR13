import { RouterProvider } from "react-router-dom";
import router from "./routers/router";
import { App as AntdApp } from "antd";

const App = () => {
  return (
    <AntdApp>
      <RouterProvider router={router} />
    </AntdApp>
  );
};

export default App;
