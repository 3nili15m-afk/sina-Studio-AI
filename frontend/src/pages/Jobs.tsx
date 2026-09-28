import React, { useState, useEffect } from 'react';
import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Box, Typography, Chip, LinearProgress, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import apiClient from '../services/api';
import { Job } from '../types';

const Jobs: React.FC = () => {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        const res = await apiClient.listJobs();
        if (res.success && res.data) {
          setJobs(res.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.error?.message || 'Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
    const interval = setInterval(loadJobs, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCancel = async (jobId: string) => {
    try {
      await apiClient.cancelJob(jobId);
      setJobs(jobs.map((j) => (j.id === jobId ? { ...j, status: 'cancelled' } : j)));
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to cancel job');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      case 'processing':
        return 'info';
      case 'cancelled':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        {t('pages.jobs')}
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <LinearProgress />
      ) : jobs.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="textSecondary">No jobs yet</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>{t('job.status')}</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>{t('job.progress')}</TableCell>
                <TableCell>{t('job.created')}</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>
                    <Chip
                      label={job.status}
                      color={getStatusColor(job.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{job.type}</TableCell>
                  <TableCell>
                    {job.progress && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={job.progress.percentage}
                          sx={{ flex: 1 }}
                        />
                        <Typography variant="body2">{job.progress.percentage}%</Typography>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>{new Date(job.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    {['processing', 'pending', 'queued'].includes(job.status) && (
                      <Button size="small" color="error" onClick={() => handleCancel(job.id)}>
                        {t('common.close')}
                      </Button>
                    )}
                    {job.status === 'completed' && job.result?.contentUrl && (
                      <Button size="small" href={job.result.contentUrl} target="_blank">
                        {t('job.download')}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default Jobs;
