
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Vulnerabilities from './pages/Vulnerabilities';
import AttackPrediction from './pages/AttackPrediction';
import SimulateAttack from './pages/SimulateAttack';
import AIResponse from './pages/AIResponse';
import AIAssistant from './pages/AIAssistant';
import Reports from './pages/Reports';
import { AppProvider } from './store/AppContext';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="alerts" element={<Dashboard />} />
            <Route path="vulnerabilities" element={<Vulnerabilities />} />
            <Route path="predict-attack" element={<AttackPrediction />} />
            <Route path="simulate-attack" element={<SimulateAttack />} />
            <Route path="ai-response" element={<AIResponse />} />
            <Route path="ai-assistant" element={<AIAssistant />} />
            <Route path="reports" element={<Reports />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
