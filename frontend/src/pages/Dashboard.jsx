import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Activity, Clock, Database, CheckCircle, AlertTriangle, RefreshCw, Zap, Bell, History, BarChart3 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { connectMQTT, publishToMQTT } from '../services/mqttClient';
import { AuthContext } from '../App';
import { format, startOfDay, endOfDay, isSameDay } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [deviceStatus, setDeviceStatus] = useState('offline');
  const [lastFeeding, setLastFeeding] = useState(null);
  const [nextFeeding, setNextFeeding] = useState(null);
  const [foodLevel, setFoodLevel] = useState(85);
  const [logs, setLogs] = useState([]);
  const [isFeeding, setIsFeeding] = useState(false);

  // Memoize graph data based on logs
  const graphData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      count: 0
    }));

    const todayLogs = logs.filter(log => {
      const logDate = new Date(log.timestamp);
      return isSameDay(logDate, new Date()) && (log.status === 'feeding_done' || log.message.toLowerCase().includes('feed'));
    });

    todayLogs.forEach(log => {
      const hour = new Date(log.timestamp).getHours();
      hours[hour].count += 1;
    });

    return hours;
  }, [logs]);

  useEffect(() => {
    const client = connectMQTT(
      (topic, message) => {
        if (topic === 'dogfeeder/status') {
          const msg = message.toLowerCase();
          
          if (msg.includes('done') || msg.includes('dispense')) {
            setLastFeeding(new Date());
            toast.success('🎉 Feeding cycle completed successfully!', {
              style: { background: '#1e293b', border: '1px solid #10b981', color: '#10b981' }
            });
            setIsFeeding(false);
          }
          
          if (msg.includes('offline')) setDeviceStatus('offline');
          if (msg.includes('online')) setDeviceStatus('connected');

          setLogs(prev => [{ timestamp: new Date(), message, status: msg.includes('done') ? 'feeding_done' : 'info' }, ...prev.slice(0, 19)]);
        }
      },
      (status) => setDeviceStatus(status)
    );

    const fetchData = async () => {
      try {
        const scheduleRes = await axios.get(`/schedules/${user.id}`);
        if (scheduleRes.data.feedingTimes?.length > 0) {
          const sortedTimes = scheduleRes.data.feedingTimes.sort();
          const now = format(new Date(), 'HH:mm');
          const nextTime = sortedTimes.find(t => t > now) || sortedTimes[0];
          setNextFeeding(nextTime);
        }

        const logsRes = await axios.get('/logs');
        setLogs(logsRes.data);
        
        // Find last feeding from logs
        const lastFeedLog = logsRes.data.find(l => l.status === 'feeding_done' || l.message.toLowerCase().includes('feed'));
        if (lastFeedLog) setLastFeeding(new Date(lastFeedLog.timestamp));

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchData();

    return () => {
      if (client) client.end();
    };
  }, [user.id]);

  const handleManualFeed = async () => {
    setIsFeeding(true);
    try {
      await axios.post('/schedules/feed');
      setLogs(prev => [{ timestamp: new Date(), message: 'Manual feeding triggered', status: 'delivered' }, ...prev.slice(0, 19)]);
      toast.info('Dispensing food...', {
        icon: <Zap className="text-blue-400 animate-pulse" />,
      });

      // Self-mock if device doesn't respond (Delete this in production)
      setTimeout(() => {
        if (isFeeding) {
          const mockMsg = "feeding_done";
          setLastFeeding(new Date());
          setLogs(prev => [{ timestamp: new Date(), message: 'Feeding Cycle Done (Mock)', status: 'feeding_done' }, ...prev.slice(0, 19)]);
          toast.success('Feeding cycle completed!');
          setIsFeeding(false);
        }
      }, 5000);
    } catch (err) {
      toast.error('Failed to trigger feeding.');
      setIsFeeding(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header section remains similar but updated */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Hello, {user.name}!</h1>
          <p className="text-slate-400 font-medium">Monitoring your Smart Feeder in real-time.</p>
        </div>
        <div className={`px-4 py-2 rounded-full flex items-center gap-2 border shadow-lg transition-all ${
          deviceStatus === 'connected'
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-emerald-500/10'
            : 'bg-rose-500/10 border-rose-500/20 text-rose-400 shadow-rose-500/10'
        }`}>
          <div className={`w-2.5 h-2.5 rounded-full ${deviceStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
          <span className="text-xs font-bold uppercase tracking-wider">{deviceStatus === 'connected' ? 'Device Online' : 'Device Offline'}</span>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl hover:border-blue-500/50 transition-all group">
          <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Activity className="text-blue-400 w-6 h-6" />
          </div>
          <p className="text-slate-500 text-sm font-semibold mb-1 uppercase tracking-wider">Status</p>
          <h3 className={`text-2xl font-bold ${deviceStatus === 'connected' ? 'text-emerald-400' : 'text-rose-400'}`}>{deviceStatus === 'connected' ? 'Ready' : 'Offline'}</h3>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl hover:border-purple-500/50 transition-all group">
          <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <CheckCircle className="text-purple-400 w-6 h-6" />
          </div>
          <p className="text-slate-500 text-sm font-semibold mb-1 uppercase tracking-wider">Last Fed</p>
          <h3 className="text-2xl font-bold text-white">{lastFeeding ? format(lastFeeding, 'p') : '--:--'}</h3>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl hover:border-amber-500/50 transition-all group">
          <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Clock className="text-amber-400 w-6 h-6" />
          </div>
          <p className="text-slate-500 text-sm font-semibold mb-1 uppercase tracking-wider">Next Meal</p>
          <h3 className="text-2xl font-bold text-white">{nextFeeding || '--:--'}</h3>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl hover:border-indigo-500/50 transition-all group overflow-hidden">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Database className="text-indigo-400 w-6 h-6" />
          </div>
          <p className="text-slate-500 text-sm font-semibold mb-1 uppercase tracking-wider">Food Level</p>
          <div className="flex items-end gap-3">
            <h3 className="text-2xl font-bold text-white">{foodLevel}%</h3>
            <div className="flex-1 h-3 bg-slate-800 rounded-full mb-1 overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-1000 ${foodLevel < 20 ? 'bg-rose-500' : 'bg-indigo-500'}`} style={{ width: `${foodLevel}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Daily Graph */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl">
             <div className="flex items-center gap-3 mb-8">
                <BarChart3 className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold text-white">Daily Feeding Intensity</h3>
             </div>
             <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={graphData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '12px' }}
                      itemStyle={{ color: '#38bdf8' }}
                      cursor={{ fill: '#1e293b', opacity: 0.4 }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {graphData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.count > 0 ? '#38bdf8' : '#1e293b'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Feed Button */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-8 rounded-3xl flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden group/feed">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 relative z-10 transition-all duration-500 ${isFeeding ? 'scale-95 translate-y-2' : 'scale-100'}`}>
              <div className={`absolute inset-0 rounded-full bg-blue-500/20 blur-2xl ${isFeeding ? 'animate-pulse' : ''}`} />
              <button
                onClick={handleManualFeed}
                disabled={isFeeding || deviceStatus !== 'connected'}
                className={`w-full h-full rounded-full flex items-center justify-center shadow-2xl transition-all relative z-20 ${
                  isFeeding ? 'bg-blue-600' : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:brightness-110 active:scale-90'
                } disabled:grayscale disabled:opacity-50`}
              >
                {isFeeding ? <RefreshCw className="w-12 h-12 text-white animate-spin" /> : <Zap className="w-12 h-12 text-white" />}
              </button>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Manual Dispenser</h2>
            <p className="text-slate-400 mb-2 max-w-sm">Tap to send an immediate feeding command.</p>
          </div>
        </div>

        {/* Activity Logs */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl flex flex-col h-full max-h-[700px] shadow-xl">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-white text-lg">Activity Logs</h3>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-600 italic">No activity yet.</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="flex gap-4 p-4 bg-slate-800/20 rounded-2xl border border-transparent hover:border-slate-700/50 transition-all">
                  <div className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${log.status === 'feeding_done' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : (log.status === 'error' ? 'bg-rose-500' : 'bg-blue-500')}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{log.timestamp ? format(new Date(log.timestamp), 'p') : '--:--'}</span>
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-400 uppercase font-bold">{log.status || 'INFO'}</span>
                    </div>
                    <p className="text-sm text-slate-300 font-medium">{log.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t border-slate-800 bg-slate-900/50 rounded-b-3xl">
             <button className="w-full text-xs font-bold text-blue-400 hover:text-white transition-colors uppercase tracking-widest py-2">Clear Logs</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
