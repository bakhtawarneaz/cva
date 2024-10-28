export const fetchCities = async () => {
    const response = await api.get('https://glist.its.com.pk/v1/fetch/countries');
    console.log(response.data);
    return response.data;
};