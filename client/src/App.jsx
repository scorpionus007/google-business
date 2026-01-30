import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'regenerator-runtime/runtime';

import Sidebar from './components/Sidebar';
import VoiceAssistant from './components/VoiceAssistant';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Marketing from './components/Marketing';
import Billing from './components/Billing';
import Login from './components/Login';
import Register from './components/Register';
import GoogleBusiness from './components/GoogleBusiness';
import WebsiteBuilder from './components/WebsiteBuilder';
import Learn from './components/Learn';
import Sales from './components/Sales';
import Settings from './components/Settings';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function MainLayout() {
  const { user } = useAuth();
  const [globalState, setGlobalState] = useState(null);

  const handleVoiceAction = (data) => {
    console.log("Global Action:", data);
    setGlobalState(data);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-[#202124] flex font-sans">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-8 relative">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Area */}
          <header className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-2xl font-normal text-[#202124]">
                Welcome, {user?.businessName || 'Owner'}
              </h2>
              <p className="text-sm text-[#5f6368] mt-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                {user?.category} Mode
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white border border-[#dadce0] flex items-center justify-center text-xl shadow-sm text-[#5f6368]">
              👤
            </div>
          </header>

          <Routes>
            <Route path="/" element={<Dashboard lastAction={globalState} />} />
            <Route path="/inventory" element={<Inventory lastAction={globalState} />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/marketing" element={<Marketing lastAction={globalState} />} />
            <Route path="/billing" element={<Billing lastAction={globalState} />} />
            <Route path="/google-business" element={<GoogleBusiness lastAction={globalState} />} />
            <Route path="/website-builder" element={<WebsiteBuilder lastAction={globalState} />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </main>

      <VoiceAssistant onAction={handleVoiceAction} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
