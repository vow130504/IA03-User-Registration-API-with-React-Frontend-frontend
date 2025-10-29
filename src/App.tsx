import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import HomePage from '@/components/pages/HomePage';
import LoginPage from '@/components/pages/LoginPage';
import SignUpPage from '@/components/pages/SignUpPage';

// Backend API base (configure VITE_API_BASE in frontend .env if needed)
const API_BASE = (import.meta as any)?.env?.VITE_API_BASE || 'http://localhost:3000';

// Add a local auth-aware Layout to control navbar rendering based on login state
type AuthUser = { email: string } | null;

const Layout: React.FC<{ children: React.ReactNode; user: AuthUser; onLogout: () => void }> = ({
  children,
  user,
  onLogout,
}) => (
  <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
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

              {/* Right-side (auth-aware) */}
              {user ? (
                <>
                  <span className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700">
                    {user.email}
                  </span>
                  <button
                    onClick={onLogout}
                    className="px-3 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ minHeight: 'calc(100vh - 64px)' }}>
      {children}
    </main>
  </div>
);

// Thành phần App chính
const queryClient = new QueryClient();

export default function App() {
  // Persist auth email in localStorage
  const [user, setUser] = useState<AuthUser>(() => {
    try {
      const raw = localStorage.getItem('authUser');
      return raw ? (JSON.parse(raw) as { email: string }) : null;
    } catch {
      return null;
    }
  });

  // Intercept successful /user/login responses to capture email and mark as logged in
  useEffect(() => {
    const originalFetch = window.fetch.bind(window);
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const res = await originalFetch(input, init);
      try {
        const url =
          typeof input === 'string'
            ? input
            : input instanceof URL
            ? input.href
            : input.url;

        if (res.ok && /\/user\/login$/.test(url)) {
          const data = await res.clone().json().catch(() => null);
          const email = data?.user?.email as string | undefined;
          if (email) {
            const auth = { email };
            localStorage.setItem('authUser', JSON.stringify(auth));
            setUser(auth);
          }
        }
      } catch {
        // ignore parsing/logging errors
      }
      return res;
    };
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authUser');
    setUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout user={user} onLogout={handleLogout}>
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