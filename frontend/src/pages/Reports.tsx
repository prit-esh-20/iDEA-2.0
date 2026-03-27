import React from 'react';
import { useAppContext } from '../store/AppContext';
import { motion } from 'framer-motion';
import { FileText, Download, Eye, Calendar, ShieldCheck, FileSearch, ShieldAlert } from 'lucide-react';

const Reports: React.FC = () => {
  const { reports } = useAppContext();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-800 flex items-center">
            <FileSearch size={28} className="mr-3 text-unionBlue" /> Compliance & Audit Reports
          </h1>
          <p className="text-gray-500 mt-1">Historically generated SOC summaries and automated forensic output.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100 font-bold uppercase tracking-wider">
          <FileText size={16} />
          <span>{reports.length} Total Reports</span>
        </div>
      </div>

      <div className="card min-h-[500px] border-t-4 border-t-unionBlue overflow-hidden flex flex-col bg-gray-50">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center px-4 pt-4">
          <ShieldCheck className="mr-2 text-unionBlue" size={20} /> Generated Post-Mortem Analytics
        </h3>

        {reports.length === 0 ? (
          <div className="m-auto text-center opacity-50 flex flex-col items-center">
            <FileSearch size={64} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-bold text-gray-500 mb-2 tracking-tight">No Reports Available</h3>
            <p className="text-sm font-medium">Auto-generated reports will appear here after an incident is resolved.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
            {reports.map((report, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={report.id} 
                className="bg-white rounded-xl p-5 border shadow-sm hover:shadow-md transition-all group relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between"
              >
                <div className="absolute left-0 top-0 w-1.5 h-full bg-unionBlue"></div>
                
                <div className="flex-1 mb-4 md:mb-0">
                  <div className="flex items-center space-x-3 mb-1">
                    <span className="bg-red-50 border border-red-100 text-unionRed text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-sm">
                      Severity: Critical
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center">
                      <Calendar size={12} className="mr-1" /> {new Date(report.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold tracking-tight text-gray-800 mb-2">
                    {report.type} Overview
                  </h4>
                  <div className="flex items-center text-sm font-medium text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 inline-block">
                    <span className="font-bold text-unionBlue uppercase mr-2 text-xs">ID: {report.id}</span>
                    <span className="truncate max-w-md inline-block align-bottom">{report.summary}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 md:ml-6 shrink-0">
                  <button className="flex items-center text-sm px-4 py-2 text-unionBlue bg-blue-50 hover:bg-unionBlue hover:text-white rounded-lg font-bold transition-all border border-blue-200 shadow-sm active:scale-95 group-hover:border-unionBlue">
                    <Eye size={16} className="mr-2" /> View Full
                  </button>
                  <button className="flex items-center text-sm px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 rounded-lg font-bold transition-all border border-gray-200 shadow-sm active:scale-95">
                    <Download size={16} className="mr-2" /> Download PDF
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-start space-x-4">
           <div className="bg-orange-50 text-orange-500 p-3 rounded-xl shadow-inner border border-orange-100"><ShieldAlert size={24} /></div>
           <div>
             <h4 className="text-sm font-bold text-gray-800 mb-1 tracking-tight">Compliance Readiness</h4>
             <p className="text-xs text-gray-500 font-medium leading-relaxed">All generated SOC reports automatically map to NIST CSF and ISO 27001 requirements for seamless audit fulfillment.</p>
           </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-start space-x-4">
           <div className="bg-green-50 text-green-500 p-3 rounded-xl shadow-inner border border-green-100"><ShieldCheck size={24} /></div>
           <div>
             <h4 className="text-sm font-bold text-gray-800 mb-1 tracking-tight">Immutable Chain of Custody</h4>
             <p className="text-xs text-gray-500 font-medium leading-relaxed">Generated reports are cryptographically signed and stored on designated WORM compliance storage tier.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
