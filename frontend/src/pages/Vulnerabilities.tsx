import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import type { AlertSeverity } from '../store/AppContext';
import { motion } from 'framer-motion';
import { ShieldAlert, Plus, Server, CheckCircle, Database } from 'lucide-react';

const Vulnerabilities: React.FC = () => {
  const { vulnerabilities, addVulnerability, role } = useAppContext();
  
  const [formData, setFormData] = useState({
    systemName: '',
    openPorts: '',
    softwareVersion: '',
    weakAuth: false,
    missingPatches: false,
  });

  const calculateSeverity = (): AlertSeverity => {
    let score = 0;
    if (formData.weakAuth) score += 40;
    if (formData.missingPatches) score += 50;
    if (formData.openPorts.includes('445') || formData.openPorts.includes('3389') || formData.openPorts.includes('22')) score += 30;

    if (score >= 90) return 'Critical';
    if (score >= 60) return 'High';
    if (score >= 30) return 'Medium';
    return 'Low';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.systemName || !formData.softwareVersion) return;

    addVulnerability({
      ...formData,
      severity: calculateSeverity()
    });

    setFormData({
      systemName: '',
      openPorts: '',
      softwareVersion: '',
      weakAuth: false,
      missingPatches: false,
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-800">Vulnerability Assessment</h1>
          <p className="text-gray-500 mt-1">Manage and track exposed infrastructure within Union Bank's perimeter.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
          <Database size={16} />
          <span>Total Records: {vulnerabilities.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Registration Form (Admin Only) */}
        {role === 'Admin' && (
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="lg:col-span-1">
            <div className="card border-t-4 border-t-unionBlue sticky top-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Plus className="mr-2 text-unionBlue" size={20} /> Register Vulnerability
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">System Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Core Payment Gateway"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-unionBlue/50 focus:border-unionBlue transition-all outline-none"
                    value={formData.systemName}
                    onChange={(e) => setFormData({...formData, systemName: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Software Version</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Apache Struts 2.5.12"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-unionBlue/50 focus:border-unionBlue transition-all outline-none"
                    value={formData.softwareVersion}
                    onChange={(e) => setFormData({...formData, softwareVersion: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Open Ports (comma separated)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 443, 8080, 22"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-unionBlue/50 focus:border-unionBlue transition-all outline-none"
                    value={formData.openPorts}
                    onChange={(e) => setFormData({...formData, openPorts: e.target.value})}
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only"
                        checked={formData.weakAuth}
                        onChange={(e) => setFormData({...formData, weakAuth: e.target.checked})}
                      />
                      <div className={`w-10 h-5 rounded-full shadow-inner transition-colors ${formData.weakAuth ? 'bg-unionRed' : 'bg-gray-200'}`}></div>
                      <div className={`absolute w-4 h-4 rounded-full bg-white top-0.5 left-0.5 transition-transform shadow ${formData.weakAuth ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-unionRed transition-colors">Weak Authentication Detected</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only"
                        checked={formData.missingPatches}
                        onChange={(e) => setFormData({...formData, missingPatches: e.target.checked})}
                      />
                      <div className={`w-10 h-5 rounded-full shadow-inner transition-colors ${formData.missingPatches ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
                      <div className={`absolute w-4 h-4 rounded-full bg-white top-0.5 left-0.5 transition-transform shadow ${formData.missingPatches ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-orange-500 transition-colors">Missing Security Patches</span>
                  </label>
                </div>

                <button 
                  type="submit" 
                  className="w-full btn-primary bg-unionBlue text-white py-2.5 rounded-lg flex justify-center items-center mt-6 shadow hover:shadow-md"
                >
                  <ShieldAlert className="mr-2" size={18} /> Add Record
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* List of Vulnerabilities */}
        <div className={`space-y-4 ${role === 'Admin' ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="card bg-gray-50 flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
              <Server className="mr-2 text-unionBlue" size={20} /> Active Database
            </h3>
            
            <div className="space-y-4">
              {vulnerabilities.map((vuln, index) => (
                <motion.div 
                  initial={{ y: 10, opacity: 0 }} 
                  animate={{ y: 0, opacity: 1 }} 
                  transition={{ delay: index * 0.1 }}
                  key={vuln.id} 
                  className={`bg-white rounded-xl p-5 border-l-4 shadow-sm hover:shadow transition-all group relative overflow-hidden ${
                    vuln.severity === 'Critical' ? 'border-unionRed' :
                    vuln.severity === 'High' ? 'border-orange-500' :
                    vuln.severity === 'Medium' ? 'border-yellow-500' : 'border-blue-400'
                  }`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -z-10 opacity-50 group-hover:bg-blue-50 transition-colors"></div>
                  
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-bold tracking-tight text-gray-800 flex items-center">
                      <Database className="mr-2 text-gray-400 group-hover:text-unionBlue transition-colors" size={18} />
                      {vuln.systemName}
                    </h4>
                    <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded border ${
                      vuln.severity === 'Critical' ? 'bg-red-50 text-unionRed border-red-200' :
                      vuln.severity === 'High' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                      vuln.severity === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {vuln.severity}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="bg-gray-50 rounded p-2">
                      <div className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Version</div>
                      <div className="text-sm font-medium text-gray-700">{vuln.softwareVersion}</div>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <div className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Open Ports</div>
                      <div className="text-sm font-medium text-gray-700">{vuln.openPorts || 'None detected'}</div>
                    </div>
                    <div className="bg-gray-50 rounded p-2 flex flex-col justify-center">
                      <div className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Auth Status</div>
                      <div className="text-xs font-bold flex items-center">
                        {vuln.weakAuth 
                          ? <span className="text-unionRed flex items-center"><ShieldAlert size={12} className="mr-1"/> Weak</span> 
                          : <span className="text-green-600 flex items-center"><CheckCircle size={12} className="mr-1"/> Strong</span>
                        }
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded p-2 flex flex-col justify-center">
                      <div className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Patch Status</div>
                      <div className="text-xs font-bold flex items-center">
                        {vuln.missingPatches 
                          ? <span className="text-orange-600 flex items-center"><ShieldAlert size={12} className="mr-1"/> Outdated</span> 
                          : <span className="text-green-600 flex items-center"><CheckCircle size={12} className="mr-1"/> Up-to-date</span>
                        }
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {vulnerabilities.length === 0 && (
                <div className="text-center py-10">
                  <CheckCircle className="mx-auto text-green-500 mb-3 opacity-50" size={48} />
                  <p className="text-gray-500 font-medium tracking-wide">No vulnerabilities recorded currently.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vulnerabilities;
