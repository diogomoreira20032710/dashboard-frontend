import React from 'react';

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-700">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
        <div className="text-center mb-6">
          <img src="/0.png" alt="Logo" className="mx-auto mb-4 w-20 h-20" />
          <h2 className="text-2xl font-bold text-gray-700">{title}</h2>
          {subtitle && <p className="text-gray-500">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;