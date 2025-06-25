
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun, Home, Clock } from 'lucide-react';

const Navigation = ({ currentPage, setCurrentPage }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className="bg-white/90 dark:bg-emerald-900/90 backdrop-blur-md border-b border-emerald-200 dark:border-emerald-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg font-arabic">ن</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-emerald-800 dark:text-emerald-100 font-islamic">
                Namaz Reminder
              </h1>
              <p className="text-sm text-emerald-600 dark:text-emerald-300 font-arabic">
                نماز یاد دہانی
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentPage('home')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                currentPage === 'home'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-800'
              }`}
            >
              <Home size={18} />
              <span className="font-medium">Home</span>
            </button>

            <button
              onClick={() => setCurrentPage('qaza')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                currentPage === 'qaza'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-800'
              }`}
            >
              <Clock size={18} />
              <span className="font-medium">Qaza</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-800 transition-all duration-200"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
