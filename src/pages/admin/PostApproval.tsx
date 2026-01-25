import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import type { Post } from '../../interfaces/types';
import { postApi } from '../../api/postApi';
import { formatDate } from '../../utils/helpers';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';

const PostApproval = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [authorFilter, setAuthorFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const itemsPerPage = 10;

  // Fetch posts
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await postApi.getAll();
      setPosts(data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách bài viết');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique authors from posts
  const authors = Array.from(
    new Set(posts.map((post) => post.userId))
  ).map((userId) => ({
    value: userId,
    label: `Author ${userId}`,
  }));

  // Filter and search posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.urlTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || post.status === statusFilter;
    const matchesAuthor =
      authorFilter === 'all' || post.userId === authorFilter;
    return matchesSearch && matchesStatus && matchesAuthor;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPosts = filteredPosts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Handle delete
  const handleDeleteClick = (post: Post) => {
    setSelectedPost(post);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedPost) return;

    try {
      await postApi.delete(selectedPost.id);
      setPosts(posts.filter((p) => p.id !== selectedPost.id));
      toast.success('Xóa bài viết thành công');
      setShowDeleteModal(false);
      setSelectedPost(null);
    } catch (error) {
      toast.error('Lỗi khi xóa bài viết');
      console.error(error);
    }
  };

  // Handle status change
  const handleStatusClick = (post: Post) => {
    setSelectedPost(post);
    setSelectedStatus(post.status);
    setShowStatusModal(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedPost || !selectedStatus) return;

    try {
      const updatedPost = await postApi.update(selectedPost.id, {
        ...selectedPost,
        status: selectedStatus as 'draft' | 'published' | 'pending',
      });
      setPosts(posts.map((p) => (p.id === selectedPost.id ? updatedPost : p)));
      toast.success(`Cập nhật trạng thái thành ${selectedStatus}`);
      setShowStatusModal(false);
      setSelectedPost(null);
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
      console.error(error);
    }
  };

  // Get status badge color and label
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return { bg: '#10b981', text: 'Published' };
      case 'draft':
        return { bg: '#6366f1', text: 'Draft' };
      default:
        return { bg: '#6b7280', text: status };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Post Management</h1>
        <p className="text-gray-600 mt-2">
          Manage, create, and edit your content efficiently.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-sm flex flex-col md:flex-row md:items-end gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <Input
            placeholder="Search by title, slug or tag..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-48">
          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="pending">Review</option>
          </Select>
        </div>

        {/* Authors Filter */}
        <div className="w-full md:w-48">
          <Select
            value={authorFilter}
            onChange={(e) => {
              setAuthorFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Authors</option>
            {authors.map((author) => (
              <option key={author.value} value={author.value}>
                {author.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Results Info */}
      <div className="text-sm text-gray-600 mb-4">
        Showing {paginatedPosts.length > 0 ? startIndex + 1 : 0} to{' '}
        {Math.min(startIndex + itemsPerPage, filteredPosts.length)} of{' '}
        {filteredPosts.length} posts
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg overflow-hidden shadow-sm">
        {paginatedPosts.length === 0 ? (
          <div className="p-8 text-center">
            <AlertCircle size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">No posts found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    POST DETAILS
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    AUTHOR
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    STATUS
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    DATE
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedPosts.map((post) => {
                  const statusInfo = getStatusColor(post.status);
                  return (
                    <tr
                      key={post.id}
                      className="border-b hover:bg-blue-50 transition-colors"
                    >
                      {/* Post Details */}
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-4">
                          {/* Thumbnail */}
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-12 h-12 rounded object-cover shrink-0"
                          />
                          {/* Title and Slug */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">
                              {post.title}
                            </h3>
                            <p className="text-sm text-gray-500 truncate">
                              /{post.urlTag}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Author */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {post.userId}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleStatusClick(post)}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-80"
                          style={{
                            backgroundColor: statusInfo.bg,
                          }}
                        >
                          {statusInfo.text}
                        </button>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {formatDate(post.createDate)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleDeleteClick(post)}
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination - Page Navigation */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
              Previous Page
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next Page
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedPost(null);
        }}
        title="Confirm delete post"
      >
        <div className="mb-6">
          <p className="text-gray-700">
            Are you sure you want to delete the post{' '}
            <strong>"{selectedPost?.title}"</strong>? This action cannot be undone.
          </p>
        </div>
        <div className="flex gap-3 justify-end">
          <Button
            onClick={() => {
              setShowDeleteModal(false);
              setSelectedPost(null);
            }}
            variant="outline"
          >
            Cancel
          </Button>
          <Button onClick={confirmDelete} variant="danger">
            Delete
          </Button>
        </div>
      </Modal>

      {/* Status Change Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setSelectedPost(null);
        }}
        title="Change post status"
      >
        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            Select new status for post <strong>"{selectedPost?.title}"</strong>:
          </p>
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">-- Select status --</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </Select>
        </div>
        <div className="flex gap-3 justify-end">
          <Button
            onClick={() => {
              setShowStatusModal(false);
              setSelectedPost(null);
            }}
            variant="outline"
          >
            Cancel
          </Button>
          <Button onClick={confirmStatusChange} disabled={!selectedStatus}>
            Update
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default PostApproval;
