import React from 'react';

const AuthCard: React.FC<{
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ title, children, footer }) => (
  <div className="bg-white/80 dark:bg-gray-800/70 backdrop-blur p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/40 dark:border-white/10">
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

export default AuthCard;
