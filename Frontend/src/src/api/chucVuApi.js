import axiosClient from './axiosClient';

const chucVuApi = {
  getAll: async () => {
    const res = await axiosClient.get('/chucvu');
    return res?.data?.data ?? res?.data ?? [];
  },
  get: (id) => axiosClient.get(`/chucvu/${id}`),
  create: (data) => axiosClient.post('/chucvu', data),
  update: (id, data) => axiosClient.put(`/chucvu/${id}`, data),
  delete: (id) => axiosClient.delete(`/chucvu/${id}`)
};

export default chucVuApi;