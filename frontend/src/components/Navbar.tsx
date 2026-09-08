import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fa' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
    document.documentElement.dir = newLang === 'fa' ? 'rtl' : 'ltr';
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <RouterLink to="/" style={{ textDecoration: 'none', color: 'white' }}>
            <Button color="inherit" size={isMobile ? 'small' : 'medium'}>
              {t('app.title')}
            </Button>
          </RouterLink>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button color="inherit" component={RouterLink} to="/">
            {t('nav.home')}
          </Button>
          <Button color="inherit" component={RouterLink} to="/studio">
            {t('nav.create')}
          </Button>
          <Button color="inherit" component={RouterLink} to="/projects">
            {t('nav.projects')}
          </Button>
          <Button color="inherit" component={RouterLink} to="/jobs">
            {t('nav.jobs')}
          </Button>
          <Button color="inherit" onClick={toggleLanguage}>
            {i18n.language === 'en' ? 'FA' : 'EN'}
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
