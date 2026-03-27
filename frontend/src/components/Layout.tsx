import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Shield, Bell, Search, LayoutDashboard, ShieldAlert, Target, Zap, Bot, FileText, Activity } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

const Layout: React.FC = () => {
  const { role, setRole, alerts, activeIncidents } = useAppContext();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Vulnerabilities', path: '/vulnerabilities', icon: <ShieldAlert size={20} /> },
    { name: 'Attack Prediction', path: '/predict-attack', icon: <Target size={20} /> },
    { name: 'Simulate Attack', path: '/simulate-attack', icon: <Activity size={20} />, adminOnly: true },
    { name: 'AI Response', path: '/ai-response', icon: <Zap size={20} /> },
    { name: 'AI Assistant', path: '/ai-assistant', icon: <Bot size={20} /> },
    { name: 'Reports', path: '/reports', icon: <FileText size={20} /> },
  ];

  const filteredNavLinks = navLinks.filter(link => !link.adminOnly || role === 'Admin');

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-unionBlue text-white flex flex-col shadow-xl z-20">
        <div className="h-16 flex items-center px-6 border-b border-blue-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded bg-white flex items-center justify-center relative overflow-hidden">
               {/* Custom Red/Blue Shield Logo for UnionBank style */}
              <div className="absolute top-0 left-0 w-1/2 h-full bg-unionRed"></div>
              <div className="absolute top-0 right-0 w-1/2 h-full bg-unionBlue"></div>
              <Shield className="text-white z-10" fill="currentColor" size={18} />
            </div>
            <span className="text-xl font-bold tracking-tight">UnionCyber<span className="text-unionRed font-light">AI</span></span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {filteredNavLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive ? 'bg-blue-800 text-white font-medium shadow-inner' : 'text-blue-200 hover:bg-blue-800/50 hover:text-white'
                    }`
                  }
                >
                  <span className="opacity-80">{link.icon}</span>
                  <span>{link.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-blue-800">
          <div className="text-xs text-blue-300 px-2 uppercase font-semibold mb-2 tracking-wider">System Status</div>
          <div className="flex items-center space-x-2 px-2">
            <div className={`w-3 h-3 rounded-full ${activeIncidents > 0 ? 'bg-unionRed animate-pulse' : 'bg-green-500'}`}></div>
            <span className="text-sm text-blue-100">{activeIncidents > 0 ? 'Incidents Active' : 'All Systems Nominal'}</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10 shadow-sm relative">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search threats, IP addresses, or CVEs..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-full focus:bg-white focus:border-unionBlue focus:ring-2 focus:ring-unionBlue/20 transition-all outline-none text-sm"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative cursor-pointer hover:text-unionBlue transition-colors text-gray-500">
              <Bell size={20} />
              {alerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-unionRed text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                  {alerts.length}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-3 relative">
              <div 
                className="flex items-center space-x-2 cursor-pointer border border-gray-200 py-1.5 px-3 rounded-full hover:bg-gray-50 transition-colors"
                onClick={() => setShowRoleMenu(!showRoleMenu)}
              >
                <div className="w-7 h-7 bg-unionLightGrey text-unionBlue rounded-full flex items-center justify-center font-bold text-xs">
                  {role === 'Admin' ? 'AD' : 'AN'}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-semibold text-gray-800 leading-tight">SecOps {role}</span>
                  <span className="text-[10px] text-gray-500 leading-tight">Union Bank</span>
                </div>
              </div>

              {/* Role Dropdown */}
              <AnimatePresence>
                {showRoleMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-12 right-0 bg-white border border-gray-100 shadow-lg rounded-xl flex flex-col min-w-[140px] overflow-hidden z-50"
                  >
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-100">Switch Role</div>
                    <button 
                      onClick={() => { setRole('Admin'); setShowRoleMenu(false); }}
                      className={`text-left px-4 py-2 text-sm hover:bg-gray-50 ${role === 'Admin' ? 'text-unionBlue font-semibold' : 'text-gray-700'}`}
                    >
                      Admin Access
                    </button>
                    <button 
                      onClick={() => { setRole('Analyst'); setShowRoleMenu(false); }}
                      className={`text-left px-4 py-2 text-sm hover:bg-gray-50 ${role === 'Analyst' ? 'text-unionBlue font-semibold' : 'text-gray-700'}`}
                    >
                      Analyst (Read-only)
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Global Alert Banner if there are active incidents */}
        <AnimatePresence>
          {activeIncidents > 0 && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-unionRed text-white px-6 py-2 flex items-center justify-between text-sm shadow-inner z-0"
            >
              <div className="flex items-center space-x-2 font-medium">
                <ShieldAlert size={16} />
                <span>CRITICAL INCIDENT ACTIVE. SecOps team engaged.</span>
              </div>
              <NavLink to="/ai-response" className="px-3 py-1 bg-white text-unionRed rounded font-semibold text-xs shadow-sm hover:bg-gray-100 transition-colors">
                View AI Response
              </NavLink>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/50 p-6 z-0">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
