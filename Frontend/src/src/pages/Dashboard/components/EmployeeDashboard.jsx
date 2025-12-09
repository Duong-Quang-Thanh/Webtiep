import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { RadialBarChart, RadialBar, Tooltip, ResponsiveContainer } from 'recharts';
import nhanVienApi from '../../../api/nhanVienApi';
import chamCongApi from '../../../api/chamCongApi';
import { useAuth } from '../../../contexts/AuthContext';
import { User, CreditCard, Clock, CheckCircle, AlertTriangle, DollarSign, Phone, Mail, Gift, Calendar } from 'react-feather';

const STATUS_MAP = { DUNG_GIO: 'DungGio', DI_MUON: 'DiMuon', VE_SOM: 'VeSom' };

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [myProfile, setMyProfile] = useState(null);
  
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState({ totalDays: 0, lateDays: 0, onTimeDays: 0, earlyDays: 0 });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const resProfile = await nhanVienApi.getById(user.ma_nhan_vien);
        setMyProfile(resProfile.data); 
        const currentMonth = dayjs().month() + 1;
        const currentYear = dayjs().year();
        const listCC = await chamCongApi.getByNhanVien(user.ma_nhan_vien, currentMonth, currentYear);
        
        let late = 0, onTime = 0, early = 0;
        listCC.forEach(cc => {
            if (cc.trang_thai_ca === STATUS_MAP.DUNG_GIO) onTime++;
            else if (cc.trang_thai_ca === STATUS_MAP.DI_MUON) late++;
            else if (cc.trang_thai_ca === STATUS_MAP.VE_SOM) early++;
        });

        setAttendanceStats({ totalDays: listCC.length, lateDays: late, onTimeDays: onTime, earlyDays: early });
        const chartData = [];
        if (early > 0) chartData.push({ name: 'Về sớm', value: early, fill: '#ff4d4f' });
        if (late > 0) chartData.push({ name: 'Đi muộn', value: late, fill: '#faad14' });
        if (onTime > 0) chartData.push({ name: 'Đúng giờ', value: onTime, fill: '#52c41a' });
        setAttendanceData(chartData);
      } catch (error) { console.error("Lỗi tải dữ liệu Dashboard:", error); } finally { setLoading(false); }
    };
    if (user) fetchData();
  }, [user]);

  if (loading) return <div className="flex justify-center items-center h-[50vh]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
  if (!myProfile) return null;

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER INFO */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-100 flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                <User size={36} />
            </div>
            <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800 m-0">Xin chào, {myProfile.ten_nhan_vien}!</h2>
            <div className="text-gray-500 mt-2 flex flex-wrap items-center justify-center md:justify-start gap-2 text-sm">
                <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-gray-600"><User size={12}/> {myProfile.ma_nhan_vien}</span>
                <span className="hidden md:inline text-gray-300">|</span>
                <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">{myProfile.chucVu?.ten_chuc_vu || 'Nhân viên'}</span>
            </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* CỘT TRÁI: THÔNG TIN & THỐNG KÊ  */}
            <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Card 1: Thông tin cá nhân */}
            <div className="card-custom shadow-md">
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-3 flex items-center gap-2">
                    <CreditCard size={20} className="text-primary"/> 
                    Thông Tin Cơ Bản
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="text-gray-500 block text-xs uppercase mb-1">Phòng Ban</span>
                        <span className="font-semibold text-gray-800 text-base">{myProfile.phongBan?.ten_phong || '---'}</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="text-gray-500 block text-xs uppercase mb-1">Ngày Vào Làm</span>
                        <span className="font-semibold text-gray-800 text-base">{myProfile.ngay_vao_lam ? dayjs(myProfile.ngay_vao_lam).format('DD/MM/YYYY') : '---'}</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 md:col-span-2 flex justify-between items-center">
                        <span className="text-gray-500 text-xs uppercase">Mức Lương Cơ Bản</span>
                        <span className="font-bold text-blue-600 text-lg">{myProfile.muc_luong_co_ban ? Number(myProfile.muc_luong_co_ban).toLocaleString('vi-VN') : 0} VNĐ</span>
                    </div>
                </div>
            </div>

            {/* Card 2: Thống kê chấm công */}
            <div className="card-custom flex-1 shadow-md">
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-3 flex items-center gap-2">
                    <Clock size={20} className="text-primary"/> 
                    Chấm Công Tháng {dayjs().month() + 1}
                </h3>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-full sm:w-1/2">
                        <div className="mb-6 bg-blue-50 p-4 rounded-xl text-center border border-blue-100">
                            <div className="text-gray-500 text-xs uppercase font-semibold tracking-wider">Tổng ngày đi làm</div>
                            <div className="text-4xl font-extrabold text-blue-600 mt-1">{attendanceStats.totalDays}</div>
                        </div>
                        <div className="space-y-3 pl-2">
                            <div className="flex justify-between items-center text-sm"><span className="text-green-600 font-medium flex items-center gap-2"><CheckCircle size={16}/> Đúng giờ</span><span className="font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded">{attendanceStats.onTimeDays}</span></div>
                            <div className="flex justify-between items-center text-sm"><span className="text-yellow-600 font-medium flex items-center gap-2"><AlertTriangle size={16}/> Đi muộn</span><span className="font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">{attendanceStats.lateDays}</span></div>
                            <div className="flex justify-between items-center text-sm"><span className="text-red-500 font-medium flex items-center gap-2"><Clock size={16}/> Về sớm</span><span className="font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded">{attendanceStats.earlyDays}</span></div>
                        </div>
                    </div>
                    <div className="w-full sm:w-1/2 h-[220px]">
                        {attendanceData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="100%" barSize={20} data={attendanceData}>
                                    <RadialBar minAngle={15} background={{ fill: '#f3f4f6' }} clockWise dataKey="value" cornerRadius={10}/>
                                    <Tooltip />
                                </RadialBarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-300 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <Clock size={32} className="mb-2 opacity-50"/>
                                <span className="text-sm">Chưa có dữ liệu</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            </div>

            {/* CỘT PHẢI: TRUY CẬP NHANH */}
           <div className="lg:col-span-1">
    <div className="card-custom h-full flex flex-col shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-5 border-b pb-3">Truy Cập Nhanh</h3>
        
        <div className="flex flex-col gap-4">
            
            {/* BUTTON 1: CHẤM CÔNG */}
            <button 
                onClick={() => navigate('/cham-cong')} 
                className="relative group w-full overflow-hidden rounded-xl p-[4px] focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2"
            >
                <span className="absolute inset-[-1000%] animate-[spin_1s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#fb923c_0%,#ea580c_50%,#fb923c_100%)]" />
                
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-white px-4 py-4 text-sm font-bold text-orange-700 backdrop-blur-3xl transition-all group-hover:bg-orange-50 group-hover:shadow-md">
                    <div className="p-1.5 bg-orange-50 rounded-full text-orange-600 shadow-sm border border-orange-200 group-hover:bg-white transition-colors">
                        <Calendar size={18}/>
                    </div>
                    <span>Chấm Công Ngay</span>
                </span>
            </button>

            {/* BUTTON 2: PHIẾU LƯƠNG  */}
            <button 
                onClick={() => navigate('/bao-cao')} 
                className="relative group w-full overflow-hidden rounded-xl p-[4px] focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
            >
                <span className="absolute inset-[-1000%] animate-[spin_1s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#4ade80_0%,#16a34a_50%,#4ade80_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-white px-4 py-4 text-sm font-bold text-green-700 backdrop-blur-3xl transition-all group-hover:bg-green-50 group-hover:shadow-md">
                    <div className="p-1.5 bg-green-50 rounded-full text-green-600 shadow-sm border border-green-200 group-hover:bg-white transition-colors">
                        <DollarSign size={18}/>
                    </div>
                    <span>Xem Phiếu Lương</span>
                </span>
            </button>

            {/* BUTTON 3: THƯỞNG PHẠT  */}
            <button 
                onClick={() => navigate('/thuong-phat')} 
                className="relative group w-full overflow-hidden rounded-xl p-[4px] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
                <span className="absolute inset-[-1000%] animate-[spin_1s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#60a5fa_0%,#2563eb_50%,#60a5fa_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-white px-4 py-4 text-sm font-bold text-blue-700 backdrop-blur-3xl transition-all group-hover:bg-blue-50 group-hover:shadow-md">
                    <div className="p-1.5 bg-blue-50 rounded-full text-blue-600 shadow-sm border border-blue-200 group-hover:bg-white transition-colors">
                        <Gift size={18}/>
                    </div>
                    <span>Xem Thưởng / Phạt</span>
                </span>
            </button>

        </div>

        <div className="mt-auto border-t border-gray-100 pt-5 text-center sm:text-left">
            <span className="text-xs font-bold text-gray-400 uppercase block mb-3">Hỗ trợ nhân viên</span>
            <div className="space-y-2">
                <p className="text-gray-600 text-sm flex items-center gap-3 justify-center sm:justify-start hover:text-blue-600 transition-colors cursor-pointer">
                    <span className="p-1.5 bg-gray-100 rounded-full"><Phone size={14}/></span> 
                    <span className="font-medium">1900 1234</span>
                </p>
                <p className="text-gray-600 text-sm flex items-center gap-3 justify-center sm:justify-start hover:text-blue-600 transition-colors cursor-pointer">
                    <span className="p-1.5 bg-gray-100 rounded-full"><Mail size={14}/></span> 
                    <span className="font-medium">hr@company.com</span>
                </p>
            </div>
        </div>
    </div>
</div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;