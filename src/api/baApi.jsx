import api from '../config/axiosConfig';

export const createBa = async (data) => {
    const response = await api.post('/backend/BA/create', data);
    return response.data;
};

export const getBa = async (data) => {
    const response = await api.post('/backend/BA/fetch',data);
    return response.data;
};

export const deleteBa = async (data) => {
    const response = await api.post('/backend/BA/delete', data);
    return response.data;
};

export const editBa = async (data) => {
    const response = await api.post('backend/BA/update',data);
    return response.data;
};
