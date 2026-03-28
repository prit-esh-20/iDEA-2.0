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
    { id: 1, event: 'Alert: Possible ransomware signature detected', time: '10:30 AM', type: 'warning', severity: 'High' },
    { id: 2, event: 'Port scan activity detected on subnet 10.0.0.4', time: '10:32 AM', type: 'info', severity: 'Medium' },
    { id: 3, event: 'Attack prediction: Escalation likely on App Server', time: '10:35 AM', type: 'system', severity: 'High' },
    { id: 4, event: 'Unauthorized USB access on terminal CRT-02', time: '10:37 AM', type: 'warning', severity: 'High' }
  ]);

  const [recommendations, setRecommendations] = React.useState([
    { id: 1, title: 'Close SMB port 445', system: 'Core DB', icon: ShieldAlert, priority: 'High', status: 'Pending', desc: 'Port 445 is vulnerable to external access / lateral movement' },
    { id: 2, title: 'Enable MFA', system: 'Cloud Portal', icon: Target, priority: 'Medium', status: 'Pending', desc: 'Ensure all admin accounts use hardware tokens / TOTP' },
    { id: 3, title: 'Patch CVE-2024-1234', system: 'Web Server', icon: Zap, priority: 'High', status: 'Pending', desc: 'Critical RCE vulnerability found in Nginx module' }
  ]);

  const handleApplyFix = (id: number) => {
    setRecommendations(prev => prev.map(rec => {
      if (rec.id === id) {
        updateRiskScore(Math.max(20, riskScore - 15));
        setTimeline(t => [
          { id: Date.now(), event: `Fix applied: ${rec.title} closed`, time: 'Just now', type: 'success', severity: 'Low' },
          ...t
        ]);
        return { ...rec, status: 'Resolved' };
      }
      return rec;
    }));
  };

  // Simulated timeline update
  React.useEffect(() => {
    const interval = setInterval(() => {
      const events = [
        { text: 'Brute force access attempt on SSH', sev: 'High' },
        { text: 'Outbound connection to known C2', sev: 'High' },
        { text: 'Policy violation: Unauthorized USB', sev: 'Medium' },
        { text: 'New vulnerability: CVE-2024-1234', sev: 'High' }
      ];
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      setTimeline(prev => [
        { id: Date.now(), event: randomEvent.text, time: 'Just now', type: 'warning', severity: randomEvent.sev },
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
                <h4 className="font-bold text-sm tracking-wide flex items-center uppercase tracking-[0.1em]">
                  <Target size={14} className="mr-2" /> Attack Prediction Active
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 mb-3">
                  <div className="text-[10px]"><span className="opacity-50 uppercase font-bold mr-1">Type:</span> SQL Injection</div>
                  <div className="text-[10px]"><span className="opacity-50 uppercase font-bold mr-1">Prob:</span> 78.4%</div>
                  <div className="text-[10px] col-span-2 text-indigo-200"><span className="opacity-50 uppercase font-bold mr-1">System:</span> Web Server (VLAN-2)</div>
                </div>
                <button 
                  onClick={() => {
                    setShowPrediction(false);
                    triggerAlert({
                      severity: 'Medium',
                      system: 'Web Server',
                      message: 'Preemptive patch applied. Threat Mitigated.'
                    });
                  }}
                  className="px-3 py-1 bg-white/20 hover:bg-white/40 rounded text-[10px] uppercase font-bold transition-colors border border-white/10"
                >
                  Apply Remediation
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
              <h2 className="text-sm font-bold tracking-[0.2em] text-blue-200 uppercase flex items-center space-x-2">
                <span>AI Threat Intelligence</span>
              </h2>
            </div>
            <span className="text-xs bg-unionRed text-white px-3 py-1 rounded font-bold uppercase tracking-widest">Priority: High</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <p className="text-2xl leading-relaxed font-medium">
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
            <span className={`ml-auto text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wider ${
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
          <p className="text-[13px] text-gray-500 leading-tight flex items-center justify-between">
            <span><span className="font-bold text-gray-700">Insight:</span> Risk increased due to exposed SMB port 445.</span>
            <span className="text-[11px] font-black text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100 uppercase tracking-tighter ml-2">Status: {riskScore < 50 ? 'Mitigated' : 'Active'}</span>
          </p>
        </motion.div>

        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="card hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-500 font-medium text-base tracking-wide uppercase">Threat Level</h3>
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
            <h3 className="text-gray-500 font-medium text-base tracking-wide uppercase">Active Incidents</h3>
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
            <h3 className="text-base font-bold text-gray-800 mb-6 flex items-center uppercase tracking-widest"><Zap className="mr-2 text-unionBlue" size={18} /> Action Center</h3>
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
                  onClick={() => {
                    simulateAttack('Ransomware', ['Web Server']);
                    setTimeline(t => [
                      { id: Date.now(), event: 'Simulated Attack: Ransomware sequence initiated', time: 'Just now', type: 'warning', severity: 'High' },
                      ...t
                    ]);
                  }}
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
          <div className="card border-l-4 border-l-unionBlue shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
            <h3 className="text-base font-bold text-gray-800 mb-6 flex items-center uppercase tracking-widest"><CheckCircle className="mr-2 text-unionBlue" size={18} /> AI Recommendations Center</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((rec) => (
                <motion.div 
                  key={rec.id} 
                  animate={{ opacity: rec.status === 'Resolved' ? 0.6 : 1 }}
                  className={`flex flex-col p-4 rounded-xl bg-white border border-gray-100 hover:border-unionBlue/30 hover:shadow-lg transition-all relative group ${rec.status === 'Resolved' ? 'grayscale-[0.5]' : ''}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2.5 rounded-xl bg-gray-50 ${rec.status === 'Resolved' ? 'text-green-500' : 'text-unionBlue'}`}>
                      {rec.status === 'Resolved' ? <CheckCircle size={20} /> : <rec.icon size={20} />}
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border mb-1.5 ${
                        rec.priority === 'High' ? 'bg-red-50 text-unionRed border-red-100' : 
                        rec.priority === 'Medium' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                        'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                        {rec.priority}
                      </span>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${
                        rec.status === 'Resolved' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-500 border-gray-100'
                      }`}>
                        {rec.status}
                      </span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="text-xs font-black text-gray-800 leading-tight mb-1">{rec.title}</div>
                    <div className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter mb-2">{rec.system}</div>
                    <div className="text-[10px] text-gray-500 font-medium leading-normal line-clamp-2 italic">“{rec.desc}”</div>
                  </div>
                  
                  {rec.status !== 'Resolved' && (
                    <button 
                      onClick={() => handleApplyFix(rec.id)}
                      className="mt-auto w-full py-2 bg-unionRed/5 hover:bg-unionRed text-unionRed hover:text-white text-[10px] font-bold rounded-lg border border-unionRed/20 hover:border-unionRed transition-all uppercase tracking-widest active:scale-95"
                    >
                      Apply Fix
                    </button>
                  )}
                  
                  {rec.status === 'Resolved' && (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      className="mt-auto w-full py-2 text-center text-green-600 text-[10px] font-bold uppercase tracking-widest bg-green-50 rounded-lg border border-green-100 flex items-center justify-center"
                    >
                      <CheckCircle size={12} className="mr-1.5" /> Resolved
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Kill Chain Visualization */}
          <div className="card shadow-sm overflow-hidden">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-sm font-bold text-gray-800 flex items-center uppercase tracking-widest">
                <Activity className="mr-2 text-unionBlue" size={16} /> Attack Execution Flow
              </h3>
              <div className="flex items-center space-x-6">
                <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                   <div className="flex items-center space-x-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                     <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-unionRed mr-2 shadow-[0_0_5px_rgba(227,24,55,0.5)]"></div> Compromised</span>
                     <span className="opacity-20 text-gray-900 mx-1">|</span>
                     <span className="flex items-center text-green-600"><div className="w-2 h-2 rounded-full bg-green-500 mr-2 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div> Secure</span>
                   </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between relative px-2 py-8">
              {/* the background line */}
              <div className="absolute top-1/2 left-8 right-8 h-1 bg-gray-100 rounded-full -z-10 -translate-y-1/2"></div>
              
              {/* Highlight active path */}
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: activeIncidents > 0 ? `${(riskScore / 100) * 100}%` : 0 }}
                className="absolute top-1/2 left-8 h-1 -z-10 -translate-y-1/2 bg-gradient-to-r from-unionBlue via-unionBlue to-unionRed shadow-[0_0_15px_rgba(30,58,138,0.2)] transition-all duration-1000 rounded-full"
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
                      <node.icon size={28} className={node.compromised ? 'text-unionRed' : i === 0 ? 'text-unionBlue' : 'text-blue-900/40 group-hover:text-unionBlue transition-colors'} />
                      
                      {/* Tooltip */}
                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gray-900/95 backdrop-blur-md text-white text-[10px] py-2.5 px-4 rounded-xl opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 whitespace-nowrap pointer-events-none z-50 shadow-2xl border border-white/10 uppercase tracking-widest translate-y-2 group-hover:translate-y-0">
                        <div className={`font-black mb-1.5 text-[11px] ${node.compromised ? 'text-unionRed' : 'text-blue-400'}`}>{node.label}: {node.compromised ? 'COMPROMISED' : 'SECURE'}</div>
                        <div className="text-gray-300 font-bold text-[9px] tracking-tight">{node.compromised ? 'Suspicious traffic detected on this node' : 'No active threats detected'}</div>
                      </div>

                      {node.compromised && (
                        <>
                          <motion.div 
                            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.15, 1] }} 
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="absolute inset-0 bg-unionRed/20 rounded-2xl -z-10 shadow-[0_0_25px_rgba(227,24,55,0.5)] border-2 border-unionRed"
                          ></motion.div>
                          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
                             <motion.span 
                                animate={{ opacity: [1, 0.7, 1], scale: [1, 1.05, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="text-[11px] font-black text-unionRed uppercase tracking-[0.2em] bg-red-50 px-3 py-1 rounded border border-red-100 shadow-[0_2px_10px_rgba(227,24,55,0.1)] block"
                              >
                                ⚠ Breach Point
                              </motion.span>
                          </div>
                        </>
                      )}
                    </motion.div>
                    <span className={`text-xs font-black tracking-[0.1em] mt-1 ${node.compromised ? 'text-unionRed underline decoration-2 underline-offset-4' : 'text-gray-400 uppercase'}`}>
                      {node.label}
                    </span>
                  </div>
                   {i < flowNodes.length - 1 && (
                    <div className="flex-1 flex flex-col items-center justify-center -mt-6">
                      <div className="flex items-center space-x-1 overflow-hidden h-6">
                        {[1, 2, 3, 4, 5].map(dot => (
                          <motion.div 
                            key={dot}
                            animate={{ 
                              x: [0, 40], 
                              opacity: [0, 1, 0],
                              scale: activeIncidents > 0 && i === 1 ? [1, 2, 1] : [1, 1.2, 1]
                            }}
                            transition={{ repeat: Infinity, duration: 1.2, delay: dot * 0.2 }}
                            className={`w-1.5 h-1.5 rounded-full ${activeIncidents > 0 && i === 1 ? 'bg-unionRed shadow-[0_0_10px_rgba(227,24,55,0.5)]' : 'bg-blue-400/30'}`}
                          ></motion.div>
                        ))}
                      </div>
                      <div className="flex items-center text-unionBlue/40 mt-1">
                        <MoveRight size={20} className={`${activeIncidents > 0 && flowNodes[i].compromised ? 'text-unionRed animate-pulse' : 'text-unionBlue/40'}`} />
                      </div>
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
              <h3 className="text-sm font-black text-gray-800 flex items-center uppercase tracking-widest">
                <Bell className="mr-2 text-unionRed animate-pulse" size={16} /> Live Security Alerts
              </h3>
              <span className="text-xs bg-red-50 text-unionRed px-3 py-1 rounded-full font-bold border border-red-100">{alerts.length} Active</span>
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

      {/* System Activity Timeline - Strict Vertical Structure */}
      <div className="grid grid-cols-1 gap-6">
        <div className="card bg-white border-gray-100 shadow-xl relative overflow-hidden group">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-[10px] font-black text-unionBlue mb-2 flex items-center uppercase tracking-[0.3em]">
                <Activity className="mr-2 animate-pulse" size={14} /> LIVE ACTIVITY TIMELINE
              </h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Real-time threat landscape monitoring</p>
            </div>
            <div className="flex items-center space-x-3 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
               <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></div>
               <span className="text-[9px] font-black uppercase tracking-widest text-blue-800">Tracking Active Feed</span>
            </div>
          </div>
          
          <div className="relative pl-8 pb-4">
            {/* Vertical Line */}
            <div className="absolute left-[39px] top-0 bottom-0 w-0.5 bg-gray-100"></div>
            
            <div className="space-y-8">
              {timeline.map((item, idx) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start relative z-10"
                >
                  <div className="w-24 text-xs font-black text-gray-300 uppercase tracking-tighter pt-1 flex-shrink-0">
                    {item.time}
                  </div>
                  
                  <div className={`w-4 h-4 rounded-full border-2 border-white flex-shrink-0 mt-1 relative z-10 shadow-sm ${
                    item.severity === 'High' ? 'bg-unionRed' : 
                    item.severity === 'Medium' ? 'bg-yellow-400' : 
                    'bg-blue-400'
                  }`}>
                    {idx === 0 && (
                      <motion.div 
                        animate={{ opacity: [0, 1, 0], scale: [1, 2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className={`absolute inset-0 rounded-full -z-10 ${
                          item.severity === 'High' ? 'bg-red-400' : 'bg-blue-300'
                        }`}
                      />
                    )}
                  </div>
                  
                  <div className="ml-8 flex flex-col pt-0.5">
                    <div className="text-sm font-black text-gray-800 tracking-tight flex items-center">
                      {item.event}
                      {idx === 0 && <span className="ml-4 text-[10px] bg-red-100 text-unionRed px-2 py-1 rounded font-black uppercase animate-pulse">New</span>}
                    </div>
                    <div className="flex items-center mt-2.5 space-x-4">
                       <span className={`text-[10px] font-black uppercase px-3 py-1 rounded border flex items-center ${
                         item.severity === 'High' ? 'bg-red-50 text-unionRed border-red-100' : 
                         item.severity === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                         'bg-blue-50 text-blue-600 border-blue-100'
                       }`}>
                          <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                            item.severity === 'High' ? 'bg-unionRed' : 
                            item.severity === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}></div>
                          {item.severity} SEVERITY
                       </span>
                       <span className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">System Node: VLAN-SEC-04</span>
                    </div>
                  </div>
                </motion.div>
              ))}
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
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
              />
              <motion.div 
                initial={{ x: '100%', filter: 'blur(10px)' }}
                animate={{ x: 0, filter: 'blur(0px)' }}
                exit={{ x: '100%', filter: 'blur(10px)' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 bottom-0 w-full max-w-[480px] bg-white shadow-2xl z-[201] overflow-hidden flex flex-col"
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
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[.2em] mb-4">Step-by-Step Response Plan</h4>
                  <div className="space-y-4">
                    {[
                      { step: 1, text: 'Isolate affected system from network' },
                      { step: 2, text: 'Block suspicious IP traffic' },
                      { step: 3, text: 'Disable SMB port 445' },
                      { step: 4, text: 'Run malware scan' },
                      { step: 5, text: 'Restore affected systems from backup' }
                    ].map(s => (
                      <div key={s.step} className="flex items-start space-x-3">
                        <div className="w-5 h-5 rounded-full bg-unionBlue text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{s.step}</div>
                        <p className="text-sm text-gray-700 font-medium">{s.text}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[.2em] mb-4">Remediation Actions</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-700 font-medium">
                      <CheckCircle size={16} className="text-green-500" />
                      <span>Apply latest security patches</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-700 font-medium">
                      <CheckCircle size={16} className="text-green-500" />
                      <span>Enable firewall rules</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-700 font-medium">
                      <CheckCircle size={16} className="text-green-500" />
                      <span>Enforce multi-factor authentication</span>
                    </div>
                  </div>
                </section>

                <section>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[.2em] mb-4">Root Cause Analysis</h4>
                  <p className="text-sm text-gray-700 font-medium leading-relaxed">
                    Open SMB port and lack of proper access control exposed the system to external threats.
                  </p>
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
