// Admin Layout - Sidebar với User Management, Post Approval

import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div>
      <h1>Admin Layout</h1>
      <Outlet />
    </div>
  );
};

export default AdminLayout;
