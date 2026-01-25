# BTVN_05_TEAMS_MANAGER_POST_APP

A full-featured teams management and post publishing application built with modern web technologies.

## 📋 Project Overview

This is a small-scale web application that implements complete CRUD (Create, Read, Update, Delete) functionality along with search capabilities for managing users and posts. The application features user authentication, post management, and an admin dashboard.

## ✨ Key Features

- **User Management**: Register, login, profile management
- **Post Management**: Create, edit, delete, and view posts
- **Post Publishing Workflow**: Draft → Pending Approval → Published/Rejected
- **Admin Dashboard**: Post approval and user management
- **Search & Filter**: Find posts and users efficiently
- **Image Upload**: Support for post images and user avatars
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Form Validation**: Client-side validation using React Hook Form
- **SEO Optimization**: URL-tag support and metadata handling

## 🛠 Tech Stack

### Frontend
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing

### HTTP & API
- **Axios** - HTTP client
- **Axios Interceptors** - Request/response handling
- **MockAPI.io** - Mock backend API

### Forms & Validation
- **React Hook Form** - Efficient form state management
- **Custom Validation** - Field-level validation rules

### Additional Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking

## 📊 Data Models

### User Model
```typescript
{
  id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdDate: string;
  updatedDate: string;
}
```

### Post Model
```typescript
{
  id: string;
  userId: string;
  title: string;
  description: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  urlTag?: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  createdDate: string;
  updatedDate: string;
}
```

## 🏗 Project Structure

```
src/
├── api/              # API clients and axios configuration
│   ├── authApi.ts
│   ├── axiosClient.ts
│   ├── postApi.ts
│   ├── uploadApi.ts
│   └── userApi.ts
├── assets/           # Static assets
├── components/       # Reusable React components
│   ├── layouts/      # Page layouts
│   ├── private/      # Protected route components
│   └── ui/           # UI components (buttons, inputs, modals, etc.)
├── constants/        # Application constants
├── interfaces/       # TypeScript type definitions
├── pages/            # Page components
│   ├── admin/        # Admin pages (post approval, user management)
│   └── user/         # User pages (profile, posts, etc.)
├── utils/            # Helper functions
├── App.tsx           # Main application component
└── main.tsx          # Application entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd BaiTapVeNha-5
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment variables** (if needed)
```bash
cp .env.example .env.local
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## 📝 Features in Detail

### 1. Authentication
- User registration with validation
- Login with JWT token handling
- Protected routes for authenticated users
- Admin-only routes for administrative functions

### 2. Post Management
- Create posts with title, description, content
- Upload post images and embed videos
- Edit existing posts (owned posts only)
- Delete posts (owned posts only)
- Save as draft or submit for approval
- View post details with metadata

### 3. Admin Panel
- **Post Approval**: Review pending posts and approve/reject
- **User Management**: View and manage user accounts
- Access control and role-based permissions

### 4. User Profile
- View and edit user information
- Change password
- View post creation history
- Track post statuses

### 5. Search & Discovery
- Search posts by title or content
- Filter posts by status or author
- Pagination for large datasets

## 🔌 API Integration

This project uses **MockAPI.io** for the backend:
- Base URL: `https://mockapi.io/api/v1/`
- Two main resources: `users` and `posts`
- Full REST API support

### Axios Configuration
- Request/response interceptors for error handling
- Automatic token injection in headers
- Error logging and handling

## 🎨 UI/UX

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dashboard Layout**: Professional admin interface
- **User Layout**: Intuitive user-facing interface
- **Modal Dialogs**: Confirmation dialogs and forms
- **Form Components**: Reusable input, select, and upload components
- **Badges**: Status indicators for posts and users

## ✅ Validation

- **Email validation**: Format checking
- **Password requirements**: Strength validation
- **Required fields**: Mandatory field validation
- **File upload**: Image type and size validation
- **URL validation**: For SEO tags and video URLs

## 📱 Responsive Design

The application is fully responsive and tested on:
- Desktop (1920px and above)
- Laptop (1280px - 1919px)
- Tablet (768px - 1279px)
- Mobile (320px - 767px)

## 🌐 Deployment

### Deploy to Vercel

1. **Push code to GitHub**
```bash
git push origin main
```

2. **Connect to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Select your repository
   - Configure build settings:
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Click "Deploy"

3. **Set Environment Variables** (if needed)
   - Add environment variables in Vercel dashboard
   - Redeploy to apply changes

## 📚 Component Overview

### Layouts
- **AuthLayout**: For login/register pages
- **UserLayout**: For user dashboard and posts
- **AdminLayout**: For admin panel
- **DashboardLayout**: For main dashboard views

### UI Components
- **Button**: Primary, secondary, danger variants
- **Input**: Text input with validation states
- **Modal**: Reusable modal dialog
- **PostCard**: Post preview component
- **ImageUploader**: Image upload with preview
- **Badge**: Status and category badges
- **FloatingActionButton**: Quick action button

## 🔒 Security

- HTTPS API calls
- Request interceptors for token management
- Protected routes with role-based access
- Input sanitization and validation
- Secure password storage (mock API)

## 📝 Code Standards

- TypeScript for type safety
- ESLint for code quality
- Component-based architecture
- Custom hooks for reusable logic
- Proper error handling and logging

## 🐛 Known Limitations

- Mock API (MockAPI.io) is not persistent across sessions
- Image uploads stored on mock API are temporary
- No real-time notifications
- Single-user session (no multi-device support)

## 🤝 Contributing

When contributing to this project:
1. Follow the existing code structure
2. Use TypeScript for all new code
3. Run ESLint before committing: `npm run lint`
4. Test responsive design on multiple devices
5. Update this README with any new features

## 📄 License

This project is created for educational purposes as part of a coding assignment.

## 👤 Author

[Your Name/Team Name]

## 📞 Support

For issues or questions, please open an issue in the repository.

---

**Last Updated**: January 2026  
**Version**: 1.0.0