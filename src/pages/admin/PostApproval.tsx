// Admin - Post Approval (Xem và duyệt bài viết)

import { useState, useEffect } from 'react';
import { postApi } from '../../api/postApi';
import { formatDate } from '../../utils/helpers';
import { POST_STATUS } from '../../constants';
import Button from '../../components/ui/Button';
import type { Post } from '../../interfaces/types';

const PostApproval = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await postApi.getAll();
        const pendingPosts = allPosts.filter(post => post.status === POST_STATUS.PENDING);
        setPosts(pendingPosts);
      } catch (err) {
        setError('Không thể tải bài viết.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleApprove = async (postId: string) => {
    try {
      await postApi.update(postId, { status: POST_STATUS.PUBLISHED });
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      setError('Không thể duyệt bài viết.');
      console.error(err);
    }
  };

  const handleReject = async (postId: string) => {
    if (!window.confirm('Bạn có chắc muốn từ chối bài viết này?')) return;

    try {
      // Hàm delete
      await postApi.delete(postId);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      setError('Không thể từ chối bài viết.');
      console.error(err);
    }
  };

  if (loading) return <div className="text-center p-6">Đang tải...</div>;
  if (error) return <div className="text-center p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#007ee1]">Duyệt bài viết</h1>

      {posts.length === 0 ? (
        <p className="text-gray-600">Không có bài viết nào chờ duyệt.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white p-4 rounded-lg shadow-md border">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
                  <p className="text-gray-600 mb-2 line-clamp-2">{post.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Người tạo: {post.userId}</span>
                    <span>Ngày tạo: {formatDate(post.createDate)}</span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={() => handleApprove(post.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-sm"
                  >
                    Duyệt
                  </Button>
                  <Button
                    onClick={() => handleReject(post.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm"
                  >
                    Từ chối
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

export default PostApproval;
