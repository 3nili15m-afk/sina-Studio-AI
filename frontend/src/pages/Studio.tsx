import React, { useState } from 'react';
import { Container, Grid, Paper, TextField, Button, Box, Typography, ToggleButton, ToggleButtonGroup, Alert, LinearProgress, Card, CardMedia } from '@mui/material';
import { useTranslation } from 'react-i18next';
import apiClient from '../services/api';

type ContentType = 'image' | 'video' | 'audio' | 'speech';

const Studio: React.FC = () => {
  const { t } = useTranslation();
  const [contentType, setContentType] = useState<ContentType>('image');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    setError(null);
    setSuccess(null);
    if (!prompt.trim()) {
      setError('Prompt is required');
      return;
    }

    setLoading(true);
    try {
      let res;
      if (contentType === 'image') {
        res = await apiClient.generateImage(prompt, '1024x1024', 'standard');
      } else if (contentType === 'video') {
        res = await apiClient.generateVideo(prompt, 10, 24);
      } else if (contentType === 'audio') {
        res = await apiClient.generateAudio(prompt, 30);
      } else if (contentType === 'speech') {
        res = await apiClient.generateSpeech(prompt, 'en');
      }

      if (res.success && res.data) {
        setResult(res.data);
        setSuccess('Content generated successfully!');
        setPrompt('');
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || `Failed to generate ${contentType}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        {t('pages.studio')}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('creation.selectType')}
            </Typography>
            <Box sx={{ mb: 3 }}>
              <ToggleButtonGroup
                value={contentType}
                exclusive
                onChange={(_, v) => v && setContentType(v)}
                fullWidth
              >
                <ToggleButton value="image">{t('creation.image')}</ToggleButton>
                <ToggleButton value="video">{t('creation.video')}</ToggleButton>
                <ToggleButton value="audio">{t('creation.audio')}</ToggleButton>
                <ToggleButton value="speech">TTS</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <TextField
              label={t('creation.describe')}
              placeholder="Describe what you want to create..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              multiline
              rows={4}
              fullWidth
              disabled={loading}
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
            >
              {loading ? t('common.loading') : t('creation.generate')}
            </Button>

            {loading && <LinearProgress sx={{ mt: 2 }} />}
          </Paper>
        </Grid>

        {result && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Result
              </Typography>
              {contentType === 'image' && result.image_url && (
                <Card>
                  <CardMedia component="img" image={result.image_url} alt="Generated" />
                </Card>
              )}
              {contentType === 'video' && result.video_url && (
                <video width="100%" controls>
                  <source src={result.video_url} />
                </video>
              )}
              {(contentType === 'audio' || contentType === 'speech') && (result.audio_url || result.video_url) && (
                <audio controls style={{ width: '100%' }}>
                  <source src={result.audio_url || result.video_url} />
                </audio>
              )}
              <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                {t('common.save')}
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Studio;
