import api from '../config/axiosConfig';

export const uploadFile = async (file) => {
    const response = await api.post('/upload',file, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
