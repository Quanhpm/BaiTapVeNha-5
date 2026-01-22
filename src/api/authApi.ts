// Fake login logic
import axiosClient from './axiosClient';
import type { User } from '../interfaces/types';

export const authApi = {
  // Hàm Login giả lập, tại mockapi ko có chức năng login
  login: async (email: string, password: string): Promise<User> => {
    const users: User[] = await axiosClient.get('/User');

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
  }
};