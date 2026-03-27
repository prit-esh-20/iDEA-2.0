import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Bot, Zap, Activity, ShieldAlert, Cpu, FileText, Globe, CheckCircle2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AIResponse: React.FC = () => {
  const { activeIncidents, alerts, threatLevel, resolveIncident, generateReport } = useAppContext();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isResolved, setIsResolved] = useState(false);
  const [report, setReport] = useState<any>(null);

  const activeAlerts = alerts.filter(a => a.severity === 'Critical' || a.severity === 'High');
  const typeStr = activeAlerts.length > 0 ? activeAlerts[0].message.split(' ')[0] : 'Unknown';
  const sysStr = activeAlerts.length > 0 ? activeAlerts[0].system : 'Network Infrastructure';

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setReport({
        type: `${typeStr} Attack`,
        summary: `At ${new Date().toLocaleTimeString()} an automated monitoring agent detected anomalous behavioral patterns consistent with a ${typeStr} actor attempting lateral movement within ${sysStr}. AI Engine isolated the threat path to prevent data egress.`,
        responsePlan: [
          'Halt vulnerable services to freeze payload propagation.',
          'Isolate affected subnet from core banking switches.',
          'Capture forensic artifacts (memory dump & pcap).',
          'Deploy behavioral heuristic blocking rules to perimeter Firewall.'
        ],
        remediationActions: [
          `Apply emergency security patch MS-2026-X on ${sysStr}.`,
          'Reset all administrative credentials active during the breach window.',
          'Restore encrypted database segments from offsite Immutable Backup.',
          'Conduct complete antimalware scan of hypervisor hosts.'
        ],
        rootCause: `Initial vector analysis points to a compromised employee credential bypassing single-factor remote access, followed by exploitation of unpatched SMB vulnerability on ${sysStr} allowing unauthorized code execution.`
      });
    }, 2500);
  };

  const handleResolve = () => {
    if (report) {
      generateReport(report);
      resolveIncident();
      setIsResolved(true);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-800 flex items-center">
            <Bot size={28} className="mr-3 text-unionBlue" /> Gen-AI SOC Response
          </h1>
          <p className="text-gray-500 mt-1">Automated cognitive incident analysis and containment protocols.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-unionBlue bg-blue-50 px-3 py-1.5 rounded-full shadow-sm border border-blue-100 font-bold tracking-wider">
          <Zap size={16} />
          <span>v4.2 Analysis Engine</span>
        </div>
      </div>

      {!activeIncidents && !isResolved && (
        <div className="card text-center py-20 px-6 bg-white border-2 border-dashed border-gray-200 shadow-sm flex flex-col items-center">
          <ShieldCheck size={80} className="text-green-500 mb-6 opacity-80" />
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2 tracking-tight">No Active Incidents</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            The infrastructure is currently secure. Gen-AI response panel remains on standby for the next automated detection event.
          </p>
          <button 
            onClick={() => navigate('/simulate-attack')}
            className="btn-outline border-2 px-8 py-3 text-sm tracking-wider uppercase bg-gray-50 flex items-center hover:bg-unionBlue hover:text-white transition-all shadow-md group"
          >
            Launch Simulation <Activity className="ml-2 group-hover:scale-110 transition-transform" size={18} />
          </button>
        </div>
      )}

      {isResolved && (
         <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card text-center py-16 px-6 bg-green-50 border-2 border-green-200">
           <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" />
           <h2 className="text-2xl font-bold text-green-800 mb-2">Threat Contained Successfully</h2>
           <p className="text-green-700 font-medium mb-6">The AI-recommended actions were applied. System risk score restored to operational levels.</p>
           <div className="flex justify-center space-x-4">
             <button onClick={() => navigate('/dashboard')} className="btn-primary flex items-center shadow-lg"><Globe className="mr-2" size={18} /> Return to Dashboard</button>
             <button onClick={() => navigate('/reports')} className="btn-outline flex items-center bg-white shadow bg-green-50 border-green-600 text-green-700 hover:bg-green-600"><FileText className="mr-2" size={18} /> View Report</button>
           </div>
         </motion.div>
      )}

      {activeIncidents > 0 && !report && !isResolved && (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="card bg-unionRed text-white p-8 relative overflow-hidden shadow-xl border-b-4 border-red-900">
          <div className="absolute right-0 top-0 w-64 h-full bg-red-900 opacity-20 transform skew-x-12 translate-x-10"></div>
          
          <div className="relative z-10">
            <div className="flex items-center text-red-200 mb-2 space-x-2 font-bold tracking-wider uppercase text-xs">
              <ShieldAlert size={14} className="animate-pulse" /> <span>Critical SOC Event Detected</span>
            </div>
            <h2 className="text-4xl font-extrabold mb-4 tracking-tight drop-shadow-md">"{typeStr}" Attempt</h2>
            <div className="flex items-center space-x-4 mb-8">
              <span className="bg-red-900/50 backdrop-blur-md px-3 py-1 rounded font-mono text-sm border border-red-400/30">Target: {sysStr}</span>
              <span className="bg-red-900/50 backdrop-blur-md px-3 py-1 rounded font-mono text-sm border border-red-400/30 font-bold text-yellow-300">Level: {threatLevel}</span>
            </div>
            
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full py-4 rounded-xl flex justify-center items-center font-extrabold text-lg transition-all shadow-2xl ${
                isGenerating ? 'bg-red-800 text-red-300 cursor-not-allowed' : 'bg-white text-unionRed hover:bg-red-50 hover:-translate-y-1 active:scale-95'
              }`}
            >
              {isGenerating ? (
                <><Cpu className="animate-spin mr-3" size={24} /> Compiling AI Context & Playbooks...</>
              ) : (
                <><Bot className="mr-3" size={24} /> Generate Tactical Response Plan</>
              )}
            </button>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {report && !isResolved && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* The SOC Report Style */}
            <div className="bg-white border text-gray-800 shadow-xl overflow-hidden font-sans border-blue-200 relative mb-8">
              <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-unionRed to-unionBlue"></div>
              
              <div className="px-8 py-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <div className="flex items-center">
                  <Bot className="text-unionBlue mr-3" size={32} />
                  <div>
                    <h3 className="font-bold text-xl uppercase tracking-widest text-unionBlue flex gap-2">Automated Incident Response Plan</h3>
                    <p className="text-xs text-gray-500 font-mono tracking-tight mt-0.5">Reference ID: UBAI-IR-{Date.now().toString().slice(-6)} • Classification: TLP: AMBER</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                   <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Severity</div>
                   <div className="bg-red-100 text-unionRed px-3 py-0.5 rounded text-sm font-black tracking-widest uppercase border border-red-200 shadow-sm">{threatLevel}</div>
                </div>
              </div>

              <div className="p-8 space-y-8">
                {/* Gen AI Output text */}
                <div className="grid grid-cols-1 gap-8">
                  <div>
                    <h4 className="flex items-center font-bold text-gray-800 text-sm uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">
                      <FileText className="mr-2 text-unionBlue" size={16} /> Incident Summary
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed font-medium bg-blue-50 p-4 rounded-lg border border-blue-100 italic">
                      {report.summary}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="flex items-center font-bold text-gray-800 text-sm uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                        <Activity className="mr-2 text-unionBlue" size={16} /> Step-by-Step Playbook
                      </h4>
                      <div className="space-y-3">
                        {report.responsePlan.map((step: string, i: number) => (
                           <div key={i} className="flex text-sm">
                             <span className="flex-shrink-0 w-6 h-6 rounded bg-unionBlue text-white flex items-center justify-center font-bold text-xs mr-3 shadow-sm">{i+1}</span>
                             <span className="text-gray-700 font-medium pt-0.5">{step}</span>
                           </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="flex items-center font-bold text-gray-800 text-sm uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                        <ShieldCheck className="mr-2 text-unionBlue" size={16} /> Remediation Actions
                      </h4>
                      <div className="space-y-3">
                        {report.remediationActions.map((action: string, i: number) => (
                           <div key={i} className="flex text-sm p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                             <CheckCircle2 className="flex-shrink-0 text-green-500 mr-3 mt-0.5" size={16} />
                             <span className="text-gray-700 font-medium leading-tight">{action}</span>
                           </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="flex items-center font-bold text-gray-800 text-sm uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">
                      <Zap className="mr-2 text-unionRed" size={16} /> AI Root Cause Analysis
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed p-4 bg-red-50 rounded-lg border border-red-100 font-mono">
                      &gt; {report.rootCause}
                    </p>
                  </div>
                </div>

                {/* Resolve Action */}
                <div className="bg-gray-900 rounded-xl p-6 mt-6 shadow-black/20 shadow-xl flex items-center justify-between">
                  <div>
                    <h5 className="text-white font-bold text-lg mb-1 tracking-tight">One-Click Containment</h5>
                    <p className="text-gray-400 text-sm">Authorize AI to automatically execute the playbook via API integrations.</p>
                  </div>
                  <button 
                    onClick={handleResolve}
                    className="bg-green-500 hover:bg-green-400 text-white px-8 py-3 rounded-lg font-black text-sm uppercase tracking-widest shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-all hover:scale-105 active:scale-95 flex items-center"
                  >
                    Authorize Execution <ChevronRight className="ml-2" size={20} />
                  </button>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIResponse;
