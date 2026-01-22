// CRUD Users
import axiosClient from './axiosClient';
import type { User, UserFormInput } from '../interfaces/types';

export const userApi = {
  getAll: (): Promise<User[]> => {
    return axiosClient.get('/users');
  },

  getById: (id: string): Promise<User> => {
    return axiosClient.get(`/users/${id}`);
  },

  create: (data: UserFormInput): Promise<User> => {
    return axiosClient.post('/users', data);
  },

  update: (id: string, data: Partial<User>): Promise<User> => {
    return axiosClient.put(`/users/${id}`, data);
  },

  delete: (id: string): Promise<void> => {
    return axiosClient.delete(`/users/${id}`);
  },
};