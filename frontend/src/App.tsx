import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Studio from './pages/Studio';
import Jobs from './pages/Jobs';
import Projects from './pages/Projects';
import './i18n/config';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const lang = localStorage.getItem('language') || 'en';
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  }, [i18n]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
