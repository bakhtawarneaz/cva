import api from '../config/axiosConfig';

export const createBrand = async (data) => {
    const response = await api.post('/brand/create', data);
    return response.data;
};

export const getBrand = async (data) => {
    const response = await api.post('/brand/fetch',data);
    return response.data;
};

export const deleteBrand = async (brandId) => {
    const response = await api.post('/brand/delete',brandId);
    return response.data;
};

export const editBrand = async (data) => {
    const response = await api.post('/brand/update', data);
    return response.data;
};