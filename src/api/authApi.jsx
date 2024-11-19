import api from '../config/axiosConfig';
import { setToken, login as loginAction, setIsAuthenticated } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';
import { store } from '../redux/store';

export const login = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        const { data } = response;
        if (data?.data?.token && data?.data?.user) {
          store.dispatch(setIsAuthenticated(true));
          store.dispatch(setToken(data.data.token));
          store.dispatch(loginAction(data.data.user));
          toast.success('Login Successfully...!');
      } else {
          toast.error('Invalid response data')
      }
        return response;
      } catch (error) {
        toast.error(error.response.data.message)
      }
};

export default api; 