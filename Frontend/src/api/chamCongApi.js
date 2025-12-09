// import axiosClient from "./axiosClient";

// const chamCongApi = {

//   getAll: async () => {
//     const res = await axiosClient.get(`/chamcong`);
//     return res?.data?.data ?? res?.data ?? [];
//   },


//   create: async (payload) => {
//     const res = await axiosClient.post(`/chamcong`, payload);
//     return res?.data;
//   },


//   update: async (id, payload) => {
//     const res = await axiosClient.put(`/chamcong/${id}`, payload);
//     return res?.data;
//   },


//   delete: async (id) => {
//     const res = await axiosClient.delete(`/chamcong/${id}`);
//     return res?.data;
//   },


//   getLichSu: async (maNhanVien) => {
//     const res = await axiosClient.get(`/chamcong/lich-su/${maNhanVien}`);
//     return res?.data?.data ?? res?.data ?? [];
//   },


//   getThongKeBieuDo: async (thang, nam) => { // dev 1 fix
//     const res = await axiosClient.get(`/chamcong/stats`, { 
//       params: { thang, nam },
//     });
//     return res?.data ?? {}; // dev1 fix
//   },
// };

// export default chamCongApi;
// src/api/chamCongApi.js
import axiosClient from "./axiosClient";

const chamCongApi = {
  // Lấy tổng hợp (Summary)
  getThongKeBieuDo: async (thang, nam) => {
    const res = await axiosClient.get(`/chamcong/summary`, {
      params: { thang, nam },
    });
    return res?.data?.data ?? [];
  },

  // Lịch sử theo nhân viên
  getByNhanVien: async (maNhanVien, thang, nam) => {
    const res = await axiosClient.get(`/chamcong/${maNhanVien}`, {
      params: { thang, nam },
    });
    return res?.data?.data ?? [];
  },

  // Check-in
  checkIn: async (payload) => {
    const res = await axiosClient.post(`/chamcong/check-in`, payload);
    return res?.data;
  },

  // Check-out
  checkOut: async (payload) => {
    const res = await axiosClient.put(`/chamcong/check-out`, payload);
    return res?.data;
  },

  // Full (HR/Admin)
  createFull: async (payload) => {
    const res = await axiosClient.post(`/chamcong/full`, payload);
    return res?.data;
  },
};

export default chamCongApi;