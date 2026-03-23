import React, { useState, useEffect, useContext } from 'react';
import { Clock, Plus, Trash2, Save, Bell, Moon, Sun, Monitor, Settings as SettingsIcon } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../App';

const Settings = () => {
  const { user } = useContext(AuthContext);
  const [feedingTimes, setFeedingTimes] = useState([]);
  const [portionSize, setPortionSize] = useState(50);
  const [enabled, setEnabled] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(`/schedules/${user.id}`);
        setFeedingTimes(response.data.feedingTimes || []);
        setPortionSize(response.data.portionSize || 50);
        setEnabled(response.data.enabled !== undefined ? response.data.enabled : true);
      } catch (err) {
        console.error('Error fetching schedule:', err);
      }
    };
    fetchSchedule();
  }, [user.id]);

  const addTime = () => {
    setFeedingTimes([...feedingTimes, '08:00']);
  };

  const removeTime = (index) => {
    setFeedingTimes(feedingTimes.filter((_, i) => i !== index));
  };

  const handleTimeChange = (index, value) => {
    const newTimes = [...feedingTimes];
    newTimes[index] = value;
    setFeedingTimes(newTimes);
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      await axios.put(`/schedules/${user.id}`, {
        feedingTimes,
        portionSize,
        enabled,
      });
      toast.success('Settings saved successfully!');
    } catch (err) {
      toast.error('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-500/10 rounded-2xl">
          <SettingsIcon className="w-8 h-8 text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-white">Device Settings</h1>
          <p className="text-slate-400 font-medium">Configure your Dog Feeder preferences and schedules.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Schedule Management */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-bold text-white">Feeding Schedule</h3>
              </div>
              <button
                onClick={addTime}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all border border-slate-700 active:scale-95"
              >
                <Plus className="w-4 h-4" /> Add Time
              </button>
            </div>

            <div className="space-y-4 mb-8">
              {feedingTimes.length === 0 ? (
                <div className="text-center py-8 bg-slate-800/20 rounded-2xl border-2 border-dashed border-slate-800 text-slate-500 font-medium italic">
                  No scheduled times. Click "Add Time" to begin.
                </div>
              ) : (
                feedingTimes.map((time, index) => (
                  <div key={index} className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700 group hover:border-purple-500/30 transition-all">
                    <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 font-bold">
                       {index + 1}
                    </div>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => handleTimeChange(index, e.target.value)}
                      className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl text-white outline-none focus:border-purple-500 flex-1 transition-all"
                    />
                    <button
                      onClick={() => removeTime(index)}
                      className="p-2.5 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-4 p-6 bg-slate-800/30 rounded-3xl border border-slate-700/50">
               <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-lg font-bold text-white tracking-tight">Portion Size</label>
                    <span className="text-purple-400 font-bold bg-purple-500/10 px-3 py-1 rounded-full text-sm">{portionSize}g</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="5"
                    value={portionSize}
                    onChange={(e) => setPortionSize(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400 transition-all"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-3">
                    <span>Small (10g)</span>
                    <span>Large (500g)</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex justify-end pt-4">
            <button
               onClick={saveSettings}
               disabled={isSaving}
               className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 pl-8 pr-8 rounded-2xl text-white font-bold flex items-center gap-3 transition-all hover:opacity-90 active:scale-95 shadow-xl shadow-blue-500/20 disabled:opacity-50"
            >
              {isSaving ? (
                <Save className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {isSaving ? 'Saving Changes...' : 'Save Settings'}
            </button>
          </div>
        </div>

        {/* Right Column: Preferences & Appearance */}
        <div className="space-y-8">
          {/* General Toggle Controls */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-8 shadow-xl">
             <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                      <Monitor className="w-5 h-5 text-blue-400" />
                   </div>
                   <div className="flex flex-col">
                      <span className="font-bold text-white text-sm">Feeder Status</span>
                      <span className="text-xs text-slate-500 font-medium tracking-tight">Master switch for device functionality.</span>
                   </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={enabled} onChange={() => setEnabled(!enabled)} className="sr-only peer" />
                  <div className="w-12 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500" />
                </label>
             </div>

             <div className="flex items-center justify-between group">
               <div className="flex items-center gap-3">
                   <div className="p-2 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors">
                      <Bell className="w-5 h-5 text-amber-400" />
                   </div>
                   <div className="flex flex-col">
                      <span className="font-bold text-white text-sm">Notifications</span>
                      <span className="text-xs text-slate-500 font-medium tracking-tight">Push alerts for feeding events.</span>
                   </div>
               </div>
               <label className="relative inline-flex items-center cursor-pointer">
                 <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} className="sr-only peer" />
                 <div className="w-12 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
               </label>
             </div>

             <div className="pt-8 border-t border-slate-800">
               <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 block">Appearance</span>
               <div className="grid grid-cols-2 gap-3">
                  <button className="flex flex-col items-center gap-2 p-4 bg-slate-800/30 rounded-2xl border-2 border-blue-500/50 hover:bg-slate-800/50 transition-all transition-colors group">
                    <Moon className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Dark Mode</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 p-4 bg-slate-800/10 rounded-2xl border-2 border-transparent hover:bg-slate-800/20 transition-all opacity-40 group">
                    <Sun className="w-6 h-6 text-slate-500 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Light Mode</span>
                  </button>
               </div>
             </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 p-8 rounded-3xl relative overflow-hidden">
             <div className="relative z-10">
               <h4 className="font-bold text-white mb-2">Need Help?</h4>
               <p className="text-sm text-slate-400 mb-4 font-medium leading-relaxed">Check our maintenance guide to keep your dispenser at peak performance.</p>
               <button className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest decoration-2 underline underline-offset-4">Read Guide</button>
             </div>
             <div className="absolute right-0 bottom-0 opacity-10 blur-sm transform translate-x-4 translate-y-4">
                <SettingsIcon className="w-32 h-32 text-white" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
