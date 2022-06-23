import { MainPage } from "../pages/main";
import { LoginPage } from "../pages/login";

import { HashRouter, Route, Routes } from "react-router-dom";

export const routes = [
  {
    path: "/",
    element: <LoginPage></LoginPage>,
  },
  {
    path: "/main",
    element: <MainPage></MainPage>,
  },
];

export const RouteContainer = () => (
  <HashRouter>
    <Routes>
      {routes.map((item) => (
        <Route key={item.path} path={item.path} element={item.element}></Route>
      ))}
    </Routes>
  </HashRouter>
);
