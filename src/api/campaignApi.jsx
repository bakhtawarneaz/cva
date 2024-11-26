import api from '../config/axiosConfig';

export const fetchCampaigns = async (data) => {
    const response = await api.post('/campaign/fetch',data);
    return response.data;
};

export const createCampaign = async (data) => {
    const response = await api.post('/campaign/register', data);
    return response.data;
};

export const deleteCampaign = async (campaignId) => {
    const response = await api.post('/campaign/delete',campaignId);
    return response.data;
};

export const editCampaign = async (data) => {
    const response = await api.post('/campaign/update', data);
    return response.data;
};