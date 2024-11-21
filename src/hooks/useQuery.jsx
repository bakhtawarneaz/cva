import { useQuery } from '@tanstack/react-query';
import { fetchCountry } from '@api/countryApi';
import { getOrganization } from '@api/organizationApi';

/** Countries **/
export function useFetchCountries() {
    return useQuery({
        queryKey: ['country'],
        queryFn: fetchCountry,
        staleTime: 60 * 60 * 1000,
    });
}

/** Organization **/
export function useFetchOrganizations(params) {
    return useQuery({
        queryKey: ['organization', params.page],
        queryFn: () => getOrganization(params),
    });
}
  
