import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Studio from './pages/Studio';
import Jobs from './pages/Jobs';
import Projects from './pages/Projects';
import Auth from './pages/Auth';
import apiClient from './services/api';
import './i18n/config';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return apiClient.getToken() ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  const { i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const lang = localStorage.getItem('language') || 'en';
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    setIsLoading(false);
  }, [i18n]);

  if (isLoading) return null;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/studio" element={<ProtectedRoute><Studio /></ProtectedRoute>} />
          <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
