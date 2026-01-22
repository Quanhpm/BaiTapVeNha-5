// CRUD Users
import axiosClient from './axiosClient';
import type { User, UserFormInput, UserProfileFormInput } from '../interfaces/types';

export const userApi = {
  getAll: (): Promise<User[]> => {
    return axiosClient.get('/User');
  },

  getById: (id: string): Promise<User> => {
    return axiosClient.get(`/User/${id}`);
  },

  create: (data: UserFormInput): Promise<User> => {
    return axiosClient.post('/User', data);
  },

  update: (id: string, data: Partial<User>): Promise<User> => {
    return axiosClient.put(`/User/${id}`, data);
  },

  delete: (id: string): Promise<void> => {
    return axiosClient.delete(`/User/${id}`);
  },

  // Cập nhật role của user (admin only)
  updateRole: (id: string, role: string): Promise<User> => {
    return axiosClient.put(`/User/${id}`, { role });
  },

  // Khóa/mở khóa tài khoản (admin only)
  toggleUserStatus: (id: string, isActive: boolean): Promise<User> => {
    return axiosClient.put(`/User/${id}`, { isActive });
  },

  // Cập nhật profile (user/admin)
  updateProfile: (id: string, data: UserProfileFormInput): Promise<User> => {
    return axiosClient.put(`/User/${id}`, data);
  },
};