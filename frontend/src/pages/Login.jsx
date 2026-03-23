import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PawPrint, Mail, Lock, ArrowRight, Chrome, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
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
      toast.success('Welcome back! ❤️');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen -mt-16 flex items-stretch overflow-hidden font-outfit">
      {/* Left Side: Visual Hero */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex w-1/2 relative bg-slate-950 items-center justify-center p-12 overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 via-transparent to-indigo-900/40" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/10 blur-[100px] rounded-full" />
        </div>
        
        <div className="relative z-10 max-w-lg text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mb-12 relative"
          >
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
            <img 
              src="/assets/hero.png" 
              alt="Futuristic Dog Feeder" 
              className="relative w-full rounded-[40px] shadow-2xl border border-white/5 transform hover:rotate-1 transition-transform duration-700"
            />
          </motion.div>
          <h2 className="text-4xl font-extrabold text-white mb-6 leading-tight">
            Peace of mind for you, <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
              Happy meals for them.
            </span>
          </h2>
          <p className="text-blue-100/60 text-lg font-light leading-relaxed">
            The world's most advanced remote feeding system. Stay connected to your best friend, anytime, anywhere.
          </p>
        </div>
      </motion.div>

      {/* Right Side: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-slate-900 relative">
        <div className="lg:hidden absolute inset-0 bg-slate-900" />
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 lg:opacity-100">
          <div className="absolute top-[10%] right-[10%] w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 shadow-inner">
                <PawPrint className="w-7 h-7 text-blue-400" />
              </div>
              <span className="text-xs font-bold tracking-[0.2em] text-blue-400/80 uppercase">AI Smart Feed</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-3">Sign In</h1>
            <p className="text-slate-400 font-medium">Log in to manage your smart device settings.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5 group">
              <label className="text-sm font-semibold text-slate-400 px-1 group-focus-within:text-blue-400 transition-colors">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="email"
                  required
                  className="w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-4 pl-12 rounded-2xl focus:border-blue-500/50 outline-none focus:ring-[6px] focus:ring-blue-500/5 transition-all text-white placeholder-slate-600"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5 group">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-semibold text-slate-400 group-focus-within:text-blue-400 transition-colors">
                  Password
                </label>
                <Link to="#" className="text-xs font-bold text-blue-400/80 hover:text-blue-400 transition-colors">Forgot Password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="password"
                  required
                  className="w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-4 pl-12 rounded-2xl focus:border-blue-500/50 outline-none focus:ring-[6px] focus:ring-blue-500/5 transition-all text-white placeholder-slate-600"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 p-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 shadow-2xl shadow-blue-900/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In Securely <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>

            <div className="relative flex items-center gap-4 my-8">
              <div className="h-px w-full bg-slate-800"></div>
              <span className="text-xs font-bold text-slate-600 whitespace-nowrap uppercase tracking-widest">or</span>
              <div className="h-px w-full bg-slate-800"></div>
            </div>

            <button
              type="button"
              className="w-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 p-4 rounded-2xl text-slate-300 font-bold flex items-center justify-center gap-3 transition-all"
            >
              <div className="bg-white p-1 rounded-full"><Chrome className="w-4 h-4 text-slate-900" /></div>
              Google Workplace
            </button>
          </form>

          <div className="mt-10 flex flex-col items-center gap-6">
            <p className="text-slate-500 font-medium">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">
                Start for free
              </Link>
            </p>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-950/50 rounded-full border border-white/5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Verified Secure Protocol</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
