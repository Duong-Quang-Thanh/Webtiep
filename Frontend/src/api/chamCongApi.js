import axiosClient from "./axiosClient";

const chamCongApi = {
  // Lấy tổng hợp (Summary) - Dashboard
  getThongKeBieuDo: async (thang, nam) => {
    const res = await axiosClient.get(`/chamcong/summary`, {
      params: { thang, nam },
    });
    return res?.data?.data ?? [];
  },

  // Lịch sử chấm công của 1 nhân viên
  getByNhanVien: async (maNhanVien, thang, nam) => {
    const res = await axiosClient.get(`/chamcong/${maNhanVien}`, {
      params: { thang, nam },
    });
    return res?.data?.data ?? [];
  },

  // Check-in (Nhân viên)
  checkIn: async (payload) => {
    const res = await axiosClient.post(`/chamcong/check-in`, payload);
    return res?.data;
  },

  // Check-out (Nhân viên)
  checkOut: async (payload) => {
    const res = await axiosClient.put(`/chamcong/check-out`, payload);
    return res?.data;
  },

  // MỚI: Lấy danh sách chấm công với bộ lọc (HR/Admin)
  getDanhSach: async (filters) => {
    const res = await axiosClient.get(`/chamcong`, {
      params: filters // { ma_phong, ngay, thang, nam, trang_thai_ca }
    });
    return res?.data?.data ?? [];
  },

  // MỚI: Cập nhật chuyên cần (HR/Admin)
  updateChamCong: async (id, payload) => {
    const res = await axiosClient.put(`/chamcong/${id}`, payload);
    return res?.data;
  },
};

export default chamCongApi;