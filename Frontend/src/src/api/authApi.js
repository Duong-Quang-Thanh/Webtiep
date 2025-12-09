import axiosClient from "./axiosClient";

const authApi = {
  /**
   * Login user
   * @param {Object} payload { username, password }
   * @returns {Promise<Object>} { token, user }
   */
  login: async (payload) => {
    try {
      const response = await axiosClient.post("/auth/login", payload);
      return response.data; // { token: "...", user: { ... } }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout user (nếu backend có endpoint logout, optional)
   */
  logout: async () => {
    try {
      const response = await axiosClient.post("/auth/logout");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Refresh token (nếu backend hỗ trợ)
   */
  refreshToken: async () => {
    try {
      const response = await axiosClient.post("/auth/refresh-token");
      return response.data; // { token, user }
    } catch (error) {
      throw error;
    }
  },
};

export default authApi;