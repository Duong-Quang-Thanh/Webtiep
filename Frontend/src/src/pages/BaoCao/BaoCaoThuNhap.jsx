import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import luongApi from '../../api/luongApi';
import nhanVienApi from '../../api/nhanVienApi';
import phongBanApi from '../../api/phongBanApi';
import chucVuApi from '../../api/chucVuApi';
import { useAuth } from '../../contexts/AuthContext';
import SalaryFilter from './components/SalaryFilter';
import SalaryDetail from './components/SalaryDetail';
import SalarySummary from './components/SalarySummary';

// Loading Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-20 flex-col gap-3">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
    <span className="text-gray-500 text-sm">Đang xử lý dữ liệu...</span>
  </div>
);

const BaoCaoThuNhap = () => {
  const { user } = useAuth();
  const isAdminOrHR = user?.role === 'admin' || user?.role === 'hr';

  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState(dayjs().year());
  const [viewMode, setViewMode] = useState('none'); 

  // Data States
  const [detailData, setDetailData] = useState([]); 
  const [tongNamDetail, setTongNamDetail] = useState(0);
  const [viewingName, setViewingName] = useState('');
  const [summaryData, setSummaryData] = useState([]);

  // Filter States
  const [listNhanVien, setListNhanVien] = useState([]);
  const [filteredNhanVien, setFilteredNhanVien] = useState([]);
  const [listPhongBan, setListPhongBan] = useState([]);
  const [listChucVu, setListChucVu] = useState([]);
  
  const [selectedPhong, setSelectedPhong] = useState(undefined);
  const [selectedChucVu, setSelectedChucVu] = useState(undefined);
  const [targetMaNV, setTargetMaNV] = useState(undefined);

  // 1. Init Data
  useEffect(() => {
    if (isAdminOrHR) {
      const fetchCatalogs = async () => {
        try {
          const [resNV, resPB, resCV] = await Promise.all([
            nhanVienApi.getAll(), phongBanApi.getAll(), chucVuApi.getAll()
          ]);
          const allNV = Array.isArray(resNV) ? resNV : [];
          setListNhanVien(allNV);
          setFilteredNhanVien(allNV);
          setListPhongBan(Array.isArray(resPB) ? resPB : []);
          setListChucVu(Array.isArray(resCV) ? resCV : []);
        } catch (error) { console.error(error); }
      };
      fetchCatalogs();
    } else {
      handleFetchDetail(user.ma_nhan_vien);
    }
  }, [user]);

  // 2. Filter Logic
  useEffect(() => {
    let result = listNhanVien;
    if (selectedPhong) result = result.filter(nv => nv.ma_phong === selectedPhong);
    if (selectedChucVu) result = result.filter(nv => nv.ma_chuc_vu === selectedChucVu);
    setFilteredNhanVien(result);
    if (targetMaNV && !result.find(nv => nv.ma_nhan_vien === targetMaNV)) setTargetMaNV(undefined);
  }, [selectedPhong, selectedChucVu, listNhanVien]);

  // 3. Handlers
  const handleSearch = () => {
    if (!isAdminOrHR) {
        handleFetchDetail(user.ma_nhan_vien);
        return;
    }
    if (targetMaNV) {
      handleFetchDetail(targetMaNV);
    } else {
      handleFetchSummary();
    }
  };

  const handleFetchDetail = async (maNV) => {
    setLoading(true);
    setViewMode('detail');
    try {
      const nvInfo = listNhanVien.find(n => n.ma_nhan_vien === maNV);
      setViewingName(nvInfo ? `${nvInfo.ten_nhan_vien} (${maNV})` : maNV);

      const res = await luongApi.getThongKeNam(maNV, year);
      setDetailData(res.data.chi_tiet_theo_thang);
      setTongNamDetail(res.data.tong_thu_nhap_nam);
    } catch (error) {
      setDetailData([]); setTongNamDetail(0);
      alert("Chưa có dữ liệu lương.");
    } finally { setLoading(false); }
  };

  const handleFetchSummary = async () => {
    setLoading(true);
    setViewMode('summary');
    setSummaryData([]);
    try {
      const listTarget = filteredNhanVien;
      if (listTarget.length === 0) {
        alert("Không tìm thấy nhân viên nào.");
        setLoading(false); return;
      }
      
      const promises = listTarget.map(async (nv) => {
        try {
          const res = await luongApi.getThongKeNam(nv.ma_nhan_vien, year);
          return { ...nv, tongThuNhap: res.data.tong_thu_nhap_nam, coDuLieu: true };
        } catch (err) { return { ...nv, tongThuNhap: 0, coDuLieu: false }; }
      });

      const results = await Promise.all(promises);
      setSummaryData(results);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        {isAdminOrHR ? "🔍 Tra Cứu & Thống Kê Thu Nhập" : "📊 Báo Cáo Thu Nhập Cá Nhân"}
      </h2>
      
      {/* FILTER SECTION */}
      <SalaryFilter 
        isAdmin={isAdminOrHR} listPhongBan={listPhongBan} listChucVu={listChucVu} filteredNhanVien={filteredNhanVien}
        selectedPhong={selectedPhong} setSelectedPhong={setSelectedPhong}
        selectedChucVu={selectedChucVu} setSelectedChucVu={setSelectedChucVu}
        targetMaNV={targetMaNV} setTargetMaNV={setTargetMaNV}
        year={year} setYear={setYear}
        onSearch={handleSearch} loading={loading}
      />

      {/* CONTENT SECTION */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {viewMode === 'detail' && (
            <SalaryDetail 
              data={detailData} total={tongNamDetail} name={viewingName} year={year} 
              loading={loading} isAdmin={isAdminOrHR} onBack={handleFetchSummary}
            />
          )}

          {viewMode === 'summary' && isAdminOrHR && (
            <SalarySummary data={summaryData} year={year} onViewDetail={handleFetchDetail} />
          )}

          {viewMode === 'none' && isAdminOrHR && (
            <div className="max-w-7xl mx-auto border-2 border-dashed border-gray-300 rounded-lg h-64 flex flex-col items-center justify-center text-gray-400 bg-white shadow-sm">
          <div className="text-5xl mb-4 animate-bounce">👆</div>
          <p className="text-lg font-medium text-gray-500">
            Vui lòng chọn bộ lọc và xem báo cáo
          </p>
        </div>
          )}
        </>
      )}
    </div>
  );
};

export default BaoCaoThuNhap;