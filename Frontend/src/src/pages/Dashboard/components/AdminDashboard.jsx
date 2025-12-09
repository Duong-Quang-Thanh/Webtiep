import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { RefreshCw } from 'react-feather'; 
import nhanVienApi from '../../../api/nhanVienApi';
import phongBanApi from '../../../api/phongBanApi';
import chucVuApi from '../../../api/chucVuApi';
import GeneralStats from './charts/GeneralStats';
import AttendanceChart from './charts/AttendanceChart';
import SalaryChart from './charts/SalaryChart';
import StructureChart from './charts/StructureChart';
import RecruitmentChart from './charts/RecruitmentChart';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);

  // State dữ liệu tổng
  const [stats, setStats] = useState({ totalNhanVien: 0, totalPhongBan: 0, totalChucVu: 0, totalSalary: 0 });
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [areaData, setAreaData] = useState([]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [resNV, resPB, resCV] = await Promise.all([
          nhanVienApi.getAll().catch((err) => { console.error("Lỗi tải nhân viên:", err); return []; }),
          phongBanApi.getAll().catch((err) => { console.error("Lỗi tải phòng ban:", err); return []; }),
          chucVuApi.getAll().catch((err) => { console.error("Lỗi tải chức vụ:", err); return []; })
      ]);

      const listNV = Array.isArray(resNV) ? resNV : (resNV?.data || []);
      const listPB = Array.isArray(resPB) ? resPB : (resPB?.data || []);
      const listCV = Array.isArray(resCV) ? resCV : (resCV?.data || []);

      // 1. Tính toán thống kê tổng
      const totalSalary = listNV.reduce((sum, nv) => sum + parseFloat(nv.muc_luong_co_ban || 0), 0);
      setStats({
        totalNhanVien: listNV.length,
        totalPhongBan: listPB.length,
        totalChucVu: listCV.length,
        totalSalary: totalSalary, 
      });

      // 2. Xử lý dữ liệu Lương & Cơ cấu
      const deptStats = {}; 
      listNV.forEach(nv => {
        const tenPhong = nv.phongBan?.ten_phong || 'Chưa phân bổ';
        const luong = parseFloat(nv.muc_luong_co_ban || 0);

        if (!deptStats[tenPhong]) {
            deptStats[tenPhong] = { count: 0, totalSalary: 0 };
        }
        deptStats[tenPhong].count += 1;
        deptStats[tenPhong].totalSalary += luong;
      });

      setPieData(Object.keys(deptStats).map(key => ({ name: key, value: deptStats[key].count })));
      setBarData(Object.keys(deptStats).map(key => ({ name: key, quyLuong: deptStats[key].totalSalary })));

      // 3. Xử lý dữ liệu Tuyển dụng
      const currentYear = dayjs().year();
      const recruitmentByMonth = Array(12).fill(0);
      listNV.forEach(nv => {
        if (nv.ngay_vao_lam) {
            const dateVao = dayjs(nv.ngay_vao_lam);
            if (dateVao.year() === currentYear) {
              recruitmentByMonth[dateVao.month()] += 1;
            }
        }
      });
      setAreaData(recruitmentByMonth.map((count, index) => ({ name: `T${index + 1}`, TuyenMoi: count })));

    } catch (error) {
      console.error("Lỗi tải dữ liệu Dashboard Admin:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (loading) return (
    <div className="h-[80vh] flex flex-col justify-center items-center gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <span className="text-gray-500 font-medium">Đang tải dữ liệu tổng hợp...</span>
    </div>
  );

  return (
    <div className="pb-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      {/* Header Dashboard */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 mt-6 gap-4">
        <div>
            <h2 className="text-3xl font-bold text-gray-900 m-0">Dashboard Quản Trị</h2>
            <span className="text-gray-500 mt-1 block">Tổng quan tình hình nhân sự và hoạt động</span>
        </div>
        <button 
            onClick={fetchAdminData} 
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 font-medium flex items-center gap-2 transition-all"
        >
            <RefreshCw size={16} /> Làm mới
        </button>
      </div>

      {/* 1. Thống kê tổng quan (General Stats) */}
      <GeneralStats stats={stats} />

      {/* 2. CẤU TRÚC BIỂU ĐỒ CHÍNH - */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6"> 
        
        {/* HÀNG 1: BIỂU ĐỒ LƯƠNG */}
        <div className="lg:col-span-5">
            <SalaryChart data={barData} />
        </div>

        {/* HÀNG 2: NHÂN SỰ  + CHUYÊN CẦN  */}
        <div className="lg:col-span-3 h-full">
            <StructureChart data={pieData} />
        </div>
        
        <div className="lg:col-span-2 h-full">
            <AttendanceChart />
        </div>

        {/*HÀNG 3: TUYỂN DỤNG  */}
        <div className="lg:col-span-5">
            <RecruitmentChart data={areaData} />
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;