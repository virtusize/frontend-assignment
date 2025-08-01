import { Routes, Route, Outlet } from "react-router-dom";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFound";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/shared/ProtectedRoute";
import { ROUTES } from "../lib/constants";

const AppRoutes = () => (
  <Routes>
    <Route path={ROUTES.HOME} element={<HomePage />} />

    <Route
      path={ROUTES.DASHBOARD}
      element={
        <ProtectedRoute>
          <Outlet />
        </ProtectedRoute>
      }
    >
      <Route index element={<Dashboard />} />
    </Route>

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;
