import axiosClient from "./axiosClient";

const nhanVienApi = {
  // 1. Lấy tất cả nhân viên
  getAll: async () => {
    const res = await axiosClient.get(`/nhanvien`);
    // Support responses shaped as { data: [...] } or direct array/object
    return res.data?.data ?? res.data ?? [];
  },

  // 2. Lấy thông tin 1 nhân viên theo mã
  getById: async (maNhanVien) => {
    const res = await axiosClient.get(`/nhanvien/${maNhanVien}`);
    return res.data;
  },

  // 3. Tạo nhân viên mới
  create: async (payload) => {
    const res = await axiosClient.post(`/nhanvien`, payload);
    return res.data;
  },

  // 4. Cập nhật nhân viên
  update: async (maNhanVien, payload) => {
    const res = await axiosClient.put(`/nhanvien/${maNhanVien}`, payload);
    return res.data;
  },

  // 5. Xóa nhân viên
  delete: async (maNhanVien) => {
    const res = await axiosClient.delete(`/nhanvien/${maNhanVien}`);
    return res.data;
  },
};

export default nhanVienApi;