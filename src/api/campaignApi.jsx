import api from '../config/axiosConfig';

export const fetchCampaigns = async (data) => {
    const response = await api.post('campaign/fetch',data);
    return response.data;
};
