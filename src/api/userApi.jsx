import api from '../config/axiosConfig';

export const createUser = async (data) => {
    const response = await api.post('/backend/users/create', data);
    return response.data;
};

export const getUser = async (data) => {
    const response = await api.post('/backend/fetch/all/users',data);
    return response.data;
};

export const deleteUser = async (userId) => {
    const response = await api.post('/backend/users/toggle',userId);
    return response.data;
};

export const editUser = async (data) => {
    const response = await api.put('/backend/users/update', data);
    return response.data;
};