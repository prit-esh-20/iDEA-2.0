import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { motion } from 'framer-motion';
import { Activity, ShieldAlert, AlertOctagon, MailWarning, Terminal, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SimulateAttack: React.FC = () => {
  const { simulateAttack, activeIncidents } = useAppContext();
  const navigate = useNavigate();
  const [selectedAttack, setSelectedAttack] = useState<string | null>(null);

  const attacks = [
    {
      id: 'ransomware',
      name: 'Simulate Ransomware',
      icon: AlertOctagon,
      color: 'text-unionRed',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      description: 'Encrypts critical database files and demands payment. High impact on availability and integrity.',
      systems: ['Core Banking DB', 'File Storage Server', 'Backup Server']
    },
    {
      id: 'bruteforce',
      name: 'Simulate Brute Force',
      icon: Terminal,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      description: 'Repeated authentication attempts against exposed administrative interfaces.',
      systems: ['Web App Firewall', 'Admin Portal']
    },
    {
      id: 'phishing',
      name: 'Simulate Phishing',
      icon: MailWarning,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      description: 'Deceptive emails targeting employees to steal credentials or deploy initial malware payloads.',
      systems: ['Exchange Server', 'Employee Workstations']
    }
  ];

  const handleSimulate = (attack: any) => {
    setSelectedAttack(attack.id);
    simulateAttack(attack.name, attack.systems);
    
    // Auto navigate to Dashboard or AI Response after a short delay to see the result
    setTimeout(() => {
      navigate('/ai-response');
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-800">Incident Simulation Generator</h1>
          <p className="text-gray-500 mt-1">Admin-only module to trigger live war-game scenarios and test AI response capabilities.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-unionRed bg-red-50 px-3 py-1.5 rounded-full shadow-sm border border-red-100 font-bold uppercase tracking-wider">
          <Activity size={16} className="animate-pulse" />
          <span>Live Environment</span>
        </div>
      </div>

      {activeIncidents > 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-unionRed text-white p-8 rounded-xl shadow-lg text-center"
        >
          <ShieldAlert size={64} className="mx-auto mb-4 animate-bounce" />
          <h2 className="text-3xl font-bold mb-2 tracking-tight">Incident Already Active</h2>
          <p className="text-red-100 text-lg mb-6 max-w-2xl mx-auto">A security incident is currently ongoing. Please resolve the active threat via the AI Response dashboard before initiating another simulation.</p>
          <button 
            onClick={() => navigate('/ai-response')}
            className="bg-white text-unionRed px-6 py-3 rounded-lg font-bold shadow-md hover:bg-gray-100 transition-colors uppercase tracking-wider text-sm flex items-center mx-auto"
          >
            Review Active Response <ChevronRight className="ml-2" size={18} />
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {attacks.map((attack, index) => (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              transition={{ delay: index * 0.1 }}
              key={attack.id}
              className={`card relative overflow-hidden group cursor-pointer border-2 transition-all duration-300 ${
                selectedAttack === attack.id 
                  ? `${attack.borderColor} shadow-xl scale-105 z-10` 
                  : 'border-transparent hover:border-gray-200 hover:shadow-lg'
              }`}
              onClick={() => handleSimulate(attack)}
            >
              <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full -z-10 transition-transform duration-500 ${attack.bgColor} group-hover:scale-[3.0]`}></div>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className={`p-3 rounded-xl shadow-inner ${attack.bgColor} ${attack.color}`}>
                  <attack.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 tracking-tight">{attack.name}</h3>
              </div>
              
              <p className="text-sm text-gray-600 mb-6 font-medium leading-relaxed relative z-10">
                {attack.description}
              </p>

              <div className="space-y-2 relative z-10">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Affected Vectors</div>
                {attack.systems.map((sys, i) => (
                  <div key={i} className="flex items-center text-xs font-semibold text-gray-700 bg-gray-50 px-2 py-1.5 rounded-md border border-gray-100">
                    <ChevronRight size={14} className="mr-1 text-gray-400" /> {sys}
                  </div>
                ))}
              </div>

              {selectedAttack === attack.id && (
                <div className="absolute inset-x-0 bottom-0 bg-unionRed text-white p-3 text-center text-sm font-bold animate-pulse shadow-inner uppercase tracking-wider">
                  Deploying Payload...
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimulateAttack;
