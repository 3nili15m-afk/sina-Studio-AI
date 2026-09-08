import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Studio: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {t('pages.studio')}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {t('creation.whatToCreate')}
        </Typography>
      </Box>
    </Container>
  );
};

export default Studio;
