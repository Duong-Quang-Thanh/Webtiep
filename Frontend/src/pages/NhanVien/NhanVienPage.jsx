import React, { useState, useEffect } from 'react';
import nhanVienApi from '../../api/nhanVienApi';
import phongBanApi from '../../api/phongBanApi';
import chucVuApi from '../../api/chucVuApi';
import NhanVienFilter from './components/NhanVienFilter';
import NhanVienFormModal from './components/NhanVienFormModal';

const NhanVienPage = () => {
  const [loading, setLoading] = useState(false);
  const [listNhanVien, setListNhanVien] = useState([]);
  const [filteredNhanVien, setFilteredNhanVien] = useState([]);
  const [listPhongBan, setListPhongBan] = useState([]);
  const [listChucVu, setListChucVu] = useState([]);
  const [selectedPhong, setSelectedPhong] = useState(undefined);
  const [selectedChucVu, setSelectedChucVu] = useState(undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNhanVien, setEditingNhanVien] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [nvRes, pbRes, cvRes] = await Promise.all([
        nhanVienApi.getAll(),
        phongBanApi.getAll(),
        chucVuApi.getAll()
      ]);

      setListNhanVien(nvRes || []);
      setFilteredNhanVien(nvRes || []);

      setListPhongBan(pbRes?.data || pbRes || []);
      setListChucVu(cvRes?.data || cvRes || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = listNhanVien;
    if (selectedPhong) result = result.filter(nv => nv.ma_phong === selectedPhong);
    if (selectedChucVu) result = result.filter(nv => nv.ma_chuc_vu === selectedChucVu);
    setFilteredNhanVien(result);
  }, [selectedPhong, selectedChucVu, listNhanVien]);

  const openEditModal = (nv) => {
    setEditingNhanVien(nv);
    setModalVisible(true);
  };

  const handleDelete = async (maNV) => {
    if (!window.confirm(`Bạn có chắc muốn xóa nhân viên ${maNV}?`)) return;

    await nhanVienApi.delete(maNV);
    loadData();
  };

  const handleModalOk = async (data) => {
    if (editingNhanVien) {
      await nhanVienApi.update(editingNhanVien.ma_nhan_vien, data);
    } else {
      await nhanVienApi.create(data);
    }

    setModalVisible(false);
    loadData();
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">👤 Quản Lý Nhân Viên</h2>

      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <NhanVienFilter
          listPhongBan={listPhongBan}
          listChucVu={listChucVu}
          selectedPhong={selectedPhong}
          selectedChucVu={selectedChucVu}
          setSelectedPhong={setSelectedPhong}
          setSelectedChucVu={setSelectedChucVu}
          onAdd={() => openEditModal(null)}
        />
      </div>

      {/* BẢNG */}
      <div className="bg-white p-5 rounded-xl shadow overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">Mã NV</th>
              <th className="p-3 border">Tên NV</th>
              <th className="p-3 border">Phòng Ban</th>
              <th className="p-3 border">Chức Vụ</th>
              <th className="p-3 border">Mức Lương</th>
              <th className="p-3 border">Ngày Vào Làm</th>
              <th className="p-3 border">Trạng Thái</th>
              <th className="p-3 border text-center">Hành Động</th>
            </tr>
          </thead>

          <tbody>
            {filteredNhanVien.map(nv => (
              <tr key={nv.ma_nhan_vien} className="hover:bg-gray-50">
                <td className="p-3 border">{nv.ma_nhan_vien}</td>
                <td className="p-3 border">{nv.ten_nhan_vien}</td>
                <td className="p-3 border">{nv.ma_phong}</td>
                <td className="p-3 border">{nv.ma_chuc_vu}</td>
                <td className="p-3 border">
                  {Number(nv.muc_luong_co_ban).toLocaleString('vi-VN')} VNĐ
                </td>
                <td className="p-3 border">{nv.ngay_vao_lam}</td>
                <td className="p-3 border">{nv.trang_thai}</td>
                <td className="p-3 border text-center space-x-2">
                  <button
                    onClick={() => openEditModal(nv)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                  >
                    Sửa
                  </button>

                  <button
                    onClick={() => handleDelete(nv.ma_nhan_vien)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}

            {filteredNhanVien.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center p-4 text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <NhanVienFormModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleModalOk}
        editingNhanVien={editingNhanVien}
        listPhongBan={listPhongBan}
        listChucVu={listChucVu}
      />
    </div>
  );
};

export default NhanVienPage;