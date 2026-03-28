import React from 'react';
import { useAppContext } from '../store/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Activity, Zap, Server, Database, Globe, ShieldAlert, CheckCircle, ChevronRight, Bot, Bell, ArrowUp, ArrowDown, X, Clock, MoveRight } from 'lucide-react';
import {  } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { riskScore, threatLevel, activeIncidents, alerts, role, simulateAttack, updateRiskScore, triggerAlert, resolveIncident } = useAppContext();
  const [showAIResponse, setShowAIResponse] = React.useState(false);
  const [showPrediction, setShowPrediction] = React.useState(false);
  const [timeline, setTimeline] = React.useState([
    { id: 1, event: 'Suspicious login detected', time: '10:30 AM', type: 'warning' },
    { id: 2, event: 'Port scan detected on subnet 10.0.0.4', time: '10:32 AM', type: 'info' },
    { id: 3, event: 'Attack prediction model threshold triggered', time: '10:35 AM', type: 'system' }
  ]);

  // Simulated timeline update
  React.useEffect(() => {
    const interval = setInterval(() => {
      const events = [
        'Brute force attempt on SSH',
        'Outbound connection to known C2',
        'Policy violation: Unauthorized USB',
        'New vulnerability discovered: CVE-2024-1234'
      ];
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      setTimeline(prev => [
        { id: Date.now(), event: randomEvent, time: 'Just now', type: 'warning' },
        ...prev.slice(0, 4)
      ]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

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
    { id: 'user', label: 'User', icon: Globe, compromised: false, details: 'External Traffic' },
    { id: 'web', label: 'Web Server', icon: Server, compromised: activeIncidents > 0, details: 'Port 443 | Nginx' },
    { id: 'app', label: 'Application', icon: Activity, compromised: activeIncidents > 0 && riskScore > 60, details: 'Java Backend' },
    { id: 'db', label: 'Database', icon: Database, compromised: activeIncidents > 0 && riskScore > 80, details: 'MS SQL Server' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Urgency Message */}
      <AnimatePresence>
        {activeIncidents > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-3 text-unionRed"
          >
            <ShieldAlert size={16} className="animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">1 Critical Threat Detected. Immediate action recommended.</span>
            <div className="ml-auto w-1.5 h-1.5 bg-unionRed rounded-full animate-ping"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Predicted Attack Card */}
      <AnimatePresence>
        {showPrediction && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-indigo-900 text-white rounded-xl p-4 shadow-xl border border-indigo-500/30 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-400/20">
                <Target size={24} className="text-indigo-300" />
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-wide">Attack Prediction Active</h4>
                <p className="text-xs text-indigo-200 mb-2">AI Model predicts 78% likelihood of SQL Injection attempt in the next 4 hours.</p>
                <button 
                  onClick={() => {
                    setShowPrediction(false);
                    triggerAlert({
                      severity: 'Medium',
                      system: 'Web Server',
                      message: 'Preemptive patch applied based on AI prediction.'
                    });
                  }}
                  className="px-3 py-1 bg-white/20 hover:bg-white/40 rounded text-[10px] uppercase font-bold transition-colors"
                >
                  Patch Preemptively
                </button>
              </div>
            </div>
            <button onClick={() => setShowPrediction(false)} className="text-indigo-300 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner - Improved AI Insight */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-unionBlue to-blue-900 border-l-4 border-unionRed rounded-xl p-6 shadow-2xl relative overflow-hidden text-white font-sans"
      >
        <div className="absolute right-0 top-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.05),transparent)] flex-none"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-unionRed rounded-full animate-pulse shadow-[0_0_8px_rgba(227,24,55,0.8)]"></div>
              <h2 className="text-[10px] font-bold tracking-[0.2em] text-blue-200 uppercase flex items-center space-x-2">
                <span>AI Threat Intelligence</span>
              </h2>
            </div>
            <span className="text-[10px] bg-unionRed text-white px-2 py-0.5 rounded font-bold uppercase tracking-widest">Priority: High</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <p className="text-xl leading-relaxed font-medium">
                "High probability of <span className="text-unionRed font-bold underline decoration-2 underline-offset-4">Ransomware</span> attack due to exposed <span className="text-unionRed font-bold underline decoration-2 underline-offset-4">Port 445</span> (SMB) detected on Core Banking DB. Recommend immediate isolation."
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={() => {
                  updateRiskScore(Math.max(20, riskScore - 40));
                  resolveIncident();
                  triggerAlert({
                    severity: 'Low',
                    system: 'Core Banking DB',
                    message: 'Mitigation applied: SMB Port 445 closed on Database node.'
                  });
                }}
                className="px-6 py-3 bg-unionRed text-white text-sm font-bold rounded-lg hover:bg-red-700 active:scale-95 transition-all flex items-center space-x-2 shadow-lg hover:shadow-red-900/40"
              >
                <ShieldAlert size={18} />
                <span>Mitigate Now</span>
              </button>
              <button 
                onClick={() => setShowAIResponse(true)}
                className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg backdrop-blur-md transition-all flex items-center space-x-2 border border-white/10"
              >
                <Bot size={16} />
                <span>Generate AI Response</span>
              </button>
              <button className="px-4 py-3 bg-transparent hover:bg-white/5 text-blue-100 text-xs font-bold rounded-lg transition-all flex items-center space-x-2">
                <Target size={16} className="text-blue-300" />
                <span>View Attack Path</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3 Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }} className="card hover:shadow-lg transition-all border-b-4 border-b-unionRed/20">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-500 font-bold text-[10px] tracking-widest uppercase">System Risk Score</h3>
            <div className={`flex items-center text-xs font-bold px-2 py-0.5 rounded ${riskScore > 70 ? 'text-unionRed bg-red-50' : 'text-green-600 bg-green-50'}`}>
              {riskScore > 70 ? <ArrowUp size={12} className="mr-1" /> : <ArrowDown size={12} className="mr-1" />}
              {riskScore > 70 ? '12%' : '5%'}
            </div>
          </div>
          <div className="flex items-baseline space-x-2 mb-3">
            <span className={`text-5xl font-extrabold tracking-tighter ${getScoreColor(riskScore)}`}>{riskScore}</span>
            <span className="text-gray-400 text-sm font-medium">/ 100</span>
            <span className={`ml-auto text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
              riskScore > 80 ? 'bg-red-100 text-red-700' : 
              riskScore > 50 ? 'bg-yellow-100 text-yellow-700' : 
              'bg-blue-100 text-blue-700'
            }`}>
              {riskScore > 80 ? 'Critical' : riskScore > 50 ? 'Stable' : 'Improving'}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
            <div 
              className={`h-1.5 rounded-full transition-all duration-1000 ${
                riskScore < 40 ? 'bg-green-500' : riskScore < 70 ? 'bg-yellow-500' : riskScore < 90 ? 'bg-orange-500' : 'bg-red-500'
              }`} 
              style={{ width: `${riskScore}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-gray-500 leading-tight">
            <span className="font-bold text-gray-700">Insight:</span> Risk increased due to exposed SMB port 445 on database node.
          </p>
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
          <div className="card border-t-4 border-t-unionBlue shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 mb-6 flex items-center uppercase tracking-widest"><Zap className="mr-2 text-unionBlue" size={16} /> Action Center</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <button 
                onClick={() => setShowAIResponse(true)}
                className="flex-1 flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-unionBlue/10 bg-unionBlue text-white hover:bg-unionBlue/90 hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-150 transition-transform">
                  <Bot size={80} />
                </div>
                <Bot className="mb-3 group-hover:scale-110 transition-transform" size={40} />
                <span className="font-bold text-lg">Generate AI Response</span>
                <span className="text-[10px] opacity-70 uppercase tracking-tighter mt-1">Primary Response Protocol</span>
              </button>

              <div className="flex flex-col gap-4 flex-[0.7]">
                <button 
                  onClick={() => simulateAttack('Ransomware', ['Web Server'])}
                  disabled={role === 'Analyst'}
                  className="flex items-center space-x-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-unionRed hover:shadow-md transition-all group disabled:opacity-50"
                >
                  <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center text-unionRed group-hover:bg-unionRed group-hover:text-white transition-colors">
                    <Activity size={24} />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold text-gray-800 group-hover:text-unionRed transition-colors">Simulate Attack</span>
                    <span className="text-[10px] text-gray-400 uppercase">Secondary Action</span>
                  </div>
                </button>
                
                <button 
                  onClick={() => {
                    setShowPrediction(true);
                    setTimeout(() => setShowPrediction(false), 8000);
                  }}
                  className="flex items-center space-x-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-unionBlue hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-unionBlue group-hover:bg-unionBlue group-hover:text-white transition-colors">
                    <Target size={24} />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold text-gray-800 group-hover:text-unionBlue transition-colors">Predict Attack</span>
                    <span className="text-[10px] text-gray-400 uppercase">Tertiary Action</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="card border-l-4 border-l-green-500 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center uppercase tracking-widest"><CheckCircle className="mr-2 text-green-500" size={16} /> AI Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Close SMB port 445', system: 'Core DB', icon: ShieldAlert, color: 'text-orange-500', bg: 'bg-orange-50' },
                { title: 'Enable MFA', system: 'User Portal', icon: Target, color: 'text-blue-500', bg: 'bg-blue-50' },
                { title: 'Apply latest patch', system: 'Web Server', icon: Zap, color: 'text-green-500', bg: 'bg-green-50' }
              ].map((rec, i) => (
                <div key={i} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 border border-gray-100 hover:border-gray-300 transition-all cursor-pointer">
                  <div className={`p-2 rounded-lg ${rec.bg} ${rec.color}`}>
                    <rec.icon size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-800">{rec.title}</div>
                    <div className="text-[10px] text-gray-500 font-medium uppercase">{rec.system}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kill Chain Visualization */}
          <div className="card shadow-sm overflow-hidden">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-sm font-bold text-gray-800 flex items-center uppercase tracking-widest">
                <Activity className="mr-2 text-unionBlue" size={16} /> Kill Chain Visualization
              </h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase">
                  <div className="w-2 h-2 rounded-full bg-unionRed mr-1 shadow-[0_0_5px_rgba(227,24,55,0.5)]"></div> Compromised
                </div>
                <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase">
                  <div className="w-2 h-2 rounded-full bg-gray-200 mr-1"></div> Secure
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between relative px-2 py-8">
              {/* the background line */}
              <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gray-100 -z-10 -translate-y-1/2"></div>
              
              {/* Highlight active path */}
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: activeIncidents > 0 ? `${(riskScore / 100) * 100}%` : 0 }}
                className="absolute top-1/2 left-4 h-0.5 -z-10 -translate-y-1/2 bg-gradient-to-r from-unionBlue to-unionRed shadow-[0_0_10px_rgba(227,24,55,0.3)] transition-all duration-1000"
              ></motion.div>

              {flowNodes.map((node, i) => (
                <React.Fragment key={node.id}>
                  <div className="flex flex-col items-center relative z-10 group">
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ 
                        scale: node.compromised ? [1, 1.15, 1] : 1,
                        opacity: 1,
                        borderColor: node.compromised ? '#E31837' : '#e5e7eb',
                        backgroundColor: node.compromised ? '#fffafa' : '#ffffff'
                      }}
                      transition={{ 
                        scale: { repeat: node.compromised ? Infinity : 0, duration: 2, ease: "easeInOut" },
                        delay: i * 0.1
                      }}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-sm border-2 transition-all group-hover:shadow-lg cursor-help relative`}
                    >
                      <node.icon size={24} className={node.compromised ? 'text-unionRed' : 'text-gray-400 group-hover:text-unionBlue transition-colors'} />
                      
                      {/* Tooltip */}
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-xl border border-white/10">
                        <div className="font-bold">{node.label}</div>
                        <div className="text-blue-300 font-mono text-[9px]">{node.details}</div>
                      </div>

                      {node.compromised && (
                        <>
                          <motion.div 
                            animate={{ opacity: [0.2, 0.5, 0.2] }} 
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="absolute inset-0 bg-unionRed/20 rounded-2xl -z-10"
                          ></motion.div>
                          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
                             <span className="text-[9px] font-black text-unionRed uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded border border-red-100 shadow-sm">Current breach point: Web Server</span>
                          </div>
                        </>
                      )}
                    </motion.div>
                    <span className={`text-[10px] font-bold tracking-tight mt-1 ${node.compromised ? 'text-unionRed' : 'text-gray-400 uppercase'}`}>
                      {node.label}
                    </span>
                  </div>
                  {i < flowNodes.length - 1 && (
                    <div className="flex-1 flex justify-center">
                      <MoveRight size={16} className={`${activeIncidents > 0 && flowNodes[i].compromised ? 'text-unionRed animate-pulse' : 'text-gray-200'}`} />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Alerts Panel */}
        <div className="space-y-6">
          <div className="card bg-white border-gray-100 shadow-xl overflow-hidden flex flex-col h-[525px]">
            <div className="flex justify-between items-center mb-6 px-2">
              <h3 className="text-xs font-black text-gray-800 flex items-center uppercase tracking-widest">
                <Bell className="mr-2 text-unionRed animate-pulse" size={14} /> Live Security Alerts
              </h3>
              <span className="text-[10px] bg-red-50 text-unionRed px-2 py-0.5 rounded-full font-bold border border-red-100">{alerts.length} Active</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 px-2 pb-4 pt-1">
              <AnimatePresence>
                {alerts.length === 0 ? (
                  <div className="text-center py-10 text-gray-300">
                    <CheckCircle size={40} className="mx-auto mb-2 opacity-20" />
                    <p className="text-xs font-medium">Clear Skies. No threats.</p>
                  </div>
                ) : (
                  alerts.map(alert => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                        boxShadow: alert.severity === 'Critical' ? "0 0 15px rgba(227,24,55,0.15)" : "none"
                      }}
                      className={`p-4 rounded-xl border-l-4 bg-white border border-gray-100 hover:border-gray-200 transition-all group overflow-hidden relative cursor-pointer ${
                        alert.severity === 'Critical' ? 'border-l-unionRed' :
                        alert.severity === 'High' ? 'border-l-orange-500' :
                        alert.severity === 'Medium' ? 'border-l-yellow-500' : 'border-l-blue-400'
                      }`}
                      onClick={() => setShowAIResponse(true)}
                    >
                      {alert.severity === 'Critical' && (
                        <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 -rotate-45 translate-x-12 -translate-y-12 rounded-full animate-pulse group-hover:bg-red-500/10 transition-colors"></div>
                      )}
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-[9px] uppercase font-black tracking-widest px-1.5 py-0.5 rounded ${
                          alert.severity === 'Critical' ? 'bg-red-50 text-unionRed animate-pulse' :
                          alert.severity === 'High' ? 'bg-orange-50 text-orange-700' :
                          'bg-gray-50 text-gray-600'
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="text-[9px] text-gray-400 font-bold flex items-center">
                          <Clock size={10} className="mr-1" /> Just now
                        </span>
                      </div>
                      <div className="text-xs font-bold text-gray-800 leading-snug mb-3 pr-2">
                         {alert.severity === 'Critical' ? 'Possible brute force attack on Web Server (Port 443)' : alert.message}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-[10px] text-gray-400 font-medium flex items-center">
                          <Server size={10} className="mr-1" /> {alert.system}
                        </div>
                        <button 
                          className="px-2 py-1 bg-unionBlue text-white text-[9px] font-bold rounded hover:bg-blue-700 transition-colors flex items-center"
                        >
                          Investigate <ChevronRight size={10} className="ml-0.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          </div>
        </div>

      {/* System Activity Timeline - Moved to Bottom */}
      <div className="grid grid-cols-1 gap-6">
        <div className="card bg-gray-900 border-none shadow-2xl text-white overflow-hidden relative">
          {/* Cyber-grid background for timeline */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#4a5568 1px, transparent 1px), linear-gradient(90deg, #4a5568 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 p-2">
            <div>
              <h3 className="text-xs font-black text-blue-400 mb-2 flex items-center uppercase tracking-[0.2em]">
                <Activity className="mr-2 text-unionBlue" size={14} /> System Activity Log
              </h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Real-time Security Event Monitoring</p>
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {timeline.map((item) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start space-x-4 border-l-2 border-gray-800 pl-4 py-1"
                >
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 shadow-[0_0_10px_rgba(255,255,255,0.1)] ${
                    item.type === 'warning' ? 'bg-unionRed shadow-[0_0_8px_rgba(227,24,55,0.6)]' : 
                    item.type === 'info' ? 'bg-unionBlue' : 'bg-green-500'
                  }`}></div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-100">{item.event}</span>
                    <span className="text-[9px] text-gray-500 font-bold mt-1 uppercase tracking-tighter">{item.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center text-blue-400 space-x-2 bg-blue-500/10 px-3 py-2 rounded-lg border border-blue-500/20">
               <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
               <span className="text-[10px] font-bold uppercase tracking-widest">Feed Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Response Drawer */}
      <AnimatePresence>
        {showAIResponse && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAIResponse(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[101] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-unionBlue text-white">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Bot size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Gen-AI Response</h3>
                    <p className="text-[10px] text-blue-200 uppercase tracking-widest font-bold">Threat Mitigation Protocol</p>
                  </div>
                </div>
                <button onClick={() => setShowAIResponse(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <section>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[.2em] mb-4">Incident Summary</h4>
                  <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                    <p className="text-sm font-bold text-unionRed">Ransomware attack pattern detected via SMB (Port 445) targeting core banking servers.</p>
                  </div>
                </section>

                <section>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[.2em] mb-4">Step-by-Step Response</h4>
                  <div className="space-y-4">
                    {[
                      { step: 1, text: 'Identify and isolate compromised DB node (10.0.0.12)' },
                      { step: 2, text: 'Block Port 445 across entire internal subnet' },
                      { step: 3, text: 'Revoke access for compromised service accounts' },
                      { step: 4, text: 'Initiate snapshot recovery for encrypted files' }
                    ].map(s => (
                      <div key={s.step} className="flex items-start space-x-3">
                        <div className="w-5 h-5 rounded-full bg-unionBlue text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{s.step}</div>
                        <p className="text-sm text-gray-700 font-medium">{s.text}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[.2em] mb-4">Root Cause</h4>
                  <p className="text-sm text-gray-700 font-medium leading-relaxed">
                    Legacy SMBv1 protocol was enabled on standard OS image, allowing EternalBlue-style exploitation from a compromised vendor endpoint.
                  </p>
                </section>

                <section>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[.2em] mb-4">Remediation Actions</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <button className="w-full p-4 rounded-xl border border-unionBlue/20 bg-blue-50/50 flex items-center justify-between group hover:bg-unionBlue hover:text-white transition-all">
                      <div className="flex items-center space-x-3 text-left">
                        <ShieldAlert size={18} className="text-unionBlue group-hover:text-white" />
                        <span className="text-xs font-bold">Apply Hotfix KB504938</span>
                      </div>
                      <ChevronRight size={16} />
                    </button>
                    <button className="w-full p-4 rounded-xl border border-red-200 bg-red-50/50 flex items-center justify-between group hover:bg-unionRed hover:text-white transition-all">
                      <div className="flex items-center space-x-3 text-left">
                        <Zap size={18} className="text-unionRed group-hover:text-white" />
                        <span className="text-xs font-bold">Disable SMB Globally</span>
                      </div>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </section>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex space-x-4">
                <button className="flex-1 py-3 bg-unionBlue text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-900/10 active:scale-95 transition-all">Execute All Mitigations</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
