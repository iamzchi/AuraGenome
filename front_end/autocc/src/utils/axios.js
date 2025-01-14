// axios.js
import axios from 'axios';

// 创建 axios 实例
const instance = axios.create({
    baseURL: 'http://127.0.0.1:5000', // 后端服务的基础 URL
    timeout: 5000, // 请求超时时间（毫秒）
    headers: {
        'Content-Type': 'application/json', // 默认请求头
    },
});

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
        // 处理响应错误
        console.error('Response error:', error.response || error.message);
        return Promise.reject(error);
    }
);

export default instance;
