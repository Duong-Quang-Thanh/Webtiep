import React, { useState, useEffect } from "react";
import chamCongApi from "../../api/chamCongApi";
import phongBanApi from "../../api/phongBanApi";
import dayjs from "dayjs";
import { Edit2, Save, X, Filter } from "react-feather";

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
      // Call API update
      await chamCongApi.updateChamCong(editingId, {
        trang_thai_ca: editValues.trang_thai_ca,
      });
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

  const getTrangThaiColor = (trangThai) => {
    const colors = {
      'DungGio': 'bg-green-100 text-green-800',
      'DiMuon': 'bg-yellow-100 text-yellow-800',
      'VeSom': 'bg-orange-100 text-orange-800',
      'VangMat': 'bg-red-100 text-red-800',
      'LamThemGio': 'bg-blue-100 text-blue-800',
      'NghiPhep': 'bg-purple-100 text-purple-800',
    };
    return colors[trangThai] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 max-w-full mx-auto">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <Filter size={32} className="text-blue-600" />
        Danh Sách Chấm Công (Quản Lý)
      </h2>

      {/* BỘ LỌC */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">🔍 Bộ lọc</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
          {/* Phòng ban */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phòng Ban</label>
            <select
              className="w-full p-2 border-2 border-gray-300 rounded-lg"
              value={filters.ma_phong}
              onChange={(e) =>
                setFilters({ ...filters, ma_phong: e.target.value })
              }
            >
              <option value="">-- Tất cả --</option>
              {phongBanList.map((pb) => (
                <option key={pb.ma_phong} value={pb.ma_phong}>
                  {pb.ten_phong}
                </option>
              ))}
            </select>
          </div>

          {/* Ngày cụ thể */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày</label>
            <input
              type="date"
              className="w-full p-2 border-2 border-gray-300 rounded-lg"
              value={filters.ngay}
              onChange={(e) =>
                setFilters({ ...filters, ngay: e.target.value })
              }
            />
          </div>

          {/* Tháng */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tháng</label>
            <select
              className="w-full p-2 border-2 border-gray-300 rounded-lg"
              value={filters.thang}
              onChange={(e) =>
                setFilters({ ...filters, thang: parseInt(e.target.value) })
              }
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Năm */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Năm</label>
            <select
              className="w-full p-2 border-2 border-gray-300 rounded-lg"
              value={filters.nam}
              onChange={(e) =>
                setFilters({ ...filters, nam: parseInt(e.target.value) })
              }
            >
              {Array.from({ length: 5 }, (_, i) => dayjs().year() - 2 + i).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Trạng thái ca */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng Thái</label>
            <select
              className="w-full p-2 border-2 border-gray-300 rounded-lg"
              value={filters.trang_thai_ca}
              onChange={(e) =>
                setFilters({ ...filters, trang_thai_ca: e.target.value })
              }
            >
              <option value="">-- Tất cả --</option>
              <option value="DungGio">Đúng giờ</option>
              <option value="DiMuon">Đi muộn</option>
              <option value="VeSom">Về sớm</option>
              <option value="VangMat">Vắng mặt</option>
              <option value="LamThemGio">Làm thêm giờ</option>
              <option value="NghiPhep">Nghỉ phép</option>
            </select>
          </div>

          {/* Nút Search */}
          <div className="flex items-end gap-2">
            <button
              onClick={handleSearch}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
            >
              Tìm kiếm
            </button>
            <button
              onClick={handleReset}
              className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-500"
            >
              Đặt lại
            </button>
          </div>
        </div>
      </div>

      {/* DANH SÁCH */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="bg-blue-50 p-4 border-b border-blue-200">
          <h3 className="text-lg font-bold">
            📋 Kết quả: {danhSach.length} bản ghi
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Đang tải...</div>
        ) : danhSach.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Không có dữ liệu</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Nhân Viên</th>
                  <th className="px-4 py-3 text-left font-semibold">Phòng Ban</th>
                  <th className="px-4 py-3 text-left font-semibold">Ngày</th>
                  <th className="px-4 py-3 text-left font-semibold">Giờ Vào</th>
                  <th className="px-4 py-3 text-left font-semibold">Giờ Ra</th>
                  <th className="px-4 py-3 text-left font-semibold">Trạng Thái Ca</th>
                  <th className="px-4 py-3 text-left font-semibold">Chuyên Cần</th>
                  <th className="px-4 py-3 text-center font-semibold">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {danhSach.map((item, idx) => {
                  const isEditing = editingId === (item.id || `${item.ma_nhan_vien}-${item.ngay_lam}`);

                  return (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">{item.ma_nhan_vien}</td>
                      <td className="px-4 py-3">{item.ten_phong || '-'}</td>
                      <td className="px-4 py-3">{dayjs(item.ngay_lam).format('DD/MM/YYYY')}</td>
                      <td className="px-4 py-3 font-mono">{item.gio_vao || '-'}</td>
                      <td className="px-4 py-3 font-mono">{item.gio_ra || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getTrangThaiColor(item.trang_thai_ca)}`}>
                          {item.trang_thai_ca || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <select
                            value={editValues.trang_thai_ca}
                            onChange={(e) =>
                              setEditValues({ ...editValues, trang_thai_ca: e.target.value })
                            }
                            className="w-full p-2 border-2 border-blue-500 rounded-lg text-xs"
                          >
                            <option value="">-- Chọn --</option>
                            <option value="DungGio">Đúng giờ</option>
                            <option value="DiMuon">Đi muộn</option>
                            <option value="VeSom">Về sớm</option>
                            <option value="VangMat">Vắng mặt</option>
                            <option value="LamThemGio">Làm thêm giờ</option>
                            <option value="NghiPhep">Nghỉ phép</option>
                          </select>
                        ) : (
                          <span className="text-gray-600">{editValues.trang_thai_ca || item.trang_thai_ca || '-'}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isEditing ? (
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={handleSaveEdit}
                              className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
                              title="Lưu"
                            >
                              <Save size={16} />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="bg-gray-400 text-white p-2 rounded hover:bg-gray-500 transition"
                              title="Hủy"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEditClick(item)}
                            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                            title="Chỉnh sửa"
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
          </div>
        )}
      </div>
    </div>
  );
};

export default DanhSachChamCongPage;
