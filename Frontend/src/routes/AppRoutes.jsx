import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import MainLayout from "../components/layout/MainLayout";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import LoginPage from "../pages/Auth/LoginPage";
import NotFoundPage from "../pages/NotFound/NotFoundPage";
import DanhSachChamCongPage from "../pages/ChamCong/DanhSachChamCongPage";
import ChamCongPage from "../pages/ChamCong/ChamCongPage";

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/cham-cong" element={<ChamCongPage />} />
      <Route path="/danh-sach-cham-cong" element={<DanhSachChamCongPage />} />
      {/* Thêm các route khác */}
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;