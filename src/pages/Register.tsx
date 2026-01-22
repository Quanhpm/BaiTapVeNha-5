// Register page

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../api/userApi';
import type {RegisterFormData} from '../interfaces/types';
import { authApi } from '../api/authApi';

// Define form data type


const Register = () => {
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm<RegisterFormData>();

  const password = watch("password");

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    setLoading(true);
    setServerError('');
    
    try {
      await authApi.register(data.name, data.email, data.password);
      
      console.log('Register success');
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error: unknown) {
      console.error('Register error:', error);
    
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden bg-background">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-10 px-6 shadow-soft sm:rounded-2xl sm:px-10 border border-slate-100 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Account Created!</h2>
            <p className="text-slate-600 mb-4">Your account has been successfully created.</p>
            <p className="text-sm text-slate-500">Redirecting to login page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
            </svg>
          </div>
        </div>

        {/* Page Heading */}
        <div className="text-center">
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Join us and start managing your content.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-10 px-6 shadow-soft sm:rounded-2xl sm:px-10 border border-slate-100">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium leading-6 text-slate-900">Full Name</label>
              <div className="mt-2">
                <input
                  {...register("name", { 
                    required: "Name is required",
                    minLength: { value: 2, message: "Name must be at least 2 characters" }
                  })}
                  type="text"
                  placeholder="John Doe"
                  className={`block w-full rounded-xl border-0 py-3.5 px-4 text-slate-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all ${
                    errors.name ? 'ring-error' : 'ring-slate-200'
                  }`}
                />
                {errors.name && <p className="mt-2 text-xs text-error">{errors.name.message as string}</p>}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium leading-6 text-slate-900">Email Address</label>
              <div className="mt-2">
                <input
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Please enter a valid email"
                    }
                  })}
                  type="email"
                  placeholder="john@example.com"
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

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium leading-6 text-slate-900">Confirm Password</label>
              <div className="mt-2">
                <input
                  {...register("confirmPassword", { 
                    required: "Please confirm your password",
                    validate: value => value === password || "Passwords do not match"
                  })}
                  type="password"
                  placeholder="••••••••"
                  className={`block w-full rounded-xl border-0 py-3.5 px-4 text-slate-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all ${
                    errors.confirmPassword ? 'ring-error' : 'ring-slate-200'
                  }`}
                />
                {errors.confirmPassword && <p className="mt-2 text-xs text-error">{errors.confirmPassword.message as string}</p>}
              </div>
            </div>

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
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <a href="/login" className="font-semibold text-primary hover:text-primary-hover transition-colors">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
