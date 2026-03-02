import api from './api';
import type { User, LoginCredentials, RegisterData } from '../types';

export const authService = {
    login: async (credentials: LoginCredentials) => {
        // CSRF cookie for Sanctum
        await api.get('/csrf-cookie', { baseURL: 'http://localhost:8000/sanctum' });
        const response = await api.post<{ user: User, token: string }>('/login', credentials);
        return response.data;
    },
    register: async (data: RegisterData) => {
        const response = await api.post<{ user: User, token: string }>('/register', data);
        return response.data;
    },
    logout: async () => {
        await api.post('/logout');
    },
    getMe: async (): Promise<User> => {
        const response = await api.get<User>('/me');
        return response.data;
    }
};
