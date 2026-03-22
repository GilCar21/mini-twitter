import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { LogOut, Search, Moon, Sun } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from './Button';
import { useThemeStore } from '../store/useThemeStore';

interface HeaderProps {
  onSearch?: (term: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = !!token;

  const { theme, toggleTheme } = useThemeStore();

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  console.log(theme)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <header className="w-full bg-[#FFFFFF] dark:bg-bluet-900 border-b border-customZinc-550 dark:border-customZinc-550 p-4 sticky top-0 z-10 shadow-sm transition-colors">
      <div className="max-w-[1400px] px-10 mx-auto flex items-center justify-between">
        <Link to="/" className="text-lg font-bold leading-[120%] text-bluet-500 dark:text-[#FFFFFF] hover:text-bluet-600 transition-colors">
          Mini Twitter
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-[640px] mx-6 relative hidden sm:block">
          <input
            type="text"
            placeholder="Buscar por post..."
            className="w-full pl-10 pr-4 py-2 bg-[#FFFFFF] dark:bg-bluet-950 border border-customZinc-550 dark:border-customZinc-550 rounded-lg focus:outline-none focus:ring-2 focus:ring-bluet-500 dark:focus:ring-bluet-900 focus:bg-white dark:focus:bg-gray-600 text-sm transition-all dark:text-customZinc-200 dark:placeholder-customZinc-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="w-4 h-4 text-customZinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
        </form>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 bg-customZinc-900 dark:bg-bluet-950 hover:text-white dark:hover:bg-customZinc-900 text-customWhite-100 dark:text-white rounded-full flex items-center justify-center transition-colors hover:cursor-pointer"
            title="Alternar Tema"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-10 h-10 bg-bluet-500 hover:bg-bluet-600 dark:bg-bluet-950 dark:hover:bg-customZinc-900 text-customWhite-100 dark:text-white rounded-full flex items-center justify-center transition-colors hover:cursor-pointer"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          ) : (
            <>
              <Button
                variant="secondary"
                onClick={() => navigate('/register')}
                className="!w-auto !py-2 !px-4 !rounded-full !text-sm"
              >
                Registrar-se
              </Button>
              <Button
                onClick={() => navigate('/login')}
                className="!w-auto !py-2 !px-6 !rounded-full !text-sm"
              >
                Login
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
