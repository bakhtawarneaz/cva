import api from '../config/axiosConfig';

export const fetchCities = async () => {
    const response = await api.get('/city/fetch');
    return response.data;
};