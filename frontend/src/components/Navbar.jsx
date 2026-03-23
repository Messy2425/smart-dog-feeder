import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { PawPrint, LayoutDashboard, Settings, User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '../App';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-4 py-3 pointer-events-none">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="container mx-auto max-w-6xl pointer-events-auto"
      >
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[24px] px-6 h-16 flex items-center justify-between shadow-2xl shadow-black/20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <PawPrint className="text-white w-5 h-5" />
            </div>
            <span className="font-extrabold text-lg tracking-tight hidden sm:inline-block text-white">
              Smart<span className="text-blue-400">Dog</span>
            </span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  isActive ? 'text-blue-400 bg-blue-400/5 border border-blue-400/10' : 'text-slate-400 hover:text-white'
                }`
              }
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="hidden md:inline font-bold text-sm tracking-wide">Dashboard</span>
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  isActive ? 'text-blue-400 bg-blue-400/5 border border-blue-400/10' : 'text-slate-400 hover:text-white'
                }`
              }
            >
              <Settings className="w-5 h-5" />
              <span className="hidden md:inline font-bold text-sm tracking-wide">Settings</span>
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  isActive ? 'text-blue-400 bg-blue-400/5 border border-blue-400/10' : 'text-slate-400 hover:text-white'
                }`
              }
            >
              <User className="w-5 h-5" />
              <span className="hidden md:inline font-bold text-sm tracking-wide">Profile</span>
            </NavLink>

            <div className="w-px h-6 bg-slate-800 mx-1 hidden sm:block"></div>

            <button
              onClick={logout}
              className="p-2.5 text-slate-500 hover:text-rose-400 hover:bg-rose-400/5 border border-transparent hover:border-rose-400/10 rounded-xl transition-all ml-1"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
