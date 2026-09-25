import React, { FormEvent, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const jobTypes = [
  { value: 'image_generation', label: 'creation.image' },
  { value: 'video_generation', label: 'creation.video' },
  { value: 'audio_generation', label: 'creation.audio' },
  { value: 'text_to_speech', label: 'creation.speech' },
];

const Studio: React.FC = () => {
  const { t } = useTranslation();
  const [type, setType] = useState(jobTypes[0].value);
  const [prompt, setPrompt] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ severity: 'success' | 'error'; text: string } | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!prompt.trim()) {
      setMessage({ severity: 'error', text: t('creation.describe') });
      return;
    }

    setSubmitting(true);
    setMessage(null);
    try {
      const input = type === 'text_to_speech' ? { text: prompt.trim(), language: 'fa' } : { prompt: prompt.trim() };
      const response = await api.createJob({ type, input, priority: 'normal' });
      if (!response.success) throw new Error(response.error?.message || t('common.error'));
      setPrompt('');
      setMessage({ severity: 'success', text: t('job.created') });
    } catch (error) {
      setMessage({ severity: 'error', text: error instanceof Error ? error.message : t('common.error') });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box component="form" onSubmit={submit} sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>{t('pages.studio')}</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>{t('creation.whatToCreate')}</Typography>
        {message && <Alert severity={message.severity} sx={{ mb: 2 }}>{message.text}</Alert>}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="generation-type-label">{t('creation.selectType')}</InputLabel>
          <Select labelId="generation-type-label" value={type} label={t('creation.selectType')} onChange={(event: SelectChangeEvent) => setType(event.target.value)}>
            {jobTypes.map((item) => <MenuItem key={item.value} value={item.value}>{t(item.label)}</MenuItem>)}
          </Select>
        </FormControl>
        <TextField fullWidth multiline minRows={5} value={prompt} onChange={(event) => setPrompt(event.target.value)} label={t('creation.describe')} sx={{ mb: 2 }} />
        <Button type="submit" variant="contained" disabled={submitting}>{submitting ? t('common.loading') : t('creation.generate')}</Button>
      </Box>
    </Container>
  );
};

export default Studio;
