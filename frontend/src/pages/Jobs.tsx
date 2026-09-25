import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Box, Button, Chip, CircularProgress, Container, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { Job } from '../types';

const Jobs: React.FC = () => {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.listJobs();
      if (!response.success || !response.data) throw new Error(response.error?.message || t('common.error'));
      setJobs(response.data);
      setError(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { void loadJobs(); }, [loadJobs]);

  const cancel = async (jobId: string) => {
    try {
      await api.cancelJob(jobId);
      await loadJobs();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : t('common.error'));
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>{t('pages.jobs')}</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {loading ? <CircularProgress /> : jobs.length === 0 ? <Typography color="text.secondary">{t('common.noJobs')}</Typography> : (
          <List>
            {jobs.map((job) => (
              <ListItem key={job.id} divider secondaryAction={job.status === 'pending' || job.status === 'queued' || job.status === 'processing' ? <Button onClick={() => void cancel(job.id)}>{t('creation.cancel')}</Button> : undefined}>
                <ListItemText primary={job.type} secondary={new Date(job.createdAt).toLocaleString()} />
                <Chip label={t(`job.${job.status}`, { defaultValue: job.status })} sx={{ mr: 2 }} />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Container>
  );
};

export default Jobs;
