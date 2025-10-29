import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => (
  <div className="relative isolate w-full overflow-hidden shadow-lg flex items-center justify-center rounded-xl sm:rounded-2xl lg:rounded-3xl min-h-[40vh] sm:min-h-[45vh] md:min-h-[50vh] lg:min-h-[55vh] max-h-[80vh]">
    <div
      className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506765515384-028b60a970df?q=80&w=1600&auto=format&fit=crop')",
      }}
      role="img"
      aria-label="Background"
    />
    <div className="absolute inset-0 z-10 bg-gradient-to-br from-white/80 via-white/40 to-white/20 dark:from-gray-900/80 dark:via-gray-900/50 dark:to-gray-900/20 backdrop-blur-[2px] pointer-events-none" />
    <div className="relative z-20 w-[92%] max-w-2xl p-4 sm:p-6 md:p-8 rounded-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/40 dark:border-white/10 text-center mx-auto">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
        Chào mừng bạn!
      </h1>
      <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 mb-6 sm:mb-8">
        Đây là trang chủ của ứng dụng.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
        <Link
          to="/login"
          className="px-5 py-3 sm:px-6 sm:py-3.5 md:px-6 md:py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold text-sm sm:text-base hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-lg text-center"
        >
          Đăng nhập
        </Link>
        <Link
          to="/signup"
          className="px-5 py-3 sm:px-6 sm:py-3.5 md:px-6 md:py-3.5 bg-white/70 dark:bg-gray-700/60 backdrop-blur text-gray-900 dark:text-white rounded-lg font-semibold text-sm sm:text-base border border-white/40 dark:border-white/10 hover:bg-white/80 dark:hover:bg-gray-700/70 transition-colors shadow-lg text-center"
        >
          Đăng ký
        </Link>
      </div>
    </div>
  </div>
);

export default HomePage;
