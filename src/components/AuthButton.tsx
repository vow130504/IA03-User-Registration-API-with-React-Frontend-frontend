import React from 'react';

const AuthButton: React.FC<{
  children: React.ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
}> = ({ children, disabled, isLoading }) => (
  <button
    type="submit"
    disabled={disabled}
    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed text-white py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
  >
    {isLoading ? 'Đang xử lý...' : children}
  </button>
);

export default AuthButton;
