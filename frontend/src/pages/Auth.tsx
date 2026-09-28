import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, TextField, Button, Box, Typography, Alert, Tabs, Tab } from '@mui/material';
import { useTranslation } from 'react-i18next';
import apiClient from '../services/api';

const Auth: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError(null);
    if (!email || !username || !password) {
      setError('All fields are required');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.register(email, username, password);
      if (res.success && res.data) {
        apiClient.setToken(res.data.token);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setError(null);
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.login(email, password);
      if (res.success && res.data) {
        apiClient.setToken(res.data.token);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          {t('app.title')}
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)}>
            <Tab label={t('auth.login')} />
            <Tab label={t('auth.signup')} />
          </Tabs>
        </Box>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label={t('auth.email')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            disabled={loading}
          />
          {tab === 1 && (
            <TextField
              label={t('auth.username')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              disabled={loading}
            />
          )}
          <TextField
            label={t('auth.password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            disabled={loading}
          />
          <Button
            variant="contained"
            size="large"
            onClick={tab === 0 ? handleLogin : handleRegister}
            disabled={loading}
          >
            {loading ? t('common.loading') : (tab === 0 ? t('auth.login') : t('auth.signup'))}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Auth;
