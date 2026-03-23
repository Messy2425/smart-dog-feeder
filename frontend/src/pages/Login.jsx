import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PawPrint, Mail, Lock, LogIn, Chrome } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../App';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post('/auth/login', { email, password });
      login(response.data.user);
      toast.success('Login Successful! Welcome back.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    toast.info('Google Sign-In coming soon!');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-10 rounded-3xl shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-all rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 blur-3xl -ml-16 -mb-16 group-hover:bg-indigo-500/20 transition-all rounded-full pointer-events-none" />

        <div className="text-center mb-8 relative">
          <div className="mx-auto w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
            <PawPrint className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-slate-400">Control your pet's feeding remotely</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
            <div className="relative group/input">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-500 group-focus-within/input:text-blue-400 transition-colors" />
              <input
                type="email"
                required
                className="w-full bg-slate-800 border border-slate-700 p-3 pl-10 rounded-xl focus:border-blue-500 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-white"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
            <div className="relative group/input text-left">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-500 group-focus-within/input:text-blue-400 transition-colors" />
              <input
                type="password"
                required
                className="w-full bg-slate-800 border border-slate-700 p-3 pl-10 rounded-xl focus:border-blue-500 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-white"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 p-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
          >
            {isSubmitting ? 'Logging in...' : <><LogIn className="w-5 h-5" /> Sign In</>}
          </button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-2 text-slate-500 font-medium">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full border border-slate-700 bg-slate-800 p-3.5 rounded-xl text-slate-200 font-medium flex items-center justify-center gap-3 hover:bg-slate-700 transition-all"
          >
            <Chrome className="w-5 h-5 text-red-500" />
            Continue with Google
          </button>
        </form>

        <p className="mt-8 text-center text-slate-400 text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-400 font-bold hover:underline underline-offset-4 decoration-2">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
