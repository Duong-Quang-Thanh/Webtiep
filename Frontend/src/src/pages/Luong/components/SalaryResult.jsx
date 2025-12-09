import React from 'react';
import { DollarSign, User, Calendar, Clock } from 'react-feather';

const SalaryResult = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg border-t-4 border-t-green-500 overflow-hidden mt-6 max-w-2xl mx-auto animate-enter">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
        <div className="bg-green-100 p-2 rounded-full text-green-600">
            <DollarSign size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-800">PHIẾU LƯƠNG CHI TIẾT</h3>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-4">
            
            {/* Row 1: Nhân viên */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-gray-500 font-medium flex items-center gap-2">
                    <User size={16} /> Nhân Viên
                </span>
                <span className="bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1 rounded-full">
                    {data.ma_nhan_vien} - {data.ten_nhan_vien || 'N/A'}
                </span>
            </div>

            {/* Row 2: Kỳ lương */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-gray-500 font-medium flex items-center gap-2">
                    <Calendar size={16} /> Kỳ Lương
                </span>
                <span className="font-semibold text-gray-800">
                    Tháng {data.thang} / Năm {data.nam}
                </span>
            </div>

            {/* Row 3: Giờ làm */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-gray-500 font-medium flex items-center gap-2">
                    <Clock size={16} /> Tổng Giờ Làm
                </span>
                <span className="font-bold text-gray-800">
                    {data.tong_gio_lam} giờ
                </span>
            </div>

            {/* Row 4: Lương cơ bản */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-gray-500 font-medium">Lương Cơ Bản</span>
                <span className="font-mono text-gray-700">
                    {Number(data.luong_co_ban).toLocaleString('vi-VN')} VNĐ
                </span>
            </div>

            {/* Row 5: Lương OT */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-gray-500 font-medium">Lương Làm Thêm (OT)</span>
                <span className="font-mono text-gray-700">
                    {Number(data.luong_them_gio).toLocaleString('vi-VN')} VNĐ
                </span>
            </div>

            {/* Total Row */}
            <div className="flex justify-between items-center pt-2 mt-4 bg-green-50 p-4 rounded-lg border border-green-100">
                <span className="text-green-800 font-bold uppercase text-sm">Tổng Thực Nhận</span>
                <span className="text-2xl font-extrabold text-red-600">
                    {Number(data.tong_luong).toLocaleString('vi-VN')} <span className="text-sm font-medium text-red-400">VNĐ</span>
                </span>
            </div>

        </div>
      </div>
    </div>
  );
};

export default SalaryResult;