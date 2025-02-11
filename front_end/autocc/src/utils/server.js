// server.js
import axios from './axios';

// 调用后端 `/read-file` 接口的方法
export const readFile = async (filepath) => {
    try {
        const response = await axios.post('/read-file', { filepath });
        // 返回文件内容或下载链接
        return response.data;
    } catch (error) {
        // 捕获错误并返回错误信息
        console.error('Error in readFile API:', error);
        throw error;
    }
};

// 获取单个文件详情，调用/get-single-file-detail方法
export const getSingleFileDetail = async (project_name,file_name) => {
    const response = await axios.post('/get-single-file-detail', { project_name,file_name });
    return response.data;
};

export const getQueryResult = async (query) => {
    const response = await axios.post('/get-query-result', { query });
    return response.data;
};

// 生成代码
export const getGenerateCode = async (query,queryInfo,project_id,current_step) => {
    const response = await axios.post('/generate-code', { query,queryInfo,project_id,current_step });
    return response.data;
};
