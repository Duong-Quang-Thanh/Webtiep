import React from 'react';

const NhanVienFilter = ({
  listPhongBan,
  listChucVu,
  selectedPhong,
  selectedChucVu,
  setSelectedPhong,
  setSelectedChucVu,
  onAdd
}) => {
  return (
    <div className="grid grid-cols-12 gap-4 items-end">
      <div className="col-span-12 md:col-span-4">
        <label className="font-medium mb-1 block">Phòng Ban</label>
        <select
          value={selectedPhong || ""}
          onChange={(e) => setSelectedPhong(e.target.value || undefined)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="">Tất cả</option>
          {listPhongBan.map(pb => (
            <option key={pb.ma_phong} value={pb.ma_phong}>{pb.ten_phong}</option>
          ))}
        </select>
      </div>

      <div className="col-span-12 md:col-span-4">
        <label className="font-medium mb-1 block">Chức Vụ</label>
        <select
          value={selectedChucVu || ""}
          onChange={(e) => setSelectedChucVu(e.target.value || undefined)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="">Tất cả</option>
          {listChucVu.map(cv => (
            <option key={cv.ma_chuc_vu} value={cv.ma_chuc_vu}>{cv.ten_chuc_vu}</option>
          ))}
        </select>
      </div>

      <div className="col-span-12 md:col-span-4 text-right">
        <button
          onClick={onAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-card hover:shadow-card-hover"
        >
          + Thêm Nhân Viên
        </button>
      </div>
    </div>
  );
};

export default NhanVienFilter;