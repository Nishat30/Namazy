
import React, { useEffect } from 'react';
import { useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center islamic-pattern">
      <div className="text-center bg-white/80 dark:bg-emerald-900/50 backdrop-blur-sm rounded-2xl p-12">
        <h1 className="text-4xl font-bold mb-4 text-emerald-800 dark:text-emerald-100 font-islamic">404</h1>
        <p className="text-xl text-emerald-600 dark:text-emerald-300 mb-4">Oops! Page not found</p>
        <a href="/" className="text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-300 underline font-medium">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
