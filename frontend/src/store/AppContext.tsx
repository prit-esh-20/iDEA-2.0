import React, { createContext, useContext, useState, useEffect } from 'react';

export type AlertSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type Role = 'Admin' | 'Analyst';

export interface Alert {
  id: string;
  severity: AlertSeverity;
  system: string;
  message: string;
  timestamp: string;
}

export interface Vulnerability {
  id: string;
  systemName: string;
  openPorts: string;
  softwareVersion: string;
  weakAuth: boolean;
  missingPatches: boolean;
  severity: AlertSeverity;
}

export interface IncidentReport {
  id: string;
  type: string;
  summary: string;
  responsePlan: string[];
  remediationActions: string[];
  rootCause: string;
  timestamp: string;
}

interface AppState {
  riskScore: number;
  threatLevel: AlertSeverity;
  activeIncidents: number;
  alerts: Alert[];
  vulnerabilities: Vulnerability[];
  reports: IncidentReport[];
  role: Role;
  triggerAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => void;
  updateRiskScore: (score: number) => void;
  addVulnerability: (vuln: Omit<Vulnerability, 'id'>) => void;
  generateReport: (report: Omit<IncidentReport, 'id' | 'timestamp'>) => void;
  setRole: (role: Role) => void;
  simulateAttack: (type: string, affectedSystems: string[]) => void;
  resolveIncident: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [riskScore, setRiskScore] = useState(35);
  const [threatLevel, setThreatLevel] = useState<AlertSeverity>('Low');
  const [activeIncidents, setActiveIncidents] = useState(0);
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      severity: 'Medium',
      system: 'Web Server (Port 443)',
      message: 'Unusual traffic patterns detected.',
      timestamp: new Date().toISOString(),
    }
  ]);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([
    {
      id: 'v1',
      systemName: 'Core Banking DB',
      openPorts: '1433, 445',
      softwareVersion: 'MS SQL Server 2019',
      weakAuth: false,
      missingPatches: true,
      severity: 'High'
    }
  ]);
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [role, setRole] = useState<Role>('Admin');

  useEffect(() => {
    // Update threat level based on risk score
    if (riskScore < 40) setThreatLevel('Low');
    else if (riskScore < 70) setThreatLevel('Medium');
    else if (riskScore < 90) setThreatLevel('High');
    else setThreatLevel('Critical');
  }, [riskScore]);

  // Simulate continuous monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly fluctuate risk score slightly if no active incidents
      if (activeIncidents === 0) {
        setRiskScore(prev => {
          const change = Math.floor(Math.random() * 5) - 2;
          return Math.max(10, Math.min(60, prev + change));
        });
      }
    }, 15000); // every 15s
    return () => clearInterval(interval);
  }, [activeIncidents]);

  const triggerAlert = (alertData: Omit<Alert, 'id' | 'timestamp'>) => {
    const newAlert: Alert = {
      ...alertData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const updateRiskScore = (score: number) => {
    setRiskScore(score);
  };

  const addVulnerability = (vulnData: Omit<Vulnerability, 'id'>) => {
    const newVuln: Vulnerability = {
      ...vulnData,
      id: Date.now().toString(),
    };
    setVulnerabilities(prev => [newVuln, ...prev]);
  };

  const generateReport = (reportData: Omit<IncidentReport, 'id' | 'timestamp'>) => {
    const newReport: IncidentReport = {
      ...reportData,
      id: 'REP-' + Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    setReports(prev => [newReport, ...prev]);
  };

  const simulateAttack = (type: string, affectedSystems: string[]) => {
    // Trigger critical alerts
    affectedSystems.forEach(sys => {
      triggerAlert({
        severity: 'Critical',
        system: sys,
        message: `${type} attack detected underway! Immediate action required.`
      });
    });
    setRiskScore(prev => Math.min(100, prev + 50));
    setActiveIncidents(prev => prev + 1);
  };

  const resolveIncident = () => {
    setActiveIncidents(prev => Math.max(0, prev - 1));
    setRiskScore(prev => Math.max(20, prev - 30));
    if (activeIncidents <= 1) { // Will become 0
      triggerAlert({
        severity: 'Low',
        system: 'AI Response System',
        message: 'Incident contained. System returned to normal state.'
      });
    }
  };

  return (
    <AppContext.Provider value={{
      riskScore, threatLevel, activeIncidents, alerts, vulnerabilities, reports, role,
      triggerAlert, updateRiskScore, addVulnerability, generateReport, setRole, simulateAttack, resolveIncident
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
