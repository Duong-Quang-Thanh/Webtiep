import axiosClient from './axiosClient';

const phongBanApi = {
  getAll: async () => {
    const res = await axiosClient.get('/phongban');
    return res?.data?.data ?? res?.data ?? [];
  },
  getTongLuong: (thang, nam) => {
    return axiosClient.get('/phongban/summary', { params: { thang, nam } });
  },
  get: (id, thang, nam) => {
    return axiosClient.get(`/phongban/${id}`, { params: { thang, nam } });
  },
  create: (data) => axiosClient.post('/phongban', data),
  update: (id, data) => axiosClient.put(`/phongban/${id}`, data),
  delete: (id) => axiosClient.delete(`/phongban/${id}`)
};

export default phongBanApi;