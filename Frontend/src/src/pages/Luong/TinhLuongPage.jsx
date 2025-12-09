import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import luongApi from '../../api/luongApi';
import nhanVienApi from '../../api/nhanVienApi';
import phongBanApi from '../../api/phongBanApi';
import chucVuApi from '../../api/chucVuApi';
import SalaryFilter from './components/SalaryFilter';
import SalaryResult from './components/SalaryResult';
import { Users } from 'react-feather';

const TinhLuongPage = () => {
  const [loading, setLoading] = useState(false);
  const [calcLoading, setCalcLoading] = useState(false);
  const [ketQua, setKetQua] = useState(null);

  const [listNhanVien, setListNhanVien] = useState([]);
  const [filteredNhanVien, setFilteredNhanVien] = useState([]);
  const [listPhongBan, setListPhongBan] = useState([]);
  const [listChucVu, setListChucVu] = useState([]);

  const [selectedPhong, setSelectedPhong] = useState(undefined);
  const [selectedChucVu, setSelectedChucVu] = useState(undefined);
  const [targetMaNV, setTargetMaNV] = useState(undefined);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());

  useEffect(() => {
    const fetchCatalogs = async () => {
      setLoading(true);
      try {
        const [resNV, resPB, resCV] = await Promise.all([
          nhanVienApi.getAll(), phongBanApi.getAll(), chucVuApi.getAll()
        ]);
        setListNhanVien(Array.isArray(resNV) ? resNV : []);
        setFilteredNhanVien(Array.isArray(resNV) ? resNV : []);
        setListPhongBan(Array.isArray(resPB) ? resPB : []);
        setListChucVu(Array.isArray(resCV) ? resCV : []);
      } catch (error) { console.error("Lỗi tải dữ liệu:", error); } finally { setLoading(false); }
    };
    fetchCatalogs();
  }, []);

  useEffect(() => {
    let result = listNhanVien;
    if (selectedPhong) result = result.filter(nv => nv.ma_phong === selectedPhong);
    if (selectedChucVu) result = result.filter(nv => nv.ma_chuc_vu === selectedChucVu);
    setFilteredNhanVien(result);
    if (targetMaNV && !result.find(nv => nv.ma_nhan_vien === targetMaNV)) setTargetMaNV(undefined);
  }, [selectedPhong, selectedChucVu, listNhanVien]);

  const generateSuccessMessage = (count) => {
      const tenPhong = listPhongBan.find(p => p.ma_phong === selectedPhong)?.ten_phong;
      const tenChucVu = listChucVu.find(c => c.ma_chuc_vu === selectedChucVu)?.ten_chuc_vu;
      if (selectedPhong && selectedChucVu) return `Hoàn tất! Đã tính lương cho ${count} ${tenChucVu} thuộc ${tenPhong}.`;
      if (selectedPhong) return `Hoàn tất! Đã tính lương cho ${count} nhân viên thuộc ${tenPhong}.`;
      if (selectedChucVu) return `Hoàn tất! Đã tính lương cho ${count} nhân viên giữ chức vụ ${tenChucVu}.`;
      return `Hoàn tất! Đã tính lương cho toàn bộ công ty (${count} nhân viên).`;
  };

  const handleCalculate = async () => {
    setCalcLoading(true);
    setKetQua(null);
    try {
      const payload = {
        ma_nhan_vien: targetMaNV, 
        ma_phong: selectedPhong,      
        ma_chuc_vu: selectedChucVu,   
        thang: selectedMonth.month() + 1,
        nam: selectedMonth.year()
      };

      const res = await luongApi.tinhLuong(payload);
      const responseData = res.data;

      if (responseData.isBatch || (!targetMaNV && Array.isArray(responseData.data))) {
          setKetQua(responseData.data);
          const msg = generateSuccessMessage(responseData.data.length); 
          alert(msg);
      } else {
          alert(`Đã cập nhật lương cho nhân viên ${targetMaNV}`);
          if (responseData.data) setKetQua(responseData.data); 
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi khi tính lương');
    } finally {
      setCalcLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-[50vh]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;

  return (
    <div className="w-full px-4 md:px-6 pb-20">
      
      <SalaryFilter 
        listPhongBan={listPhongBan} listChucVu={listChucVu} filteredNhanVien={filteredNhanVien}
        selectedPhong={selectedPhong} setSelectedPhong={setSelectedPhong}
        selectedChucVu={selectedChucVu} setSelectedChucVu={setSelectedChucVu}
        targetMaNV={targetMaNV} setTargetMaNV={setTargetMaNV}
        selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth}
        onCalculate={handleCalculate} loading={calcLoading}
      />

      {/* Chỉ hiện khi KHÔNG có kết quả (ketQua = null) và KHÔNG đang tính toán */}
      {!ketQua && !calcLoading && (
        <div className="max-w-7xl mx-auto border-2 border-dashed border-gray-300 rounded-lg h-64 flex flex-col items-center justify-center text-gray-400 bg-white shadow-sm">
            <div className="text-5xl mb-4 animate-bounce">👆</div>
            <p className="text-lg font-medium text-gray-500">
                Vui lòng chọn bộ lọc và bấm "Tính Lương"
            </p>
        </div>
      )}

      {/* RESULT TABLE  */}
      {Array.isArray(ketQua) && ketQua.length > 0 && (
        <div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-xl p-5 mb-8 shadow-sm">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 font-bold text-gray-700 flex items-center gap-2">
                <Users size={20} /> BẢNG KẾT QUẢ TÍNH LƯƠNG
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left table-fixed">
                    <thead className="bg-gray-50 text-gray-700 font-bold uppercase text-xs border-b">
                        <tr>
                            <th className="px-6 py-3 w-32">Mã NV</th> 
                            <th className="px-6 py-3">Họ và Tên</th>
                            <th className="px-6 py-3 text-right w-48">Tổng Thực Nhận</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ketQua.map((item, index) => (
                            <tr key={item.ma_nhan_vien} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                <td className="px-6 py-4">
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-bold text-xs">{item.ma_nhan_vien}</span>
                                </td>
                                <td className="px-6 py-4 font-bold text-gray-800">{item.ten_nhan_vien}</td>
                                <td className="px-6 py-4 text-right">
                                    <span className="bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded font-bold text-base">
                                        {Number(item.tong_luong).toLocaleString('vi-VN')} đ
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-4 text-sm text-gray-500 text-right border-t">Tổng {ketQua.length} nhân viên</div>
        </div>
      )}

      {/* RESULT TICKET (SINGLE) */}
      {ketQua && !Array.isArray(ketQua) && (
        <SalaryResult data={ketQua} />
      )}
    </div>
  );
};

export default TinhLuongPage;