import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Search, AlertTriangle, Database, Shield, Lock, Server, Cpu } from 'lucide-react';

const AttackPrediction: React.FC = () => {
  const { vulnerabilities, activeIncidents } = useAppContext();
  const [isPredicting, setIsPredicting] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);

  const handlePredict = () => {
    setIsPredicting(true);
    setPrediction(null);
    
    // Simulate AI thinking time
    setTimeout(() => {
      setIsPredicting(false);
      
      const hasRDB = vulnerabilities.some(v => v.systemName.toLowerCase().includes('db') || v.missingPatches);
      
      setPrediction({
        type: hasRDB ? 'Ransomware / Data Exfiltration' : 'Brute Force / Credential Stuffing',
        probability: hasRDB ? 87 : 64,
        systems: vulnerabilities.map(v => v.systemName).slice(0, 2),
        explanation: 'AI analysis of network flow and known vulnerability signatures indicates a high likelihood of lateral movement attempts targeting exposed database ports.',
        recommendations: [
          { id: 1, title: 'Apply Patches', desc: 'Deploy MS-SQL security patches to address CVE-2023-XXXX', icon: Lock },
          { id: 2, title: 'Enable MFA', desc: 'Enforce multi-factor authentication across all admin endpoints', icon: Shield },
          { id: 3, title: 'Close Ports', desc: 'Block external access to TCP 1433 and 445', icon: Server },
          { id: 4, title: 'Configure Firewall', desc: 'Update WAF rules to block malicious lateral traffic', icon: Cpu }
        ]
      });
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-800">AI Threat Prediction</h1>
          <p className="text-gray-500 mt-1">Generative AI analysis of current infrastructure state to forecast attacks.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Prediction Input / Status */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card border-t-4 border-t-unionBlue">
            <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
              <Target className="mr-2 text-unionBlue" size={20} /> Analysis Engine
            </h3>
            <p className="text-sm text-gray-500 mb-6">Initiate a deep scan of the current network posture using machine learning models.</p>
            
            <button 
              onClick={handlePredict}
              disabled={isPredicting || activeIncidents > 0}
              className={`w-full py-3 rounded-lg flex justify-center items-center shadow-md font-bold text-white transition-all transform active:scale-95 ${
                isPredicting ? 'bg-blue-400 cursor-not-allowed' : 
                activeIncidents > 0 ? 'bg-red-500 cursor-not-allowed opacity-50' : 
                'bg-unionBlue hover:bg-blue-800 hover:shadow-lg'
              }`}
            >
              {isPredicting ? (
                <>
                  <Search className="animate-spin mr-2" size={20} /> Analyzing Models...
                </>
              ) : activeIncidents > 0 ? (
                <>
                  <AlertTriangle className="mr-2" size={20} /> Incident Active
                </>
              ) : (
                <>
                  <Target className="mr-2" size={20} /> Run Prediction Scan
                </>
              )}
            </button>
            {activeIncidents > 0 && (
               <p className="text-xs text-unionRed mt-3 text-center font-semibold">Prediction disabled during active incidents.</p>
            )}
          </div>

          <div className="card bg-gray-50 text-xs text-gray-500 font-mono">
            <div className="flex items-center text-unionBlue font-bold border-b border-gray-200 pb-2 mb-2 uppercase">
               Engine Status
            </div>
            <div className="space-y-1">
              <div className="flex justify-between"><span>Model Version:</span> <span className="text-gray-800 font-semibold">UBAI-Sec-v4.2</span></div>
              <div className="flex justify-between"><span>Last Training:</span> <span className="text-gray-800 font-semibold">2 hours ago</span></div>
              <div className="flex justify-between"><span>Active Nodes:</span> <span className="text-gray-800 font-semibold">412</span></div>
              <div className="flex justify-between"><span>Data Processed:</span> <span className="text-gray-800 font-semibold">2.4 TB</span></div>
            </div>
          </div>
        </div>

        {/* Prediction Results */}
        <div className="lg:col-span-2">
          <div className="card min-h-[400px] flex flex-col relative overflow-hidden">
            {!prediction && !isPredicting && (
              <div className="m-auto text-center opacity-50">
                <Target size={64} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-bold text-gray-500 mb-2">Awaiting Scan Initiation</h3>
                <p className="text-sm">Run the prediction engine to generate foresight metrics.</p>
              </div>
            )}

            {isPredicting && (
              <div className="m-auto text-center">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-unionBlue rounded-full border-t-transparent animate-spin"></div>
                  <Search size={32} className="absolute inset-0 m-auto text-unionBlue animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-unionBlue mb-2 animate-pulse">Running Neural Analysis...</h3>
                <p className="text-sm text-gray-500 font-mono">Correlating active vulnerabilities with global threat intel.</p>
              </div>
            )}

            <AnimatePresence>
              {prediction && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                    <div>
                      <h3 className="text-sm font-bold text-unionRed uppercase tracking-wider mb-1">High Probability Threat</h3>
                      <div className="text-3xl font-extrabold text-gray-900 tracking-tight">{prediction.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Confidence Score</div>
                      <div className={`text-4xl font-extrabold ${prediction.probability > 80 ? 'text-unionRed' : 'text-orange-500'}`}>
                        {prediction.probability}%
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Likely Targets</div>
                      <div className="space-y-2">
                        {prediction.systems.length > 0 ? prediction.systems.map((sys: string, i: number) => (
                           <div key={i} className="flex items-center text-sm font-semibold bg-red-50 text-unionRed px-3 py-2 rounded-lg shadow-sm border border-red-100">
                             <Database size={16} className="mr-2" /> {sys}
                           </div>
                        )) : (
                           <div className="text-sm text-gray-500 italic">No vulnerable targets found in registry.</div>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">AI Summary</div>
                      <p className="text-sm text-gray-700 leading-relaxed font-medium bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                        "{prediction.explanation}"
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-unionBlue uppercase tracking-wider mb-4 flex items-center">
                       <Shield size={14} className="mr-1" /> Recommended Mitigations
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {prediction.recommendations.map((rec: any, idx: number) => (
                         <motion.div 
                           initial={{ x: 20, opacity: 0 }}
                           animate={{ x: 0, opacity: 1 }}
                           transition={{ delay: 0.3 + (idx * 0.1) }}
                           key={rec.id} 
                           className="flex items-start p-4 hover:bg-gray-50 rounded-xl border border-gray-200 shadow-sm transition-all group cursor-pointer"
                         >
                           <div className="p-2 bg-blue-50 text-unionBlue rounded-lg group-hover:bg-unionBlue group-hover:text-white transition-colors mr-3 shadow-inner">
                             <rec.icon size={20} />
                           </div>
                           <div>
                             <h4 className="text-sm font-bold text-gray-800 mb-1">{rec.title}</h4>
                             <p className="text-xs text-gray-500 font-medium leading-relaxed">{rec.desc}</p>
                           </div>
                         </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttackPrediction;
