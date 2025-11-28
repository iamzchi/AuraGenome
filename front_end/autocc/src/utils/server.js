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
export const getGenerateCode = async (query, project_id, query_info, base_code) => {
    const response = await axios.post('/generate-code', { query, project_id, query_info, base_code });
    return response.data;
};

// 修改代码
export const getModifyCode = async (query, project_id, query_info, base_code) => {
    const response = await axios.post('/modify-code', { query, project_id, query_info, base_code });
    return response.data;
};

export const getConsoleInfo = async (current_code, model = 'openai/gpt-4o-mini') => {
    const response = await axios.post('/get-console-info', { current_code, model });
    return response.data;
};

export const getSnapshotInfo = async (current_code, former_steps, model = 'openai/gpt-4o-mini') => {
    const response = await axios.post('/get-snapshot', { current_code, former_steps, model });
    return response.data;
};

export const deleteTrack = async (current_code, trackId, model = 'openai/gpt-4o-mini') => {
    try {
        const response = await axios.post('/delete-track', { current_code, trackId });
        return response.data;
    } catch (error) {
        console.error('Error in deleteTrack API:', error);
        throw error;
    }
};

