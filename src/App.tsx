import { Routes, Route } from 'react-router-dom';
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
import EditPost from './pages/user/EditPost';
import MyPosts from './pages/user/MyPosts';
import PostDetail from './pages/user/PostDetail';
import Profile from './pages/user/Profile';

function App() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />


      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="posts" element={<MyPosts />} />
          <Route path="posts/:id" element={<PostDetail />} />
          <Route path="create-post" element={<CreatePost />} />
          <Route path="edit-post/:id" element={<EditPost />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>


      <Route element={<PrivateRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route path="/dashboard/users" element={<UserManagement />} />
        <Route path="/dashboard/post-approval" element={<PostApproval />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;