import axiosClient from './axiosClient';

const luongApi = {
  tinhLuong: (data) => {
    return axiosClient.post('/luong/tinh-luong', data);
  },

  getThongKeNam: (ma_nv, nam) => {
    return axiosClient.get(`/luong/thong-ke/${ma_nv}/${nam}`);
  }
};

export default luongApi;