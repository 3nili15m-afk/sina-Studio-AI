import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Button, Box, Typography, Dialog, TextField, Alert, LinearProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import apiClient from '../services/api';
import { Project } from '../types';

const Projects: React.FC = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', type: 'mixed_media', description: '' });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await apiClient.listProjects();
      if (res.success && res.data) {
        setProjects(res.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProject.name.trim()) {
      setError('Project name is required');
      return;
    }
    try {
      const res = await apiClient.createProject(newProject);
      if (res.success && res.data) {
        setProjects([...projects, res.data]);
        setOpenDialog(false);
        setNewProject({ name: '', type: 'mixed_media', description: '' });
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to create project');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h3">{t('pages.projects')}</Typography>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          + {t('common.save')}
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <LinearProgress />
      ) : projects.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="textSecondary">No projects yet</Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <Paper sx={{ p: 2, cursor: 'pointer', '&:hover': { boxShadow: 3 } }}>
                <Typography variant="h6" noWrap>
                  {project.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {project.type}
                </Typography>
                {project.description && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {project.description}
                  </Typography>
                )}
                <Typography variant="caption" color="textSecondary" sx={{ mt: 2, display: 'block' }}>
                  {new Date(project.createdAt).toLocaleDateString()}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Create Project
          </Typography>
          <TextField
            label="Project Name"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            multiline
            rows={2}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={handleCreateProject}>
              {t('common.save')}
            </Button>
            <Button variant="outlined" onClick={() => setOpenDialog(false)}>
              {t('common.close')}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Container>
  );
};

export default Projects;
