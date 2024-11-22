import { useQuery } from '@tanstack/react-query';
import { fetchCountry } from '@api/countryApi';
import { getOrganization } from '@api/organizationApi';
import { getBrand } from '@api/brandApi';
import toast from 'react-hot-toast';

/** Countries **/
export function useFetchCountries() {
    return useQuery({
        queryKey: ['country'],
        queryFn: fetchCountry,
        staleTime: 60 * 60 * 1000,
    });
}

/** Organization **/
export function useFetchOrganizations(params, fetchFor = 'grid' ) {
    return useQuery({
        queryKey: ['organization', fetchFor, params],
        queryFn: () => {
            if (fetchFor === 'grid') {
                return getOrganization({ ...params, type: 'grid' });
            }
            if (fetchFor === 'selectBox') {
                return getOrganization({ ...params, type: 'selectBox' });
            }
            throw new Error('Invalid fetchFor parameter');
        },
        staleTime: 60 * 60 * 1000,
    });
}
  
/** Brand **/
export function useFetchBrand(params) {
    return useQuery({
        queryKey: ['brand', params.page],
        queryFn: () => getBrand(params),
        staleTime: 60 * 60 * 1000,
    });
}