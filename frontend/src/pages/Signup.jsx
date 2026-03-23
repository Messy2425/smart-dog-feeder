import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PawPrint, Mail, Lock, User, ArrowRight, Chrome } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../App';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post('/auth/signup', { name, email, password });
      login(response.data.user);
      toast.success('Account created! Welcome to the family. 🐾');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen -mt-16 flex items-stretch overflow-hidden font-outfit">
      {/* Right Side: Visual Hero (Reversed for Signup) */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex w-1/2 relative bg-slate-950 items-center justify-center p-12 overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-bl from-indigo-900/40 via-transparent to-blue-900/40" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/10 blur-[100px] rounded-full" />
        </div>
        
        <div className="relative z-10 max-w-lg text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mb-12 relative"
          >
            <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
            <img 
              src="/assets/hero.png" 
              alt="Premium Dog Feeder" 
              className="relative w-full rounded-[40px] shadow-2xl border border-white/5 transform hover:-rotate-1 transition-transform duration-700"
            />
          </motion.div>
          <h2 className="text-4xl font-extrabold text-white mb-6 leading-tight">
            Start your journey <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-300">
              to smarter pet care.
            </span>
          </h2>
          <p className="text-indigo-100/60 text-lg font-light leading-relaxed">
            Join thousands of happy pet parents using our automated ecosystem.
          </p>
        </div>
      </motion.div>

      {/* Left Side: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-slate-900 relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 lg:opacity-100">
          <div className="absolute bottom-[10%] left-[10%] w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 shadow-inner">
                <PawPrint className="w-7 h-7 text-indigo-400" />
              </div>
              <span className="text-xs font-bold tracking-[0.2em] text-indigo-400/80 uppercase">AI Smart Feed</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-3">Create Account</h1>
            <p className="text-slate-400 font-medium">Get started with your smart feeder today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5 group">
              <label className="text-sm font-semibold text-slate-400 px-1 group-focus-within:text-indigo-400 transition-colors">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="text"
                  required
                  className="w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-4 pl-12 rounded-2xl focus:border-indigo-500/50 outline-none focus:ring-[6px] focus:ring-indigo-500/5 transition-all text-white placeholder-slate-600"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5 group">
              <label className="text-sm font-semibold text-slate-400 px-1 group-focus-within:text-indigo-400 transition-colors">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="email"
                  required
                  className="w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-4 pl-12 rounded-2xl focus:border-indigo-500/50 outline-none focus:ring-[6px] focus:ring-indigo-500/5 transition-all text-white placeholder-slate-600"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5 group">
              <label className="text-sm font-semibold text-slate-400 px-1 group-focus-within:text-indigo-400 transition-colors">
                Create Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="password"
                  required
                  className="w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-4 pl-12 rounded-2xl focus:border-indigo-500/50 outline-none focus:ring-[6px] focus:ring-indigo-500/5 transition-all text-white placeholder-slate-600"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 p-4 mt-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 shadow-2xl shadow-indigo-900/20 transition-all active:scale-[0.98] disabled:opacity-50 group"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign Up Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>

            <button
              type="button"
              className="w-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 p-4 rounded-2xl text-slate-300 font-bold flex items-center justify-center gap-3 transition-all mt-4"
            >
              <Chrome className="w-5 h-5 text-slate-200" />
              Sign up with Google
            </button>
          </form>

          <p className="mt-10 text-center text-slate-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
