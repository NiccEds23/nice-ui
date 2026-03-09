import { useAuthStore } from '@/stores/auth';
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

const generateInstance = (baseURL: string | undefined): AxiosInstance => {
    const options: AxiosRequestConfig = {
        baseURL,
        timeout: 3600 * 60 * 1000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    };

    const http = axios.create(options);
    http.defaults.withCredentials = true;

    // Request Interceptor
    http.interceptors.request.use(
        (config) => {
            const store = useAuthStore();
            const token = store.token;
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (requestError) => Promise.reject(requestError)
    );

    // Response Interceptor
    http.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                const store = useAuthStore();
                store.setToken(null);
            }
            return Promise.reject(error);
        }
    );

    return http;
};

export class HttpClient {
    // private static instance: AxiosInstance;

    public static getInstance(envString: string = 'api_url'): AxiosInstance {
        // Logic to support multiple environments if needed in future
        // currently defaults to VITE_API_BASE_URL
        const baseUrl = envString === 'api_url' ? import.meta.env.VITE_API_URL : import.meta.env.VITE_API_BASE_URL || '/api';
        return generateInstance(baseUrl);
    }
}
