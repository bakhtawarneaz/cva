import api from '../config/axiosConfig';

export const createOrganization = async (data) => {
    const response = await api.post('/backend/client/onboarding', data);
    return response.data;
};