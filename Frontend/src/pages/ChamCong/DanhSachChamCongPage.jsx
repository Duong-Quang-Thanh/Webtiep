import React, { useState, useEffect } from "react";
import chamCongApi from "../../api/chamCongApi";
import phongBanApi from "../../api/phongBanApi";
import dayjs from "dayjs";
import { 
  Edit2, Save, X, Filter, Search, RotateCcw, 
  Calendar, Users, Clock, ChevronDown, CheckCircle 
} from "react-feather";

const DanhSachChamCongPage = () => {
  const [loading, setLoading] = useState(false);
  const [danhSach, setDanhSach] = useState([]);
  const [phongBanList, setPhongBanList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  const [filters, setFilters] = useState({
    ma_phong: "",
    ngay: "",
    thang: dayjs().month() + 1,
    nam: dayjs().year(),
    trang_thai_ca: "",
  });

  // Load phòng ban
  useEffect(() => {
    const loadPhongBan = async () => {
      try {
        const data = await phongBanApi.getAll();
        setPhongBanList(data?.data || data || []);
      } catch (error) {
        console.error("Lỗi tải phòng ban:", error);
      }
    };
    loadPhongBan();
  }, []);

  // Load danh sách chấm công
  const loadDanhSach = async () => {
    setLoading(true);
    try {
      const params = {
        thang: filters.thang,
        nam: filters.nam,
      };

      if (filters.ma_phong) params.ma_phong = filters.ma_phong;
      if (filters.ngay) params.ngay = filters.ngay;
      if (filters.trang_thai_ca) params.trang_thai_ca = filters.trang_thai_ca;

      const data = await chamCongApi.getDanhSach(params);
      setDanhSach(data || []);
    } catch (error) {
      console.error("Lỗi tải danh sách chấm công:", error);
      setDanhSach([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDanhSach();
  }, [filters.thang, filters.nam]);

  const handleSearch = () => {
    loadDanhSach();
  };

  const handleReset = () => {
    setFilters({
      ma_phong: "",
      ngay: "",
      thang: dayjs().month() + 1,
      nam: dayjs().year(),
      trang_thai_ca: "",
    });
  };

  // EDIT CHUYÊN CẦN
  const handleEditClick = (item) => {
    setEditingId(item.id || `${item.ma_nhan_vien}-${item.ngay_lam}`);
    setEditValues({
      ...item,
      trang_thai_ca: item.trang_thai_ca || "",
    });
  };

  const handleSaveEdit = async () => {
    try {
      await chamCongApi.updateChamCong(editingId, {
        trang_thai_ca: editValues.trang_thai_ca,
      });
      // Giả lập thông báo toast đơn giản
      alert("✅ Cập nhật chuyên cần thành công!");
      setEditingId(null);
      loadDanhSach();
    } catch (error) {
      alert("❌ Lỗi cập nhật: " + (error.response?.data?.message || error.message));
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  // Helper render Badge đẹp hơn
  const renderTrangThaiBadge = (trangThai) => {
    const styles = {
      'DungGio':      { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Đúng giờ', icon: '⏰' },
      'DiMuon':       { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Đi muộn', icon: '🏃' },
      'VeSom':        { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Về sớm', icon: '💨' },
      'VangMat':      { bg: 'bg-rose-100', text: 'text-rose-700', label: 'Vắng mặt', icon: '🚫' },
      'LamThemGio':   { bg: 'bg-blue-100', text: 'text-blue-700', label: 'OT', icon: '💪' },
      'NghiPhep':     { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Nghỉ phép', icon: '🏖️' },
      'default':      { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Chưa rõ', icon: '❓' }
    };
    
    const style = styles[trangThai] || styles['default'];

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text} border border-opacity-20 border-current shadow-sm`}>
        <span>{style.icon}</span>
        {style.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
              <span className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-500/30">
                <Clock size={28} />
              </span>
              Quản Lý Chấm Công
            </h2>
            <p className="text-slate-500 mt-1 ml-14">Theo dõi thời gian làm việc và chuyên cần</p>
          </div>
        </div>

        {/* BỘ LỌC (CARD) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8 transition-all hover:shadow-md">
          <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
            <Filter size={18} className="text-blue-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Bộ Lọc Tìm Kiếm</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-5">
            
            {/* Custom Select Component cho Năm */}
            <div className="relative group">
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Năm</label>
              <div className="relative">
                <select
                  className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all appearance-none cursor-pointer hover:border-blue-300"
                  value={filters.nam}
                  onChange={(e) => setFilters({ ...filters, nam: parseInt(e.target.value) })}
                >
                  {Array.from({ length: 5 }, (_, i) => dayjs().year() - 2 + i).map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors" />
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Custom Select Component cho Tháng */}
            <div className="relative group">
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Tháng</label>
              <div className="relative">
                <select
                  className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all appearance-none cursor-pointer hover:border-blue-300"
                  value={filters.thang}
                  onChange={(e) => setFilters({ ...filters, thang: parseInt(e.target.value) })}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>Tháng {m}</option>
                  ))}
                </select>
                <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors" />
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Phòng ban */}
            <div className="relative group lg:col-span-2">
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Phòng Ban</label>
              <div className="relative">
                <select
                  className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all appearance-none cursor-pointer hover:border-blue-300"
                  value={filters.ma_phong}
                  onChange={(e) => setFilters({ ...filters, ma_phong: e.target.value })}
                >
                  <option value="">Tất cả phòng ban</option>
                  {phongBanList.map((pb) => (
                    <option key={pb.ma_phong} value={pb.ma_phong}>{pb.ten_phong}</option>
                  ))}
                </select>
                <Users size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors" />
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

             {/* Trạng thái */}
             <div className="relative group lg:col-span-2">
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Trạng Thái</label>
              <div className="relative">
                <select
                  className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all appearance-none cursor-pointer hover:border-blue-300"
                  value={filters.trang_thai_ca}
                  onChange={(e) => setFilters({ ...filters, trang_thai_ca: e.target.value })}
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="DungGio">✅ Đúng giờ</option>
                  <option value="DiMuon">⚠️ Đi muộn</option>
                  <option value="VeSom">💨 Về sớm</option>
                  <option value="VangMat">🚫 Vắng mặt</option>
                  <option value="LamThemGio">💪 Làm thêm giờ</option>
                  <option value="NghiPhep">🏖️ Nghỉ phép</option>
                </select>
                <CheckCircle size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors" />
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Ngày cụ thể */}
            <div className="relative group lg:col-span-2">
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Ngày cụ thể (Tùy chọn)</label>
              <input
                type="date"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all hover:border-blue-300"
                value={filters.ngay}
                onChange={(e) => setFilters({ ...filters, ngay: e.target.value })}
              />
            </div>

            {/* Buttons */}
            <div className="flex items-end gap-3 lg:col-span-4 xl:col-span-4 justify-end">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
              >
                <RotateCcw size={16} /> Đặt lại
              </button>
              <button
                onClick={handleSearch}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 active:transform active:scale-95 transition-all shadow-md"
              >
                <Search size={16} /> Tìm kiếm
              </button>
            </div>
          </div>
        </div>

        {/* BẢNG DỮ LIỆU */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-700">
              Danh Sách Nhân Viên
            </h3>
            <span className="bg-blue-100 text-blue-700 py-1 px-3 rounded-full text-xs font-bold">
              {danhSach.length} bản ghi
            </span>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center text-slate-400 flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                Đang tải dữ liệu...
              </div>
            ) : danhSach.length === 0 ? (
              <div className="p-12 text-center text-slate-400 flex flex-col items-center">
                <Filter size={48} className="text-slate-200 mb-4" />
                <p>Không tìm thấy dữ liệu nào.</p>
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider font-bold">
                  <tr>
                    <th className="px-6 py-4 rounded-tl-lg">Nhân Viên</th>
                    <th className="px-6 py-4">Phòng Ban</th>
                    <th className="px-6 py-4">Ngày</th>
                    <th className="px-6 py-4">Check-in</th>
                    <th className="px-6 py-4">Check-out</th>
                    <th className="px-6 py-4">Trạng Thái</th>
                    <th className="px-6 py-4">Chuyên Cần</th>
                    <th className="px-6 py-4 text-center rounded-tr-lg">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {danhSach.map((item, idx) => {
                    const isEditing = editingId === (item.id || `${item.ma_nhan_vien}-${item.ngay_lam}`);
                    
                    return (
                      <tr key={idx} className="hover:bg-blue-50/40 transition-colors group">
                        <td className="px-6 py-4 font-semibold text-slate-700">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold">
                                {item.ma_nhan_vien.slice(0,2)}
                            </div>
                            {item.ma_nhan_vien}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{item.ten_phong || '-'}</td>
                        <td className="px-6 py-4 font-medium text-slate-700">{dayjs(item.ngay_lam).format('DD/MM/YYYY')}</td>
                        <td className="px-6 py-4 font-mono text-slate-600">{item.gio_vao || '--:--'}</td>
                        <td className="px-6 py-4 font-mono text-slate-600">{item.gio_ra || '--:--'}</td>
                        <td className="px-6 py-4">
                           {renderTrangThaiBadge(item.trang_thai_ca)}
                        </td>
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <div className="relative">
                              <select
                                value={editValues.trang_thai_ca}
                                onChange={(e) => setEditValues({ ...editValues, trang_thai_ca: e.target.value })}
                                className="w-full p-2 pr-8 bg-white border-2 border-blue-400 rounded-lg text-xs shadow-lg focus:outline-none appearance-none"
                              >
                                <option value="">-- Chọn --</option>
                                <option value="DungGio">Đúng giờ</option>
                                <option value="DiMuon">Đi muộn</option>
                                <option value="VeSom">Về sớm</option>
                                <option value="VangMat">Vắng mặt</option>
                                <option value="LamThemGio">Làm thêm giờ</option>
                                <option value="NghiPhep">Nghỉ phép</option>
                              </select>
                              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none"/>
                            </div>
                          ) : (
                            <span className="text-slate-500 italic text-xs">
                                {item.trang_thai_ca || '(Chưa xét)'}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {isEditing ? (
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={handleSaveEdit}
                                className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition"
                                title="Lưu lại"
                              >
                                <Save size={16} />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200 transition"
                                title="Hủy bỏ"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEditClick(item)}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                              title="Chỉnh sửa trạng thái"
                            >
                              <Edit2 size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          
          {/* Pagination Footer (Giả lập) */}
          {danhSach.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <span className="text-xs text-slate-400">Hiển thị {danhSach.length} kết quả</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DanhSachChamCongPage;