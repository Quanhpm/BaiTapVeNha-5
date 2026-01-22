// User Profile - Cập nhật thông tin cá nhân

import { useState, useEffect } from 'react';
import { userApi } from '../../api/userApi';
import { uploadApi } from '../../api/uploadApi';
import type { User, UserProfileFormInput } from '../../interfaces/types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { toast } from 'sonner';
import { UserCircle, Lock, Image as ImageIcon, Save } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<UserProfileFormInput>({
    name: '',
    email: '',
  });
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get current user from localStorage
  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        fetchUserData(userData.id);
      } catch (error) {
        console.error('Error parsing user data:', error);
        toast.error('Không thể tải thông tin người dùng');
      }
    }
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      setLoading(true);
      const data = await userApi.getById(userId);
      setUser(data);
      setFormData({
        name: data.name,
        email: data.email,
        avatar: data.avatar,
      });
    } catch (error) {
      toast.error('Không thể tải thông tin người dùng');
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle avatar upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước file không được vượt quá 5MB');
      return;
    }

    try {
      setUploading(true);
      const imageUrl = await uploadApi.uploadImage(file);
      setFormData({ ...formData, avatar: imageUrl });
      toast.success('Tải ảnh lên thành công');
    } catch (error) {
      toast.error('Không thể tải ảnh lên');
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Tên không được để trống';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate password change
  const validatePasswordChange = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update profile
  const handleUpdateProfile = async () => {
    if (!user || !validateForm()) return;

    try {
      setUpdating(true);
      await userApi.updateProfile(user.id, {
        name: formData.name,
        email: formData.email,
        avatar: formData.avatar,
      });
      
      // Update localStorage
      const updatedUser = { 
        ...user, 
        name: formData.name || user.name, 
        email: formData.email || user.email, 
        avatar: formData.avatar || user.avatar 
      };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast.success('Cập nhật thông tin thành công');
    } catch (error) {
      toast.error('Không thể cập nhật thông tin');
      console.error('Error updating profile:', error);
    } finally {
      setUpdating(false);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (!user || !validatePasswordChange()) return;

    // Verify current password
    if (passwordData.currentPassword !== user.password) {
      setErrors({ currentPassword: 'Mật khẩu hiện tại không đúng' });
      return;
    }

    try {
      setUpdating(true);
      await userApi.update(user.id, { password: passwordData.newPassword });
      
      // Update localStorage
      const updatedUser = { ...user, password: passwordData.newPassword };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      toast.success('Đổi mật khẩu thành công');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Không thể đổi mật khẩu');
      console.error('Error changing password:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Đang tải...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Không tìm thấy thông tin người dùng</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f7fa] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <UserCircle size={32} />
            Thông tin cá nhân
          </h1>
          <p className="text-gray-600 mt-2">
            Quản lý thông tin và mật khẩu của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Thông tin tài khoản
            </h2>

            {/* Avatar */}
            <div className="mb-6 flex flex-col items-center">
              <div className="relative">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full object-cover border-4 border-[#007ee1]"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-[#007ee1] flex items-center justify-center border-4 border-[#007ee1]">
                    <span className="text-white text-4xl font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              
              <label className="mt-4 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  disabled={uploading}
                />
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  <ImageIcon size={16} />
                  <span className="text-sm">
                    {uploading ? 'Đang tải lên...' : 'Thay đổi ảnh đại diện'}
                  </span>
                </div>
              </label>
            </div>

            {/* Form fields */}
            <div className="space-y-4">
              <Input
                label="Tên"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
              />

              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
              />

              <Button
                variant="primary"
                onClick={handleUpdateProfile}
                disabled={updating}
                className="w-full"
              >
                <span className="flex items-center justify-center gap-2">
                  <Save size={16} />
                  {updating ? 'Đang cập nhật...' : 'Lưu thay đổi'}
                </span>
              </Button>
            </div>
          </div>

          {/* Password Change */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Lock size={20} />
              Đổi mật khẩu
            </h2>

            <div className="space-y-4">
              <Input
                label="Mật khẩu hiện tại"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
                error={errors.currentPassword}
              />

              <Input
                label="Mật khẩu mới"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                error={errors.newPassword}
              />

              <Input
                label="Xác nhận mật khẩu mới"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                error={errors.confirmPassword}
              />

              <Button
                variant="primary"
                onClick={handleChangePassword}
                disabled={updating}
                className="w-full"
              >
                <span className="flex items-center justify-center gap-2">
                  <Lock size={16} />
                  {updating ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
