import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'; 
import { authApi } from '../api/authApi';
import type { LoginFormData } from '../interfaces/types';

const Login = () => {
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormData>();

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setLoading(true);
    setServerError('');
    
    try {
      const user = await authApi.login(data.email, data.password);
      console.log('Login success:', user);
      if (user.role === 'admin') {
        navigate('/dashboard/users');
      } else {
        navigate('/dashboard/posts');
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      if (error instanceof Error) {
    setServerError(error.message);
  } else {
    setServerError('Email hoặc mật khẩu không chính xác!');
  }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden bg-background font-sans">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-slate-500">Enter your credentials to access the dashboard.</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-10 px-6 shadow-soft sm:rounded-2xl sm:px-10 border border-slate-100">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium leading-6 text-slate-900">Email Address</label>
              <div className="mt-2">
                <input
                  {...register("email", { required: "Email is required" })}
                  type="email"
                  placeholder="admin@example.com"
                  className={`block w-full rounded-xl border-0 py-3.5 px-4 text-slate-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all ${
                    errors.email ? 'ring-error' : 'ring-slate-200'
                  }`}
                />
                {errors.email && <p className="mt-2 text-xs text-error">{errors.email.message as string}</p>}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium leading-6 text-slate-900">Password</label>
              <div className="mt-2">
                <input
                  {...register("password", { 
                    required: "Password is required", 
                    minLength: { value: 6, message: "Password must be at least 6 characters" } 
                  })}
                  type="password"
                  placeholder="••••••••"
                  className={`block w-full rounded-xl border-0 py-3.5 px-4 text-slate-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all ${
                    errors.password ? 'ring-error' : 'ring-slate-200'
                  }`}
                />
                {errors.password && <p className="mt-2 text-xs text-error">{errors.password.message as string}</p>}
              </div>
            </div>

            {/* Thông báo lỗi từ server/logic login */}
            {serverError && (
              <div className="p-3 rounded-lg bg-error/10 border border-error/20">
                <p className="text-sm text-error text-center font-medium">{serverError}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-xl bg-primary px-3 py-3.5 text-sm font-bold leading-6 text-white shadow-sm hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>

          {/* Sign up link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Don't have an account?{' '}
              <a href="/register" className="font-semibold text-primary hover:text-primary-hover transition-colors">
                Sign up
              </a>
            </p>
          </div>

          <div className="mt-8 text-center text-xs text-slate-400">
            <p>Admin: admin@example.com / admin123</p>
            <p>User: user@example.com / user123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;