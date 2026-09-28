import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Box, Typography, Card, CardContent, LinearProgress, Alert, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import apiClient from '../services/api';
import { User, Job } from '../types';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const userRes = await apiClient.getMe();
        if (userRes.success && userRes.data) {
          setUser(userRes.data);
        }

        const jobsRes = await apiClient.listJobs();
        if (jobsRes.success && jobsRes.data) {
          setJobs(jobsRes.data.slice(0, 5));
        }
      } catch (err: any) {
        if (err.response?.status === 401) {
          navigate('/login');
        } else {
          setError(err.response?.data?.error?.message || 'Failed to load dashboard');
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  if (loading) return <LinearProgress />;

  const completedJobs = jobs.filter((j) => j.status === 'completed').length;
  const processingJobs = jobs.filter((j) => j.status === 'processing').length;
  const failedJobs = jobs.filter((j) => j.status === 'failed').length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {user && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            {t('app.subtitle')}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {t('auth.email')}: {user.email}
          </Typography>
        </Box>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Completed
              </Typography>
              <Typography variant="h4">{completedJobs}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Processing
              </Typography>
              <Typography variant="h4">{processingJobs}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Failed
              </Typography>
              <Typography variant="h4">{failedJobs}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total
              </Typography>
              <Typography variant="h4">{jobs.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Jobs
        </Typography>
        {jobs.length === 0 ? (
          <Typography color="textSecondary">No jobs yet</Typography>
        ) : (
          jobs.map((job) => (
            <Box
              key={job.id}
              sx={{
                py: 1.5,
                px: 1,
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography variant="body2" fontWeight="500">
                  {job.type}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {new Date(job.createdAt).toLocaleString()}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  backgroundColor:
                    job.status === 'completed'
                      ? '#c8e6c9'
                      : job.status === 'failed'
                      ? '#ffcdd2'
                      : '#bbdefb',
                }}
              >
                {job.status}
              </Typography>
            </Box>
          ))
        )}
        <Button fullWidth sx={{ mt: 2 }} onClick={() => navigate('/jobs')}>
          View All
        </Button>
      </Paper>
    </Container>
  );
};

export default Dashboard;
