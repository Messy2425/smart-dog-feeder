import React, { useContext } from 'react';
import { User, Mail, Shield, Camera, Edit2 } from 'lucide-react';
import { AuthContext } from '../App';

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
        <div className="relative group">
          <div className="w-40 h-40 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-3xl p-1 shadow-2xl transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-slate-950 rounded-[1.4rem] flex items-center justify-center relative overflow-hidden">
               <User className="w-20 h-20 text-blue-400 opacity-20" />
               <div className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity">
                  <span className="text-4xl font-black text-white">{user.name.charAt(0).toUpperCase()}</span>
               </div>
               <div className="absolute inset-0 bg-blue-500/20 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-8 h-8 text-white mb-1" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">Update</span>
               </div>
            </div>
          </div>
          <button className="absolute -bottom-2 -right-2 p-3 bg-slate-900 border border-slate-700 rounded-2xl text-blue-400 hover:text-white hover:bg-blue-500 transition-all shadow-xl active:scale-95">
             <Edit2 className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center md:text-left flex-1">
          <h1 className="text-4xl font-extrabold text-white mb-2">{user.name}</h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-400 font-medium">
             <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500" />
                <span>{user.email}</span>
             </div>
             <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-500" />
                <span>Joined March 2024</span>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 hover:border-slate-700 transition-colors shadow-xl">
            <h3 className="text-xl font-bold text-white mb-2">Pet Information</h3>
             <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                   <span className="text-slate-400 font-medium italic">Pet Name</span>
                   <span className="text-white font-bold">Buddy</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                   <span className="text-slate-400 font-medium italic">Breed</span>
                   <span className="text-white font-bold">Golden Retriever</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                   <span className="text-slate-400 font-medium italic">Age</span>
                   <span className="text-white font-bold">3 Years</span>
                </div>
             </div>
         </div>

         <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col items-center justify-center text-center space-y-4 hover:border-slate-700 transition-colors shadow-xl">
            <div className="p-4 bg-emerald-500/10 rounded-2xl">
               <Shield className="w-8 h-8 text-emerald-400" />
            </div>
            <h4 className="font-bold text-white">Account Security</h4>
            <p className="text-sm text-slate-400 leading-relaxed md:px-6 mb-4">Your connection is encrypted. Two-factor authentication is currently disabled.</p>
            <button className="text-blue-400 font-bold hover:text-white transition-colors text-xs uppercase tracking-widest border border-blue-500/20 px-6 py-2.5 rounded-xl hover:bg-blue-500 flex items-center gap-2">
               Manage Security
            </button>
         </div>
      </div>
    </div>
  );
};

export default Profile;
