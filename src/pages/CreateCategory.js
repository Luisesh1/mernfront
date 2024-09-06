import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Avatar, Button, CssBaseline, TextField, Box, Typography, Container, Alert } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const theme = createTheme();

const validationSchema = Yup.object({
  name: Yup.string().required('Required'),
});

const CreateCategory = () => {
  
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await api.post('/events/categories', values, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setSuccessMessage('Category created successfully');
        setErrorMessage('');
        resetForm();
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Failed to create category');
        setSuccessMessage('');
      }
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <CategoryIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Create Category
          </Typography>
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Category Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Create Category
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default CreateCategory;
