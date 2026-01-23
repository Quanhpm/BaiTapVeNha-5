// Admin - User Management (CRUD Users)

import { useState, useEffect } from 'react';
import { userApi } from '../../api/userApi';
import type { User, UserFormInput } from '../../interfaces/types';
import { ROLES } from '../../constants';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import { toast } from 'sonner';
import { UserCog, Lock, Unlock, Shield, User as UserIcon, Search, Edit2, Trash2, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'role' | 'status' | 'add'>('role');
  const [newRole, setNewRole] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form state for adding new user
  const [newUserForm, setNewUserForm] = useState<UserFormInput>({
    name: '',
    email: '',
    password: '',
    role: ROLES.USER,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userApi.getAll();
      setUsers(data);
    } catch (error) {
      toast.error('Không thể tải danh sách người dùng');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Open modal for changing role
  const handleOpenRoleModal = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setModalType('role');
    setIsModalOpen(true);
  };

  // Open modal for toggling status
  const handleOpenStatusModal = (user: User) => {
    setSelectedUser(user);
    setModalType('status');
    setIsModalOpen(true);
  };

  // Open modal for adding new user
  const handleOpenAddModal = () => {
    setNewUserForm({
      name: '',
      email: '',
      password: '',
      role: ROLES.USER,
    });
    setShowPassword(false);
    setFormErrors({});
    setModalType('add');
    setIsModalOpen(true);
  };

  // Validate add user form
  const validateAddUserForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!newUserForm.name?.trim()) {
      errors.name = 'Tên không được để trống';
    }

    if (!newUserForm.email?.trim()) {
      errors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUserForm.email)) {
      errors.email = 'Email không hợp lệ';
    }

    if (!newUserForm.password) {
      errors.password = 'Mật khẩu không được để trống';
    } else if (newUserForm.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!newUserForm.role) {
      errors.role = 'Vui lòng chọn quyền';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Create new user
  const handleAddUser = async () => {
    if (!validateAddUserForm()) return;

    try {
      await userApi.create({
        ...newUserForm,
      });
      toast.success('Thêm người dùng thành công');
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error('Không thể thêm người dùng');
      console.error('Error adding user:', error);
    }
  };

  // Update user role
  const handleUpdateRole = async () => {
    if (!selectedUser) return;

    try {
      await userApi.updateRole(selectedUser.id, newRole);
      toast.success('Cập nhật quyền thành công');
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error('Không thể cập nhật quyền');
      console.error('Error updating role:', error);
    }
  };

  // Toggle user status (lock/unlock)
  const handleToggleStatus = async () => {
    if (!selectedUser) return;

    try {
      const newStatus = !selectedUser.isActive;
      await userApi.toggleUserStatus(selectedUser.id, newStatus);
      toast.success(newStatus ? 'Đã mở khóa tài khoản' : 'Đã khóa tài khoản');
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error('Không thể thay đổi trạng thái tài khoản');
      console.error('Error toggling status:', error);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-gray-700 text-center font-bold">Loading....</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f7fa] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-2">
          <p className="text-sm text-gray-500">
            <span>Home</span>
            <span className="mx-2">›</span>
            <span className="text-gray-700 font-medium">Users</span>
          </p>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            User Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage system users, view details, and handle permissions.
          </p>
        </div>

        {/* Search & Add Button */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4 flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007ee1] focus:border-transparent"
            />
          </div>
          <Button variant="primary" className="whitespace-nowrap" onClick={handleOpenAddModal}>
            + Add New User
          </Button>
        </div>

        {/* User Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Created Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.avatar ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={user.avatar}
                              alt={user.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.role === ROLES.ADMIN ? 'Administrator' : user.role === ROLES.USER ? 'User' : 'Viewer'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 mb-1">{user.email}</div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          user.isActive !== false
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-300 text-gray-800'
                        }`}
                      >
                        {user.isActive !== false ? '● VERIFIED' : '● PENDING'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(user.createDate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenRoleModal(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleOpenStatusModal(user)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title={user.isActive !== false ? 'Lock' : 'Unlock'}
                        >
                          {user.isActive !== false ? <Lock size={18} /> : <Unlock size={18} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredUsers.length)}</span> of{' '}
              <span className="font-medium">{filteredUsers.length}</span> results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              
              {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-[#007ee1] text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {totalPages > 5 && (
                <>
                  <span className="text-gray-400">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentPage === totalPages
                        ? 'bg-[#007ee1] text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm mt-4">
            <p className="text-gray-500">Không tìm thấy người dùng nào</p>
          </div>
        )}
      </div>

      {/* Modal for Add User */}
      <Modal
        isOpen={isModalOpen && modalType === 'add'}
        onClose={() => setIsModalOpen(false)}
        title="Thêm người dùng mới"
      >
        <div className="space-y-4">
          <Input
            label="Tên"
            type="text"
            placeholder="Nhập tên người dùng"
            value={newUserForm.name}
            onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
            error={formErrors.name}
          />

          <Input
            label="Email"
            type="email"
            placeholder="Nhập email"
            value={newUserForm.email}
            onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
            error={formErrors.email}
          />

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                value={newUserForm.password}
                onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                autoComplete="new-password"
                className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007ee1] ${
                  formErrors.password ? 'border-[#bc738c]' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {formErrors.password && (
              <p className="mt-1 text-sm text-[#bc738c]">{formErrors.password}</p>
            )}
          </div>

          <Select
            label="Quyền"
            value={newUserForm.role}
            onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as typeof ROLES[keyof typeof ROLES] })}
            options={[
              { value: ROLES.USER, label: 'User' },
              { value: ROLES.ADMIN, label: 'Admin' },
            ]}
            error={formErrors.role}
          />

          <div className="flex gap-2 justify-end pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleAddUser}>
              Thêm người dùng
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal for Role Change */}
      <Modal
        isOpen={isModalOpen && modalType === 'role'}
        onClose={() => setIsModalOpen(false)}
        title="Thay đổi quyền người dùng"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Người dùng: <span className="font-semibold">{selectedUser.name}</span>
              </p>
              <Select
                label="Quyền"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                options={[
                  { value: ROLES.USER, label: 'User' },
                  { value: ROLES.ADMIN, label: 'Admin' },
                ]}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Hủy
              </Button>
              <Button variant="primary" onClick={handleUpdateRole}>
                Cập nhật
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal for Status Toggle */}
      <Modal
        isOpen={isModalOpen && modalType === 'status'}
        onClose={() => setIsModalOpen(false)}
        title="Xác nhận thay đổi trạng thái"
      >
        {selectedUser && (
          <div className="space-y-4">
            <p className="text-gray-700">
              Bạn có chắc chắn muốn{' '}
              <span className="font-semibold">
                {selectedUser.isActive !== false ? 'khóa' : 'mở khóa'}
              </span>{' '}
              tài khoản của{' '}
              <span className="font-semibold">{selectedUser.name}</span>?
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Hủy
              </Button>
              <Button
                variant={selectedUser.isActive !== false ? 'danger' : 'success'}
                onClick={handleToggleStatus}
              >
                Xác nhận
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;
