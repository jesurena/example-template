import axios from 'axios';
import { notification } from '@/components/Providers/theme-provider';

const api = axios.create({
    baseURL: process.env.LARAVEL_API_URL || 'http://localhost:8000/api',
    // withCredentials: true, uncomment this later on if you need authentication on request
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Global response interceptor for notifications
api.interceptors.response.use(
    (response) => {
        const method = response.config.method?.toUpperCase();
        const hasMessage = response.data?.message;

        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method || '') && hasMessage) {
            notification.success({
                title: 'Success',
                description: response.data.message,
                placement: 'topRight',
            });
        }
        return response;
    },
    (error) => {
        const message = error.response?.data?.message || error.message || 'Something went wrong';

        if (error.response?.status === 401) {
            const protectedRoutes = ['/dashboard', '/users'];
            const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
            const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route));

            if (isProtectedRoute && currentPath !== '/login') {
                window.location.href = '/login?clear_session=1';
            }
        } else {
            notification.error({
                title: 'Error',
                description: message,
                placement: 'topRight',
            });
        }

        return Promise.reject(error);
    }
);

export default api;
