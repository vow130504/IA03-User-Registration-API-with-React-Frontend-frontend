import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import AuthCard from '../AuthCard';
import AuthInput from '../AuthInput';
import AuthButton from '../AuthButton';

const API_BASE = (import.meta as any)?.env?.VITE_API_BASE || 'http://localhost:3000';

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
      } catch {}
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
          autoComplete="email"
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
          autoComplete="new-password"
          register={register('password', {
            required: 'Vui lòng nhập mật khẩu',
            minLength: { value: 8, message: 'Ít nhất 8 ký tự' },
            pattern: {
              value: /[^A-Za-z0-9]/,
              message: 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt',
            },
          })}
          errorMessage={errors.password?.message as string}
        />
        <div className="mt-6">
          <AuthButton disabled={mutation.isPending} isLoading={mutation.isPending}>
            Đăng ký
          </AuthButton>
        </div>
        {mutation.isSuccess && (
          <p className="mt-4 text-green-600 text-sm text-center" role="status" aria-live="polite">
            Đăng ký thành công! Đang chuyển đến trang đăng nhập...
          </p>
        )}
        {mutation.isError && (
          <p className="mt-4 text-red-600 text-sm text-center" role="alert" aria-live="assertive">
            {(mutation.error as Error)?.message || 'Đăng ký thất bại'}
          </p>
        )}
      </form>
    </AuthCard>
  );
};

export default SignUpPage;
