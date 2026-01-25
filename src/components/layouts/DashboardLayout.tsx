// Dashboard Layout - Sidebar, Header, Content Area

import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { 
  FileText, 
  PlusCircle, 
  UserCircle, 
  UserCog, 
  CheckCircle, 
  LogOut, 
  Menu,
  X
} from 'lucide-react';
import { ROLES } from '../../constants';
import type { User } from '../../interfaces/types';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Get current user from localStorage
  const userRaw = localStorage.getItem('currentUser');
  const currentUser: User | null = userRaw ? JSON.parse(userRaw) : null;

  const isAdmin = currentUser?.role === ROLES.ADMIN;

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard/posts', label: 'Bài viết của tôi', icon: FileText, allowedRoles: [ROLES.USER, ROLES.ADMIN] },
    { path: '/dashboard/create-post', label: 'Tạo bài viết', icon: PlusCircle, allowedRoles: [ROLES.USER, ROLES.ADMIN] },
    { path: '/dashboard/profile', label: 'Thông tin cá nhân', icon: UserCircle, allowedRoles: [ROLES.USER, ROLES.ADMIN] },
    { path: '/dashboard/users', label: 'Quản lý người dùng', icon: UserCog, allowedRoles: [ROLES.ADMIN] },
    { path: '/dashboard/post-approval', label: 'Duyệt bài viết', icon: CheckCircle, allowedRoles: [ROLES.ADMIN] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    currentUser?.role && item.allowedRoles.includes(currentUser.role)
  );

  return (
    <div className="flex min-h-screen bg-[#f3f7fa]">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-lg shadow-lg"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen w-64 bg-white shadow-lg z-40 transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-[#007ee1]">Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">
              {isAdmin ? 'Quản trị viên' : 'Người dùng'}
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {filteredMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                        ${isActive 
                          ? 'bg-[#007ee1] text-white shadow-md' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-3 px-4 py-2">
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#007ee1] flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {currentUser?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {currentUser?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {currentUser?.email}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#bc738c] hover:bg-red-50 transition-all duration-200"
            >
              <LogOut size={20} />
              <span className="font-medium">Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
