import { useMutation } from '@tanstack/react-query'
import { login } from  '@api/authApi';


export function useLogin(navigate, setLoading) {
    return useMutation({
        mutationFn: login,
        onSuccess: () => {
           setLoading(false);
           navigate('/dashboard/organization'); 
        },
    });
}
