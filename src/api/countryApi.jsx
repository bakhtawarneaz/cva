import api from '../config/axiosConfig';

export const fetchCountry = async () => {
    const response = await api.get('https://glist.its.com.pk/v1/fetch/countries');
    return response.data;
};