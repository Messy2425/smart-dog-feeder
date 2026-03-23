import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { PawPrint, LayoutDashboard, Settings, User, LogOut } from 'lucide-react';
import { AuthContext } from '../App';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  return (
    <nav className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="p-2 bg-blue-500 rounded-xl shadow-lg shadow-blue-500/20">
            <PawPrint className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:inline-block">
            Smart<span className="text-blue-400">Dog</span>Feeder
          </span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-8">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive ? 'text-blue-400 bg-blue-400/10' : 'text-slate-400 hover:text-white'
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="hidden md:inline font-medium">Dashboard</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive ? 'text-blue-400 bg-blue-400/10' : 'text-slate-400 hover:text-white'
              }`
            }
          >
            <Settings className="w-5 h-5" />
            <span className="hidden md:inline font-medium">Settings</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive ? 'text-blue-400 bg-blue-400/10' : 'text-slate-400 hover:text-white'
              }`
            }
          >
            <User className="w-5 h-5" />
            <span className="hidden md:inline font-medium">Profile</span>
          </NavLink>

          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all ml-2"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
