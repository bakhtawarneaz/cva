import api from '../config/axiosConfig';

export const createOrganization = async (data) => {
    const response = await api.post('/backend/client/onboarding', data);
    return response.data;
};

export const getOrganization = async (data) => {
    const response = await api.post('/backend/fetch/clients',data);
    return response.data;
};

export const deleteOrganization = async (organizationId) => {
    const response = await api.post('/backend/client/toggle',organizationId);
    return response.data;
};

export const fetchOrganizationById = async (organizationId) => {
    const response = await api.get(`/backend/fetch/organization/${organizationId}`);
    return response.data;
};

export const editOrganization = async (data) => {
    const response = await api.post('/backend/client/update', data);
    return response.data;
};