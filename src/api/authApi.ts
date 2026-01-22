// Fake login logic
import axiosClient from './axiosClient';
import type { User } from '../interfaces/types';
import { userApi } from './userApi';

export const authApi = {
  // Hàm Login giả lập, tại mockapi ko có chức năng login
  login: async (email: string, password: string): Promise<User> => {
    const users: User[] = await userApi.getAll();

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error('Email hoặc mật khẩu không chính xác!');
    }
    localStorage.setItem('currentUser', JSON.stringify(user));

    return user;
  },
  // Hàm Logout
  logout: () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/login'; 
  },

  register: async (name: string, email: string, password: string): Promise<User> => {
    const users: User[] = await userApi.getAll();

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      throw new Error('Email already exists. Please use another email.');
    }
    const newUser: Omit<User, 'id' | 'createDate' | 'updateDate'> = {
      name,
      email,
      password,
      role: 'user', 
    };
    

    const createdUser = await userApi.create(newUser);
    return createdUser;
  }
};