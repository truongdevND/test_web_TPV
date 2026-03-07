import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Test from "../pages/TestPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/test",
    element: <Test />,
  },
]);

export default router;
