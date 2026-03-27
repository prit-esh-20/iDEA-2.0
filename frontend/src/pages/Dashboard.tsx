import React from 'react';
import { useAppContext } from '../store/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Target, Activity, Zap, Server, Database, Globe, ShieldAlert, CheckCircle, ChevronRight, Bot, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { riskScore, threatLevel, activeIncidents, alerts, role } = useAppContext();
  const navigate = useNavigate();

  const getScoreColor = (score: number) => {
    if (score < 40) return 'text-green-500';
    if (score < 70) return 'text-yellow-500';
    if (score < 90) return 'text-orange-500';
    return 'text-red-500';
  };

  const getThreatColorBg = (level: string) => {
    switch(level) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Critical': return 'bg-red-100 text-red-800 flex items-center shadow-inner font-bold';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const flowNodes = [
    { id: 'user', label: 'User', icon: Globe, compromised: false },
    { id: 'web', label: 'Web Server', icon: Server, compromised: activeIncidents > 0 },
    { id: 'app', label: 'Application', icon: Activity, compromised: activeIncidents > 0 && riskScore > 60 },
    { id: 'db', label: 'Database', icon: Database, compromised: activeIncidents > 0 && riskScore > 80 },
    { id: 'leak', label: 'Data Leak', icon: AlertCircle, compromised: activeIncidents > 0 && riskScore > 90 }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="bg-unionBlue rounded-xl p-6 shadow-lg relative overflow-hidden text-white"
      >
        <div className="absolute right-0 top-0 w-64 h-full bg-blue-800 opacity-20 transform skew-x-12 translate-x-10"></div>
        <div className="relative z-10 flex items-start space-x-4">
          <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm shadow-inner">
            <Zap className="text-yellow-400" size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-wide mb-1 flex items-center space-x-2">
              <span>AI Insight Detection</span>
              <span className="text-xs bg-unionRed text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold animate-pulse">Live</span>
            </h2>
            <p className="text-blue-100 text-lg lg:max-w-3xl">
              "High probability of ransomware attack due to exposed SMB port (445) detected on Core Banking DB. Recommend immediate isolation."
            </p>
          </div>
        </div>
      </motion.div>

      {/* 3 Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }} className="card hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-500 font-medium text-sm tracking-wide uppercase">System Risk Score</h3>
            <ShieldAlert className={getScoreColor(riskScore)} size={20} />
          </div>
          <div className="flex items-end space-x-2 mb-3">
            <span className={`text-4xl font-bold tracking-tight ${getScoreColor(riskScore)}`}>{riskScore}</span>
            <span className="text-gray-400 text-sm mb-1 pb-1">/ 100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${
                riskScore < 40 ? 'bg-green-500' : riskScore < 70 ? 'bg-yellow-500' : riskScore < 90 ? 'bg-orange-500' : 'bg-red-500'
              }`} 
              style={{ width: `${riskScore}%` }}
            ></div>
          </div>
        </motion.div>

        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="card hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-500 font-medium text-sm tracking-wide uppercase">Threat Level</h3>
            <Target className="text-unionBlue" size={20} />
          </div>
          <div className="flex items-center h-12">
            <span className={`px-4 py-2 rounded-lg text-lg uppercase tracking-wider font-bold shadow-sm ${getThreatColorBg(threatLevel)}`}>
              {threatLevel}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-4">Calculated continuously based on active vectors</p>
        </motion.div>

        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }} className="card hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-500 font-medium text-sm tracking-wide uppercase">Active Incidents</h3>
            <Activity className={activeIncidents > 0 ? 'text-unionRed animate-pulse' : 'text-green-500'} size={20} />
          </div>
          <div className="text-4xl font-bold tracking-tight text-gray-800">
            {activeIncidents}
          </div>
          <div className="mt-4 flex items-center space-x-1 text-xs font-semibold">
            {activeIncidents > 0 ? (
              <span className="text-unionRed flex items-center"><ChevronRight size={14}/> Immediate action required</span>
            ) : (
              <span className="text-green-600 flex items-center"><CheckCircle size={14} className="mr-1"/> Systems nominal</span>
            )}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Center Area: Attack Flow & Action Center */}
        <div className="lg:col-span-2 space-y-6">
          {/* Action Center */}
          <div className="card border-t-4 border-t-unionBlue">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><Zap className="mr-2 text-unionBlue" size={20} /> Action Center</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => navigate('/predict-attack')}
                className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-transparent bg-gray-50 hover:bg-white hover:border-blue-200 hover:shadow-md transition-all group"
              >
                <Target className="text-unionBlue mb-2 group-hover:scale-110 transition-transform" size={32} />
                <span className="font-semibold text-gray-800">Predict Attack</span>
              </button>
              
              <button 
                onClick={() => navigate('/simulate-attack')}
                disabled={role === 'Analyst'}
                className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-transparent bg-gray-50 hover:bg-white hover:border-red-200 hover:shadow-md transition-all group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-transparent disabled:hover:shadow-none"
              >
                <Activity className="text-unionRed mb-2 group-hover:scale-110 transition-transform" size={32} />
                <span className="font-semibold text-gray-800">Simulate Attack</span>
                {role === 'Analyst' && <span className="text-[10px] text-gray-400 mt-1 uppercase">Admin Only</span>}
              </button>

              <button 
                onClick={() => navigate('/ai-response')}
                className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-transparent bg-gray-50 hover:bg-white hover:border-blue-200 hover:shadow-md transition-all group"
              >
                <Bot className="text-unionBlue mb-2 group-hover:scale-110 transition-transform" size={32} />
                <span className="font-semibold text-gray-800">Gen-AI Response</span>
              </button>
            </div>
          </div>

          {/* Attack Flow Visualization */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center relative z-10">
              <Activity className="mr-2 text-unionBlue" size={20} /> Kill Chain Visualization
            </h3>
            <div className="flex items-center justify-between relative px-2 py-4">
              {/* the background line */}
              <div className="absolute top-1/2 left-8 right-8 h-1 bg-gray-200 -z-10 -translate-y-1/2 rounded"></div>
              {/* Highlight active path */}
              <div 
                className={`absolute top-1/2 left-8 h-1 -z-10 -translate-y-1/2 rounded transition-all duration-1000 ${activeIncidents > 0 ? 'bg-unionRed shadow-[0_0_10px_rgba(227,24,55,0.7)]' : 'bg-transparent'}`}
                style={{ width: `${(riskScore / 100) * 80}%` }}
              ></div>

              {flowNodes.map((node) => (
                <div key={node.id} className="flex flex-col items-center relative z-10 group">
                  <motion.div 
                    animate={{ 
                      scale: node.compromised ? [1, 1.1, 1] : 1,
                      boxShadow: node.compromised ? "0 0 15px rgba(227,24,55,0.5)" : "none"
                    }}
                    transition={{ repeat: node.compromised ? Infinity : 0, duration: 1.5 }}
                    className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 shadow-md border-2 transition-colors ${
                      node.compromised 
                        ? 'bg-red-50 border-unionRed text-unionRed' 
                        : 'bg-white border-gray-200 text-gray-500'
                    }`}
                  >
                    <node.icon size={24} />
                  </motion.div>
                  <span className={`text-xs font-bold text-center w-20 leading-tight ${node.compromised ? 'text-unionRed' : 'text-gray-500'}`}>
                    {node.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Alerts Panel */}
        <div className="card bg-gray-50 border-gray-200 shadow-inner overflow-hidden flex flex-col h-[500px]">
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <Bell className="mr-2 text-gray-600" size={20} /> Live Alerts
            </h3>
            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full font-semibold">{alerts.length} Total</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 px-2 pb-4 pt-1">
            <AnimatePresence>
              {alerts.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <CheckCircle size={40} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No active alerts detected.</p>
                </div>
              ) : (
                alerts.map(alert => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 rounded-xl border-l-4 shadow-sm bg-white cursor-pointer hover:bg-gray-50 transition-colors ${
                      alert.severity === 'Critical' ? 'border-unionRed' :
                      alert.severity === 'High' ? 'border-orange-500' :
                      alert.severity === 'Medium' ? 'border-yellow-500' : 'border-blue-400'
                    }`}
                  >
                    <div className="flex justify-between items-baseline mb-1">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                        alert.severity === 'Critical' ? 'bg-red-100 text-unionRed' :
                        alert.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                        alert.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-gray-800 mt-1 break-words">{alert.message}</div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                      <Server size={12} className="mr-1" /> {alert.system}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
