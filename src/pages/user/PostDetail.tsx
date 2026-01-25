// Post Detail Page
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Pencil, Loader2 } from 'lucide-react';
import type { Post, User } from '../../interfaces/types';
import { formatDate } from '../../utils/helpers';
import { postApi } from '../../api/postApi';
import { userApi } from '../../api/userApi';
import Modal from '../../components/ui/Modal';

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [author, setAuthor] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);

  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
  // Use author if provided and has name, otherwise use currentUser
  const displayName = (author && author.name) ? author.name : (currentUser.name || 'Unknown');
  const displayEmail = (author && author.email) ? author.email : (currentUser.email || 'Content Creator');
  const avatarUrl = (author && author.avatar) ? author.avatar : (currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`);

  useEffect(() => {
    if (id) {
      fetchPostDetail(id);
    }
  }, [id]);

  const fetchPostDetail = async (postId: string) => {
    try {
      setLoading(true);
      const [posts, users] = await Promise.all([
        postApi.getAll(),
        userApi.getAll(),
      ]);
      
      const foundPost = posts.find((p) => p.id === postId);
      if (foundPost) {
        setPost(foundPost);
        const foundAuthor = users.find((u) => u.id === foundPost.userId);
        setAuthor(foundAuthor || null);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/dashboard/posts');
  };

  const handleEdit = () => {
    if (post) {
      navigate(`/dashboard/edit-post/${post.id}`);
    }
  };

  const handleDeleteClick = () => {
    setDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!post) return;
    try {
      await postApi.delete(post.id);
      navigate('/dashboard/posts');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin h-12 w-12 text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-500 text-lg mb-4">Post not found</p>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
        >
          Back to Posts
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header with Back Button */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back to Posts</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Image Section */}
            <div className="w-full bg-gray-100">
              <img
                alt={post.title}
                className="w-full h-auto max-h-[500px] object-contain"
                src={post.imageUrl || 'https://via.placeholder.com/800x400?text=No+Image'}
              />
            </div>

            {/* Content Section */}
            <div className="p-8">
              {/* Date */}
              <div className="flex items-center justify-end mb-4">
                <span className="text-sm text-gray-500">{formatDate(post.createDate)}</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Author Info */}
              <div className="flex items-center mb-8 pb-6 border-b border-gray-100">
                <img
                  alt={displayName}
                  className="h-12 w-12 rounded-full object-cover mr-4 ring-2 ring-gray-100"
                  src={avatarUrl}
                />
                <div>
                  <p className="text-base font-bold text-gray-900">{displayName}</p>
                  <p className="text-sm text-gray-500">{displayEmail}</p>
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-lg text-gray-600 mb-8">
                <p className="whitespace-pre-wrap">{post.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleDeleteClick}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all font-medium shadow-sm hover:shadow group"
                >
                  <Trash2 className="w-5 h-5 mr-2 text-gray-500 group-hover:text-error transition-colors" />
                  <span>Delete</span>
                </button>
                <button
                  onClick={handleEdit}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all font-medium shadow-md hover:shadow-lg"
                >
                  <Pencil className="w-5 h-5 mr-2" />
                  <span>Edit Post</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Confirm Delete"
      >
        <div className="p-4">
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "{post.title}"?
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setDeleteModal(false)}
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

export default PostDetail;
