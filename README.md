# 📑 QUY ĐỊNH PHÁT TRIỂN DỰ ÁN (PROJECT GUIDELINES)

Dưới đây là các quy tắc **bắt buộc** dành cho tất cả thành viên trong nhóm để đảm bảo code đồng nhất và không xảy ra xung đột khi ghép (merge).

---

### 🛠 1. Cấu hình môi trường (Environment Setup)

> **Hành động:** Vì là project nhỏ nên t không sử dụng `.gitignore` cho file env. T đã tạo sẵn API trên MockAPI để ae sử dụng, đường dẫn nằm trong file `.env`.

- **VITE_API_URL**: Link API chung của nhóm trên MockAPI.
- **VITE*CLOUDINARY*...**: Thông tin cấu hình ảnh dùng chung. Ai đảm nhiệm phần **Post** thì dùng Cloudinary để tạo URL cho image.

---

### 🎨 2. Design System (Màu sắc & Font chữ)

#### **Font chữ:**

- **Primary Font**: `DM Sans` (đã config sẵn trong `index.css`)
- Import từ Google Fonts

#### **Icon:**
- **Lucide React Icon**: sử dụng icon của lucide react, đã tải sẵn 
#### **Alert:**
- **Lucide React Icon**: sử dụng alert của sonner (giống toastify), đã tải sẵn 
#### **Bảng màu chủ đạo:**

| Tên                     | Mã màu    | Sử dụng cho                |
| ----------------------- | --------- | -------------------------- |
| **Primary (Highlight)** | `#007ee1` | Button, Link, Active state |
| **Error**               | `#bc738c` | Error message, Validation  |
| **Background**          | `#f3f7fa` | Background, Card, Section  |

> **Lưu ý:** Các màu này đã được định nghĩa sẵn trong `src/constants/colors.ts`. Sử dụng constant thay vì hardcode màu trực tiếp.

---

### 🏗 3. Quy tắc TypeScript (Strict Mode)

Dự án sử dụng chế độ **Verbatim Module Syntax**. Đây là nguyên nhân gây lỗi nếu bạn không tuân thủ:

- **Import Kiểu dữ liệu:** Luôn luôn thêm từ khóa **`type`**.
  - ✅ **Đúng:** `import type { User, Post } from '../../interfaces/types';`
  - ❌ **Sai:** `import { User, Post } from '../../interfaces/types';`
- **Dữ liệu Form:** Khi làm trang **Tạo mới/Chỉnh sửa**, chỉ được dùng `PostFormInput` hoặc `UserFormInput`.
  - ⚠️ **Lưu ý:** Tuyệt đối không dùng interface `Post` gốc vì nó bắt buộc có `id`, điều này sẽ gây lỗi khi bạn gửi form tạo mới lên Server.

---

### 📡 4. Quản lý API (API Layer)

Để code sạch và dễ bảo trì, chúng ta tuân thủ quy tắc **Centralized API**:

1.  **Tuyệt đối không** dùng `axios` trực tiếp trong các Component.
2.  **Sử dụng Services:** Chỉ gọi thông qua các object đã khai báo sẵn như `postApi`, `userApi`, `authApi`.
3.  **Xử lý lỗi:** Luôn bọc trong khối **`try...catch`** để xử lý các lỗi như mất mạng hoặc sai tài khoản.

---

### 🔐 5. Phân quyền & Bảo mật (Auth)

Dự án bảo vệ các trang Admin thông qua hệ thống **Route Guard** (xem chi tiết tại `PrivateRoute.tsx` và `App.tsx`).

| Trang (Page)          | Quyền truy cập (Allowed Roles) | Trạng thái     |
| :-------------------- | :----------------------------- | :------------- |
| **Login / Register**  | Công khai (Public)             | Mọi người      |
| **Dashboard / Posts** | `['admin', 'user']`            | Phải đăng nhập |
| **User Management**   | `['admin']`                    | **Chỉ Admin**  |

- **PrivateRoute:** Thành phần này sẽ tự động đá người dùng về trang Login nếu chưa có thông tin trong `localStorage`.

---

### 🌳 Cấu trúc Routes

| Route                      | Component      | Role Required |
| -------------------------- | -------------- | ------------- |
| `/login`                   | Login          | Public        |
| `/register`                | Register       | Public        |
| `/dashboard/posts`         | MyPosts        | User/Admin    |
| `/dashboard/create-post`   | CreatePost     | User/Admin    |
| `/dashboard/users`         | UserManagement | Admin only    |
| `/dashboard/post-approval` | PostApproval   | Admin only    |

### 🎨 6. Quy hoạch Layout & Giao diện

Chúng ta sử dụng cấu trúc **Nested Routes** để tối ưu trải nghiệm người dùng:

- **Layout:** Chứa Sidebar và Header cố định. Khi làm code giao diện, nhớ đặt trang vào trong Layout để Header và Sidebar bọc bên ngoài.
- **Outlet:** Là "khoảng trống" hiển thị nội dung các trang con. Khi code trang con, **không cần** thêm lại Sidebar hay Header vào file đó (Ví dụ: Trang post sẽ hiển thị thông qua `Outlet` bên trong layout).
- **Tailwind CSS:** Sử dụng các class của **Tailwind v4**. Đảm bảo giao diện có tính phản hồi (**Responsive**) cho cả Mobile và Desktop.

---

### 📁 6. Cấu trúc thư mục chuẩn

| Thư mục            | Nội dung                                                                         |
| :----------------- | :------------------------------------------------------------------------------- |
| **src/api**        | Các file gọi API (Auth, Posts, Users, Upload).                                   |
| **src/interfaces** | Định nghĩa **Interface/Type** toàn dự án.                                        |
| **src/constants**  | Lưu các biến cố định như **Roles**, **Status**.                                  |
| **src/utils**      | Các hàm bổ trợ (Format Date, Slugify - dùng cho url-tag tại `utils/helpers.ts`). |
| **src/components** | Các UI Component dùng chung.                                                     |

---

⚠️ **LƯU Ý QUAN TRỌNG:**

> ae **không tự ý chỉnh sửa** nội dung trong thư mục `api/` và `interfaces/`. Mọi thay đổi về cấu trúc dữ liệu hoặc cài đặt thêm thư viện mới phải được thông qua bởi **Nhóm trưởng**.

### **🔑 MockAPI Credentials** (Thông tin đăng nhập test)

```markdown
🔑 Tài khoản test
Để test các tính năng, sử dụng tài khoản sau:

**Admin:**

- Email: `admin@gmail.com`
- Password: `admin123`

**User:**

- Email: `user@gmail.com`
- Password: `user123`
```

//Author: Pham Quoc Anh
