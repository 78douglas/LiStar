import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useSupabaseSync } from './hooks/useSupabaseSync';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TaskManager from './components/TaskManager';
import RewardManager from './components/RewardManager';
import Settings from './components/Settings';
import History from './components/History';
import Layout from './components/Layout';
import './styles/themes.css';

function AppContent() {
  const { state } = useApp();
  const { user } = useAuth();
  
  // Ativar sincronização em tempo real do Supabase
  useSupabaseSync();

  useEffect(() => {
    // Apply theme to document
    const html = document.documentElement;
    
    // Remove all theme classes
    html.classList.remove('dark', 'theme-blue', 'theme-green', 'theme-purple');
    
    // Apply the selected theme
    if (state.theme === 'dark') {
      html.classList.add('dark');
    } else if (state.theme === 'blue') {
      html.classList.add('theme-blue');
    } else if (state.theme === 'green') {
      html.classList.add('theme-green');
    } else if (state.theme === 'purple') {
      html.classList.add('theme-purple');
    }
    // light theme doesn't need a class (default)
  }, [state.theme]);

  if (!user) {
    return <Login />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<TaskManager />} />
          <Route path="/rewards" element={<RewardManager />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </AppProvider>
  );
}

export default App;