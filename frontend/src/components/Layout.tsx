import React from 'react';
import { Link } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 text-gray-900 dark:text-white">
    <nav className="bg-white/70 dark:bg-gray-800/60 backdrop-blur shadow-md border-b border-white/40 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
            >
              RegisterApp
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className="text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50 px-3 py-2 rounded-md text-sm font-medium"
              >
                Trang chủ
              </Link>
              <Link
                to="/login"
                className="text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50 px-3 py-2 rounded-md text-sm font-medium"
              >
                Đăng nhập
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:from-blue-700 hover:to-indigo-700"
              >
                Đăng ký
              </Link>
            </div>
          </div>
        </div>
        {/* Mobile quick actions */}
        <div className="md:hidden pb-3">
          <div className="flex gap-2">
            <Link
              to="/login"
              className="flex-1 text-center px-3 py-2 rounded-md text-sm font-medium text-gray-800 dark:text-gray-200 bg-white/60 dark:bg-gray-700/60 border border-white/40 dark:border-white/10"
            >
              Đăng nhập
            </Link>
            <Link
              to="/signup"
              className="flex-1 text-center px-3 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </div>
    </nav>

    <main
      className="flex items-center justify-center py-4 sm:py-8 px-4 sm:px-6 lg:px-8"
      style={{ minHeight: 'calc(100vh - 64px)' }}
    >
      {children}
    </main>
  </div>
);

export default Layout;
