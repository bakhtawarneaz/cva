import api from '../config/axiosConfig';

export const createUser = async (data) => {
    const response = await api.post('/backend/users/create', data);
    return response.data;
};

export const getUser = async (data) => {
    const response = await api.post('/backend/fetch/all/users',data);
    return response.data;
};

export const deleteUser = async ({ id, status }) => {
    const response = await api.put(`/backend/users/toggle/${id}`, status);
    return response.data;
};

export const editUser = async ({ id , data}) => {
    const response = await api.put(`/backend/users/update/${id}`,data);
    return response.data;
};

export const getRole = async (data) => {
    const response = await api.post('/backend/fetch/list/roles', data);
    return response.data;
};