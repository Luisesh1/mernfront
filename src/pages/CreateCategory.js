import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Avatar, Button, CssBaseline, TextField, Box, Typography, Container, Alert, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import api from '../api';

const theme = createTheme();

const validationSchema = Yup.object({
  name: Yup.string().required('Required'),
});

const CreateCategory = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para obtener las categorías desde el backend
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events/categories', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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
        fetchCategories(); // Actualiza la lista de categorías después de crear una nueva
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Failed to create category');
        setSuccessMessage('');
      }
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
            Categories
          </Typography>
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
        <Paper elevation={3} sx={{ p: 2, mb: 4, width: '100%' }}>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: 200 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Category Name</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category._id}>
                        <TableCell>{category._id}</TableCell>
                        <TableCell>{category.name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default CreateCategory;
