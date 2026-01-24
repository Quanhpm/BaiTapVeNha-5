import { Routes, Route, Navigate } from 'react-router-dom';
import { ROLES } from './constants';
// Import layouts
import DashboardLayout from './components/layouts/DashboardLayout';
import PrivateRoute from './components/private/PrivateRoute';
// Import pages
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
// Import admin pages
import UserManagement from './pages/admin/UserManagement';
import PostApproval from './pages/admin/PostApproval';
// Import user pages
import CreatePost from './pages/user/CreatePost';
import MyPosts from './pages/user/MyPosts';
import Profile from './pages/user/Profile';

function App() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />


      {/* Protected routes */}
      <Route element={<PrivateRoute />}>
        {/* DashboardLayout bọc TẤT CẢ route con trong /dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* vào /dashboard thì tự chuyển sang /dashboard/posts */}
          <Route index element={<Navigate to="posts" replace />} />

          {/* User routes */}
          <Route path="posts" element={<MyPosts />} />
          <Route path="create-post" element={<CreatePost />} />
          <Route path="profile" element={<Profile />} />

          {/* Admin routes trong DashboardLayout - chặn role !! */}
          <Route element={<PrivateRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route path="users" element={<UserManagement />} />
            <Route path="post-approval" element={<PostApproval />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;