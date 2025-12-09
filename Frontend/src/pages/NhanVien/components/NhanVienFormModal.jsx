import React, { useEffect, useState } from "react";

const NhanVienFormModal = ({
  visible,
  onCancel,
  onOk,
  editingNhanVien,
  listPhongBan,
  listChucVu
}) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData(editingNhanVien || {});
  }, [editingNhanVien]);

  if (!visible) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onOk(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-lg p-6 animate-enter">
        <h2 className="text-xl font-semibold mb-4">
          {editingNhanVien ? "Chỉnh sửa nhân viên" : "Thêm nhân viên"}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Tên NV */}
          <div className="col-span-2">
            <label className="font-medium mb-1 block">Tên NV</label>
            <input
              className="w-full border rounded-lg p-2"
              value={formData.ten_nhan_vien || ""}
              onChange={(e) => handleChange("ten_nhan_vien", e.target.value)}
            />
          </div>

          {/* Phòng Ban */}
          <div>
            <label className="font-medium mb-1 block">Phòng Ban</label>
            <select
              className="w-full border rounded-lg p-2"
              value={formData.ma_phong || ""}
              onChange={(e) => handleChange("ma_phong", e.target.value)}
            >
              <option value="">-- Chọn --</option>
              {listPhongBan.map(pb => (
                <option key={pb.ma_phong} value={pb.ma_phong}>{pb.ten_phong}</option>
              ))}
            </select>
          </div>

          {/* Chức Vụ */}
          <div>
            <label className="font-medium mb-1 block">Chức Vụ</label>
            <select
              className="w-full border rounded-lg p-2"
              value={formData.ma_chuc_vu || ""}
              onChange={(e) => handleChange("ma_chuc_vu", e.target.value)}
            >
              <option value="">-- Chọn --</option>
              {listChucVu.map(cv => (
                <option key={cv.ma_chuc_vu} value={cv.ma_chuc_vu}>{cv.ten_chuc_vu}</option>
              ))}
            </select>
          </div>

          {/* Lương */}
          <div className="col-span-2">
            <label className="font-medium mb-1 block">Mức lương</label>
            <input
              type="number"
              className="w-full border rounded-lg p-2"
              value={formData.muc_luong_co_ban || ""}
              onChange={(e) => handleChange("muc_luong_co_ban", e.target.value)}
            />
          </div>

          {/* Ngày vào làm */}
          <div className="col-span-2">
            <label className="font-medium mb-1 block">Ngày vào làm</label>
            <input
              type="date"
              className="w-full border rounded-lg p-2"
              value={formData.ngay_vao_lam || ""}
              onChange={(e) => handleChange("ngay_vao_lam", e.target.value)}
            />
          </div>

          {/* Trạng thái */}
          <div className="col-span-2">
            <label className="font-medium mb-1 block">Trạng Thái</label>
            <select
              className="w-full border rounded-lg p-2"
              value={formData.trang_thai || ""}
              onChange={(e) => handleChange("trang_thai", e.target.value)}
            >
              <option value="DangLam">Đang làm</option>
              <option value="DaNghi">Đã nghỉ</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="text-right mt-6 space-x-3">
          <button className="px-4 py-2 bg-gray-300 rounded-lg" onClick={onCancel}>
            Hủy
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={handleSubmit}>
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default NhanVienFormModal;