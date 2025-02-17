import axios from 'axios';
import { store } from '../redux/store';
import { logout } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';


// local
const BASE_URL = 'http://localhost:3055/v1';

// went
//const BASE_URL = 'https://cva-be-went.its.com.pk/v1';

// live
//const BASE_URL = 'https://cva-be.its.com.pk/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const axiosPrivate = axios.create({
	baseURL: BASE_URL,
	headers: { 'Content-Type': 'application/json' },
	withCredentials: true,
});


export const isTokenExpired = (token) => {
	try {
		const decodedToken = JSON.parse(atob(token.split('.')[1]));
		const currentTime = Date.now() / 1000; 
		return decodedToken.exp < currentTime;
	} catch (error) {
		return true;
	}
};

// Request interceptor
api.interceptors.request.use(
	async (request) => {

		const account = await store.getState().auth;
		const isAuthenticated = account?.isAuthenticated;
		const token = account?.token;

		if (token && isAuthenticated) {
			if (isTokenExpired(token)) {
				toast.error('Session expired, please login again!');
				store.dispatch(logout());
				throw new axios.Cancel('Token expired, user logged out.');
			}
            request.headers["xt-user-token"] = token;
            request.headers["xt-client-token"] = token;
        }

		return request;
	},
	(error) => Promise.reject(error),
);

// Response interceptor
api.interceptors.response.use(
	(response) => response,
	async (error) => {
	  if (error.response && error.response.status === 401) {
		toast.error("Un Authenticated!");
		store.dispatch(logout());
	  }
  
	  return Promise.reject(error);
	}
  );


export default api;