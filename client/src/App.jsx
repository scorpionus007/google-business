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
    <div className="min-h-screen bg-slate-900 text-slate-100 flex font-sans">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-8 relative">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Area */}
          <header className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white">
                Welcome Back, {user?.businessName || 'Owner'}
              </h2>
              <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                {user?.category} Mode Active
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-700 border border-white/10 flex items-center justify-center text-xl">
              👤
            </div>
          </header>

          <Routes>
            <Route path="/" element={<Dashboard lastAction={globalState} />} />
            <Route path="/inventory" element={<Inventory lastAction={globalState} />} />
            <Route path="/marketing" element={<Marketing lastAction={globalState} />} />
            <Route path="/billing" element={<Billing lastAction={globalState} />} />
            <Route path="/settings" element={<div className="text-center mt-20 text-gray-500">Settings Page</div>} />
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
