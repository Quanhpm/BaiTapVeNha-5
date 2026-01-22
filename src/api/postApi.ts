// CRUD Posts
import type { Post, PostFormInput } from '../interfaces/types';
import axiosClient from './axiosClient';

export const postApi = {
  getAll: (): Promise<Post[]> => {
    return axiosClient.get('/posts');
  },

  create: (data: PostFormInput): Promise<Post> => {
    return axiosClient.post('/posts', data);
  },

  update: (id: string, data: Partial<Post>): Promise<Post> => {
    return axiosClient.put(`/posts/${id}`, data);
  },

  delete: (id: string): Promise<void> => {
    return axiosClient.delete(`/posts/${id}`);
  },
};