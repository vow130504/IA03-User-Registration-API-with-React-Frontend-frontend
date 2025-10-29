import React, { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from 'react-router-dom';
import { useForm, type SubmitHandler, type UseFormRegisterReturn } from 'react-hook-form';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from '@tanstack/react-query';

// Backend API base (configure VITE_API_BASE in frontend .env if needed)
const API_BASE = (import.meta as any)?.env?.VITE_API_BASE || 'http://localhost:3000';

// Thành phần Card chung cho form
const AuthCard: React.FC<{
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ title, children, footer }) => (
  <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700">
    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
      {title}
    </h2>
    {children}
    {footer && (
      <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        {footer}
      </div>
    )}
  </div>
);

// Thành phần Input chung
const AuthInput: React.FC<{
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  register?: UseFormRegisterReturn;
  errorMessage?: string;
}> = ({ id, type, label, placeholder, register, errorMessage }) => (
  <div className="mb-4">
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
    >
      {label}
    </label>
    <input
      type={type}
      id={id}
      className={[
        'w-full p-3 rounded-lg border bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500',
        errorMessage
          ? 'border-red-500 focus:ring-red-500'
          : 'border-gray-300 dark:border-gray-600',
      ].join(' ')}
      placeholder={placeholder}
      aria-invalid={!!errorMessage}
      {...(register || {})}
      required
    />
    {errorMessage && (
      <p className="mt-1 text-sm text-red-600" role="alert">
        {errorMessage}
      </p>
    )}
  </div>
);

// Thành phần Nút chung
const AuthButton: React.FC<{
  children: React.ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
}> = ({ children, disabled, isLoading }) => (
  <button
    type="submit"
    disabled={disabled}
    className="w-full bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white p-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
  >
    {isLoading ? 'Đang xử lý...' : children}
  </button>
);

// Trang Đăng nhập
type LoginForm = { email: string; password: string };
const LoginPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ mode: 'onTouched' });
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (payload: LoginForm) => {
      const res = await fetch(`${API_BASE}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      let data: any = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {}
      if (!res.ok) {
        const msg = (data && (data.message || data.error)) || text || 'Đăng nhập thất bại';
        throw new Error(msg);
      }
      return data;
    },
    onSuccess: () => {
      setTimeout(() => navigate('/'), 800);
    },
  });

  const onSubmit = (data: LoginForm) => mutation.mutate(data);

  return (
    <AuthCard
      title="Đăng nhập"
      footer={
        <>
          Chưa có tài khoản?{' '}
          <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
            Đăng ký ngay
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <AuthInput
          id="email"
          type="email"
          label="Email"
          placeholder="ban@email.com"
          register={register('email', {
            required: 'Vui lòng nhập email',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Email không hợp lệ',
            },
          })}
          errorMessage={errors.email?.message as string}
        />
        <AuthInput
          id="password"
          type="password"
          label="Mật khẩu"
          placeholder="••••••••"
          register={register('password', {
            required: 'Vui lòng nhập mật khẩu',
            minLength: { value: 8, message: 'Ít nhất 8 ký tự' },
          })}
          errorMessage={errors.password?.message as string}
        />
        <div className="mt-6">
          <AuthButton disabled={mutation.isPending} isLoading={mutation.isPending}>
            Đăng nhập
          </AuthButton>
        </div>
        {mutation.isSuccess && (
          <p className="mt-4 text-green-600 text-sm text-center" role="status">
            Đăng nhập thành công! Đang chuyển hướng...
          </p>
        )}
        {mutation.isError && (
          <p className="mt-4 text-red-600 text-sm text-center" role="alert">
            {(mutation.error as Error)?.message || 'Đăng nhập thất bại'}
          </p>
        )}
      </form>
    </AuthCard>
  );
};

// Trang Đăng ký
type SignUpForm = { email: string; password: string };
const SignUpPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpForm>({ mode: 'onTouched' });
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (payload: SignUpForm) => {
      const res = await fetch(`${API_BASE}/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      let data: any = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        // ignore JSON parse error, use text as fallback
      }
      if (!res.ok) {
        const msg =
          (data && (data.message || data.error)) ||
          text ||
          'Đăng ký thất bại';
        throw new Error(msg);
      }
      return data;
    },
    onSuccess: () => {
      reset();
      // Optional: redirect after short delay
      setTimeout(() => navigate('/login'), 1000);
    },
  });

  const onSubmit: SubmitHandler<SignUpForm> = (data) => mutation.mutate(data);

  return (
    <AuthCard
      title="Tạo tài khoản"
      footer={
        <>
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Đăng nhập
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <AuthInput
          id="email"
          type="email"
          label="Email"
          placeholder="ban@email.com"
          register={register('email', {
            required: 'Vui lòng nhập email',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Email không hợp lệ',
            },
          })}
          errorMessage={errors.email?.message as string}
        />
        <AuthInput
          id="password"
          type="password"
          label="Mật khẩu"
          placeholder="Tối thiểu 8 ký tự"
          register={register('password', {
            required: 'Vui lòng nhập mật khẩu',
            minLength: { value: 8, message: 'Ít nhất 8 ký tự' },
          })}
          errorMessage={errors.password?.message as string}
        />
        <div className="mt-6">
          <AuthButton disabled={mutation.isPending} isLoading={mutation.isPending}>
            Đăng ký
          </AuthButton>
        </div>
        {mutation.isSuccess && (
          <p className="mt-4 text-green-600 text-sm text-center" role="status">
            Đăng ký thành công! Đang chuyển đến trang đăng nhập...
          </p>
        )}
        {mutation.isError && (
          <p className="mt-4 text-red-600 text-sm text-center" role="alert">
            {(mutation.error as Error)?.message || 'Đăng ký thất bại'}
          </p>
        )}
      </form>
    </AuthCard>
  );
};

// Trang chủ
const HomePage: React.FC = () => (
  <div className="text-center">
    <h1 className="text-5xl font-bold mb-4">Chào mừng bạn!</h1>
    <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
      Đây là trang chủ của ứng dụng.
    </p>
    <div className="space-x-4">
      <Link
        to="/login"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Đăng nhập
      </Link>
      <Link
        to="/signup"
        className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      >
        Đăng ký
      </Link>
    </div>
  </div>
);

// Thành phần Layout chính
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
    {/* Thanh điều hướng */}
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              MyApp
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Trang chủ
              </Link>
              <Link
                to="/login"
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Đăng nhập
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Đăng ký
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>

    {/* Nội dung trang */}
    <main
      className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ minHeight: 'calc(100vh - 64px)' }}
    >
      {children}
    </main>
  </div>
);

// Thành phần App chính
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
