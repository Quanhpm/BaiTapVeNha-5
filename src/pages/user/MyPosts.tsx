// User - My Posts (Xem và quản lý bài viết của mình)

import { useState, useEffect } from 'react';
import { postApi } from '../../api/postApi';
import { formatDate } from '../../utils/helpers';
import { POST_STATUS } from '../../constants';
import Button from '../../components/ui/Button';
import type { Post, User } from '../../interfaces/types';

const MyPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get current user
  const userRaw = localStorage.getItem('currentUser');
  const currentUser: User | null = userRaw ? JSON.parse(userRaw) : null;

  const getStatusClass = (status: string) => {
    switch (status) {
      case POST_STATUS.PUBLISHED:
        return 'text-green-600';
      case POST_STATUS.PENDING:
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      if (!currentUser) return;

      try {
        const allPosts = await postApi.getAll();
        const userPosts = allPosts.filter(post => post.userId === currentUser.id);
        setPosts(userPosts);
      } catch (err) {
        setError('Không thể tải bài viết.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentUser]);

  const handleDelete = async (postId: string) => {
    if (!globalThis.confirm('Bạn có chắc muốn xóa bài viết này?')) return;

    try {
      await postApi.delete(postId);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      setError('Không thể xóa bài viết.');
      console.error(err);
    }
  };

  const handleEdit = (postId: string) => {
    // Tạm thời alert, có thể navigate to edit page sau
    alert(`Chỉnh sửa bài viết ${postId} - Chức năng đang phát triển.`);
  };

  if (loading) return <div className="text-center p-6">Đang tải...</div>;
  if (error) return <div className="text-center p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#007ee1]">Bài viết của tôi</h1>

      {posts.length === 0 ? (
        <p className="text-gray-600">Bạn chưa có bài viết nào.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white p-4 rounded-lg shadow-md border">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
                  <p className="text-gray-600 mb-2 line-clamp-2">{post.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Trạng thái: <span className={`font-medium ${getStatusClass(post.status)}`}>{post.status}</span></span>
                    <span>Ngày tạo: {formatDate(post.createDate)}</span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={() => handleEdit(post.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-sm"
                  >
                    Sửa
                  </Button>
                  <Button
                    onClick={() => handleDelete(post.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm"
                  >
                    Xóa
                  </Button>
                </div>
              </div>
              {post.imageUrl && (
                <img src={post.imageUrl} alt={post.title} className="mt-4 w-full h-48 object-cover rounded" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPosts;
