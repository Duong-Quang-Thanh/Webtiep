import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/Auth/LoginPage';
import PrivateRoute from './routes/PrivateRoute';
import DashboardPage from './pages/Dashboard/DashboardPage';
import PhongBanPage from './pages/PhongBan/PhongBanPage';
import ChucVuPage from './pages/ChucVu/ChucVuPage';
import NhanVienPage from './pages/NhanVien/NhanVienPage'; 
import TinhLuongPage from './pages/Luong/TinhLuongPage';
import BaoCaoThuNhap from './pages/BaoCao/BaoCaoThuNhap';
import ChamCongPage from './pages/ChamCong/ChamCongPage';
import DanhSachChamCongPage from './pages/ChamCong/DanhSachChamCongPage';
import ComingSoonPage from './pages/ComingSoon/ComingSoonPage';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
            {/* Quản lý tổ chức  */}
            <Route path="phong-ban" element={<PhongBanPage />} />
            <Route path="chuc-vu" element={<ChucVuPage />} />
            <Route path="nhan-vien" element={<NhanVienPage />} />

            {/* Quản lý lương */}
            <Route path="tinh-luong" element={<TinhLuongPage />} />
            <Route path="bao-cao" element={<BaoCaoThuNhap />} />
            <Route path="cham-cong" element={<ChamCongPage />} />
            <Route path="danh-sach-cham-cong" element={<DanhSachChamCongPage />} />

            {/* Nghiệp vụ khác  */}
            <Route path="nghi-phep" element={<ComingSoonPage title="Quản Lý Nghỉ Phép" />} />
            <Route path="thuong-phat" element={<ComingSoonPage title="Khen Thưởng & Kỷ Luật" />} />

            {/* Hệ thống ADMIN */}
            <Route path="tai-khoan" element={<ComingSoonPage title="Quản Lý Tài Khoản Hệ Thống" />} />
            <Route path="cai-dat" element={<ComingSoonPage title="Cấu Hình Hệ Thống" />} />
            <Route path="nhat-ky" element={<ComingSoonPage title="Nhật Ký Hoạt Động " />} />

            {/* TIỆN ÍCH CÁ NHÂN*/}
            <Route path="thuong-phat" element={<ComingSoonPage title="Khen Thưởng & Kỷ Luật" />} />
            <Route path="khao-sat" element={<ComingSoonPage title="Hệ Thống Khảo Sát & Phản Hồi" />} />
            <Route path="tien-ich" element={<ComingSoonPage title="Các Tiện Ích Mở Rộng" />} />



          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;