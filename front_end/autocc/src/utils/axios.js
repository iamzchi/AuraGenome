// axios.js
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5001'

// 创建 axios 实例
const instance = axios.create({
    baseURL: API_BASE_URL, // 后端服务的基础 URL
    timeout: 100000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        // 在请求发送前做一些处理，例如添加认证 token
        console.log('Request:', config);
        return config;
    },
    (error) => {
        // 请求错误时
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// 响应拦截器
instance.interceptors.response.use(
    (response) => {
        // 对响应数据进行处理
        console.log('Response:', response);
        return response;
    },
    (error) => {
        if (error && (error.code === 'ECONNABORTED' || (typeof error.message === 'string' && error.message.toLowerCase().includes('timeout')))) {
            error.isTimeout = true;
        }
        console.error('Response error:', error.response || error.message);
        return Promise.reject(error);
    }
);

export default instance
export { API_BASE_URL }
