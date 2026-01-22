// Private Route component - check role
import { Navigate, Outlet } from 'react-router-dom';
import { ROLES } from '../../constants';
import type { User } from '../../interfaces/types';

interface PrivateRouteProps {
  allowedRoles?: string[]; // Danh sách các role được phép vào (vd: ['admin'])
}

const PrivateRoute = ({ allowedRoles }: PrivateRouteProps) => {
  // 1. Lấy thông tin user từ localStorage
  const userRaw = localStorage.getItem('currentUser');
  const currentUser: User | null = userRaw ? JSON.parse(userRaw) : null;

  // 2. Nếu chưa đăng nhập -> Đá về trang Login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // 3. Nếu có yêu cầu Role cụ thể mà User không đủ quyền -> Đá về trang Dashboard (hoặc 404)
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // 4. Nếu mọi thứ OK -> Cho phép vào (hiển thị các component con)
  return <Outlet />;
};

export default PrivateRoute;