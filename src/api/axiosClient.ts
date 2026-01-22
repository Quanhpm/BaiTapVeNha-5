// Axios client with interceptors
import axios from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor cho Request: Chạy trước khi gửi yêu cầu lên server
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Log này để ae đang gọi đúng link API chưa
    console.log(`🚀 [API Request]: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor cho Response: Chạy ngay khi nhận dữ liệu từ server về
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // MockAPI trả về dữ liệu nằm trong response.data
    return response.data;
  },
  (error) => {
    // Xử lý lỗi tập trung
    if (error.response) {
      console.error('❌ API Error:', error.response.status, error.response.data);
      alert(`Lỗi hệ thống: ${error.response.status}`);
    } else {
      console.error('❌ Network Error:', error.message);
      alert('Không thể kết nối đến server!');
    }
    return Promise.reject(error);
  }
);

export default axiosClient;