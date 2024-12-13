import { useQuery } from '@tanstack/react-query';
import { fetchCountry } from '@api/countryApi';
import { getOrganization } from '@api/organizationApi';
import { getBrand } from '@api/brandApi';
import { getUser, getRole } from '@api/userApi';
import { fetchCities } from '@api/cityApi';
import { fetchCampaigns } from '@api/campaignApi';
import { getBa } from '@api/baApi';

/** Countries and cities**/
export function useFetchCountries() {
    return useQuery({
        queryKey: ['country'],
        queryFn: fetchCountry,
        staleTime: 60 * 60 * 1000,
    });
}

export function useFetchCity() {
    return useQuery({
        queryKey: ['cities'],
        queryFn: fetchCities,
        staleTime: 60 * 60 * 1000,
    });
}

/** Organization **/
export function useFetchOrganizations(params) {
    return useQuery({
        queryKey: ['organization', params],
        queryFn: () => getOrganization(params),
        staleTime: 60 * 60 * 1000,
    });
}

export function useFetchOrganizationsAll(params2) {
    return useQuery({
        queryKey: ['organization', params2],
        queryFn: () => getOrganization(params2),
        staleTime: 60 * 60 * 1000,
    });
}
  
/** Brand **/
export function useFetchBrand(params) {
    return useQuery({
        queryKey: ['brand', params],
        queryFn: () => getBrand(params),
        staleTime: 60 * 60 * 1000,
    });
}

export function useFetchBrandAll(params2) {
    return useQuery({
        queryKey: ['brand', params2],
        queryFn: () => getBrand(params2),
        staleTime: 60 * 60 * 1000,
    });
}

/** User **/
export function useFetchUser(params) {
    return useQuery({
        queryKey: ['user', params],
        queryFn: () => getUser(params),
        staleTime: 60 * 60 * 1000,
    });
}

/** Role **/
export function useFetchRole(params) {
    return useQuery({
        queryKey: ['role', params],
        queryFn: () => getRole(params),
        staleTime: 60 * 60 * 1000,
    });
}

/** Campaign **/
export function useFetchCampaign(params) {
    return useQuery({
        queryKey: ['campaign', params],
        queryFn: () => fetchCampaigns(params),
        staleTime: 60 * 60 * 1000,
    });
}


/** Campaign **/
export function useFetchBA(params) {
    return useQuery({
        queryKey: ['ba', params],
        queryFn: () => getBa(params),
        staleTime: 60 * 60 * 1000,
    });
}
