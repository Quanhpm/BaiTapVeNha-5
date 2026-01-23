
import { ROLES, POST_STATUS } from '../constants';

// Tạo Type từ các hằng số, cái này bên file constants/index.ts, ae qua đó coi
export type Role = typeof ROLES[keyof typeof ROLES];
export type PostStatus = typeof POST_STATUS[keyof typeof POST_STATUS];

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  avatar?: string;     // Avatar URL
  isActive?: boolean;  // Trạng thái tài khoản (true: active, false: locked)
  createDate: string;
  updateDate: string;
}

export interface Post {
  id: string;
  userId: string;   
  title: string;
  description: string;
  imageUrl: string;    // URL từ Cloudinary
  urlTag: string;      // SEO Slug (ví dụ: 'bai-viet-moi')
  status: PostStatus;
  createDate: string;
  updateDate: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}
export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Kiểu dữ liệu khi dùng React Hook Form để tạo mới bài viết hoặc user
// tạo nhma ko cần nhập mấy cái dữ liệu trong Omit, lên mockapi nó tự tạo cho (không cần id và date)
export type PostFormInput = Omit<Post, 'id' | 'createDate' | 'updateDate'>;
export type UserFormInput = Omit<User, 'id' | 'createDate' | 'updateDate'>;

// Kiểu dữ liệu cho form cập nhật profile
export interface UserProfileFormInput {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  avatar?: string;
}