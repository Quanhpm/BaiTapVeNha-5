// User - Create Post (Tạo bài viết mới với upload ảnh)

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postApi } from '../../api/postApi';
import { uploadApi } from '../../api/uploadApi';
import { slugify } from '../../utils/helpers';
import { POST_STATUS } from '../../constants';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import type { User } from '../../interfaces/types';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Get current user
  const userRaw = localStorage.getItem('currentUser');
  const currentUser: User | null = userRaw ? JSON.parse(userRaw) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('Bạn cần đăng nhập để tạo bài viết.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let imageUrl = '';
      if (imageFile) {
        imageUrl = await uploadApi.uploadImage(imageFile);
      }

      const urlTag = slugify(title);
      const postData = {
        userId: currentUser.id,
        title,
        description,
        imageUrl,
        urlTag,
        status: POST_STATUS.PENDING,
      };

      await postApi.create(postData);
      navigate('/dashboard/posts');
    } catch (err) {
      setError('Có lỗi xảy ra khi tạo bài viết. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-[#007ee1]">Tạo bài viết mới</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Tiêu đề</label>
          <Input
            type="text"
            placeholder="Nhập tiêu đề bài viết"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Nội dung</label>
          <textarea
            placeholder="Nhập nội dung bài viết"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007ee1] focus:border-transparent"
            rows={8}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Ảnh (tùy chọn)</label>
          {/* Ẩn input file và dùng label custom để kích hoạt */}
          <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors w-full">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="hidden"  // Ẩn input để tránh hiển thị "Choose File"
            />
            <span className="text-sm text-gray-700">
              {imageFile ? imageFile.name : 'Chọn ảnh...'}
            </span>
          </label>
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={loading || !title.trim() || !description.trim()}
            className="bg-[#007ee1] hover:bg-[#005bb5] text-white px-6 py-2 rounded-lg"
          >
            {loading ? 'Đang tạo...' : 'Tạo bài viết'}
          </Button>

          <Button
            type="button"
            onClick={() => navigate('/dashboard/posts')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
          >
            Hủy
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
