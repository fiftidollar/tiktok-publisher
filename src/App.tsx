import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import VideoUpload from './components/VideoUpload';
import ErrorBoundary from './components/ErrorBoundary';
import DebugPanel from './components/DebugPanel';
// import ApiService from './services/ApiService';

interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [debugVisible, setDebugVisible] = useState(false);

  useEffect(() => {
    // Проверяем, есть ли сохраненный пользователь
    const savedUser = localStorage.getItem('tiktok_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('tiktok_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('tiktok_user');
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            Загрузка...
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Header user={user} onLogout={handleLogout} />
          <div className="container">
            <Routes>
              <Route 
                path="/login" 
                element={
                  user ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  user ? <Dashboard user={user} /> : <Navigate to="/login" replace />
                } 
              />
              <Route 
                path="/upload" 
                element={
                  user ? <VideoUpload user={user} /> : <Navigate to="/login" replace />
                } 
              />
              <Route 
                path="/" 
                element={<Navigate to={user ? "/dashboard" : "/login"} replace />} 
              />
            </Routes>
          </div>
          <DebugPanel 
            isVisible={debugVisible} 
            onToggle={() => setDebugVisible(!debugVisible)} 
          />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
