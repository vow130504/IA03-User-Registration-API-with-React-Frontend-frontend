import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import AuthCard from '../AuthCard';
import AuthInput from '../AuthInput';
import AuthButton from '../AuthButton';

const API_BASE = (import.meta as any)?.env?.VITE_API_BASE || 'http://localhost:3000';

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

export default LoginPage;
