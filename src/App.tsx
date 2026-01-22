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
import MyPosts from './pages/user/MyPosts';

function App() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

    
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
           <Route path="posts" element={<MyPosts />} />
           <Route path="create-post" element={<CreatePost />} />
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