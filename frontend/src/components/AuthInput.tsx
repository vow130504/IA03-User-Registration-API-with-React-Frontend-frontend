import React from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

const AuthInput: React.FC<{
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  register?: UseFormRegisterReturn;
  errorMessage?: string;
  autoComplete?: string; // added
}> = ({ id, type, label, placeholder, register, errorMessage, autoComplete }) => {
  const errorId = `${id}-error`;
  return (
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
          'w-full p-2.5 sm:p-3 text-sm sm:text-base rounded-lg border bg-white/60 dark:bg-gray-700/60 backdrop-blur text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500',
          errorMessage
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 dark:border-gray-600',
        ].join(' ')}
        placeholder={placeholder}
        aria-invalid={!!errorMessage}
        aria-describedby={errorMessage ? errorId : undefined}
        autoComplete={autoComplete}
        {...(register || {})}
        required
      />
      {errorMessage && (
        <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default AuthInput;
