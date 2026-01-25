// User - My Posts (Xem bài viết của mình)
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { postApi } from '../../api/postApi';
import { userApi } from '../../api/userApi';
import type { Post, User } from '../../interfaces/types';
import PostCard from '../../components/ui/PostCard';
import FloatingActionButton from '../../components/ui/FloatingActionButton';
import Modal from '../../components/ui/Modal';

const MyPosts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; post: Post | null }>({
    open: false,
    post: null,
  });

  // Lấy userId từ localStorage (giả sử đã đăng nhập)
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserId = currentUser?.id;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [postsData, usersData] = await Promise.all([
        postApi.getAll(),
        userApi.getAll(),
      ]);

      // Lọc bài viết của user hiện tại
      const myPosts = currentUserId
        ? postsData.filter((post) => post.userId === currentUserId)
        : postsData;

      setPosts(myPosts);
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserById = (userId: string): User | undefined => {
    return users.find((user) => user.id === userId);
  };

  const handleClick = (post: Post) => {
    navigate(`/dashboard/posts/${post.urlTag}`);
  };

  const handleEdit = (post: Post) => {
    navigate(`/dashboard/edit-post/${post.id}`);
  };

  const handleDeleteClick = (post: Post) => {
    setDeleteModal({ open: true, post });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.post) return;

    try {
      await postApi.delete(deleteModal.post.id);
      setPosts((prev) => prev.filter((p) => p.id !== deleteModal.post!.id));
      setDeleteModal({ open: false, post: null });
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ open: false, post: null });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-12 w-12 text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      <main className="flex-1 overflow-y-auto p-8 pt-2">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Posts</h1>
        </div>

        {/* Post Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">You don't have any posts yet.</p>
            <button
              onClick={() => navigate('/dashboard/create-post')}
              className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
            >
              Create your first post
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                author={getUserById(post.userId)}
                onClick={handleClick}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <FloatingActionButton to="/dashboard/create-post" title="Create new post" />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={handleDeleteCancel}
        title="Confirm Delete"
      >
        <div className="p-4">
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete the post "{deleteModal.post?.title}"?
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleDeleteCancel}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 text-white bg-error rounded-lg hover:opacity-90 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyPosts;
