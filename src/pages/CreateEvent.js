import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useParams, useNavigate } from 'react-router-dom';
import { Avatar, Button, CssBaseline, TextField, MenuItem, Box, Typography, Container, Alert } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const theme = createTheme();

const validationSchema = Yup.object({
  title: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  category: Yup.string().required('Required'),
  date: Yup.date().required('Required'),
  time: Yup.string().required('Required'),
  location: Yup.string().required('Required'),
});

const CreateEvent = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [logo, setLogo] = useState(null);
  const [cover, setCover] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [coverPreview, setCoverPreview] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/events/categories', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };

    const fetchEvent = async () => {
      if (id) {
        try {
          const response = await api.get(`/events/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          const event = response.data;
          formik.setValues({
            title: event.title,
            description: event.description,
            category: event.category._id,
            date: event.date.split('T')[0],
            time: event.time,
            location: event.location,
          });
          setLogoPreview(`${process.env.REACT_APP_BASE_URL}/${event.logo}`);
          setCoverPreview(`${process.env.REACT_APP_BASE_URL}/${event.cover}`);
        } catch (error) {
          console.error('Failed to fetch event', error);
        }
      }
    };

    fetchCategories();
    fetchEvent();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      category: '',
      date: '',
      time: '',
      location: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('category', values.category);
      formData.append('date', values.date);
      formData.append('time', values.time);
      formData.append('location', values.location);
      if (logo) formData.append('logo', logo);
      if (cover) formData.append('cover', cover);

      try {
        if (id) {
          await api.put(`/events/${id}`, formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data',
            },
          });
          setSuccessMessage('Event updated successfully');
        } else {
          await api.post('/events', formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data',
            },
          });
          setSuccessMessage('Event created successfully');
        }
        setErrorMessage('');
        resetForm();
        navigate('/events');
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Failed to create/update event');
        setSuccessMessage('');
      }
    },
  });

  const handleLogoChange = (e) => {
    if (e.target.files[0]) {
      setLogo(e.target.files[0]);
      setLogoPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleCoverChange = (e) => {
    if (e.target.files[0]) {
      setCover(e.target.files[0]);
      setCoverPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

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
            <EventIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {id ? 'Edit Event' : 'Create Event'}
          </Typography>
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              label="Event Title"
              name="title"
              autoComplete="title"
              autoFocus
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="description"
              label="Description"
              id="description"
              autoComplete="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              select
              name="category"
              label="Category"
              id="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              error={formik.touched.category && Boolean(formik.errors.category)}
              helperText={formik.touched.category && formik.errors.category}
            >
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="normal"
              required
              fullWidth
              name="date"
              label="Date"
              type="date"
              id="date"
              InputLabelProps={{
                shrink: true,
              }}
              value={formik.values.date}
              onChange={formik.handleChange}
              error={formik.touched.date && Boolean(formik.errors.date)}
              helperText={formik.touched.date && formik.errors.date}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="time"
              label="Time"
              type="time"
              id="time"
              InputLabelProps={{
                shrink: true,
              }}
              value={formik.values.time}
              onChange={formik.handleChange}
              error={formik.touched.time && Boolean(formik.errors.time)}
              helperText={formik.touched.time && formik.errors.time}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="location"
              label="Location"
              id="location"
              autoComplete="location"
              value={formik.values.location}
              onChange={formik.handleChange}
              error={formik.touched.location && Boolean(formik.errors.location)}
              helperText={formik.touched.location && formik.errors.location}
            />
            <Box sx={{ mt: 2 }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="logo-upload"
                type="file"
                onChange={handleLogoChange}
              />
              <label htmlFor="logo-upload">
                <Button variant="contained" component="span" fullWidth sx={{ mt: 1 }}>
                  Upload Logo
                </Button>
              </label>
              {logoPreview && <img src={logoPreview} alt="Logo Preview" style={{ width: '100%', marginTop: '10px' }} />}
            </Box>
            <Box sx={{ mt: 2 }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="cover-upload"
                type="file"
                onChange={handleCoverChange}
              />
              <label htmlFor="cover-upload">
                <Button variant="contained" component="span" fullWidth sx={{ mt: 1 }}>
                  Upload Cover
                </Button>
              </label>
              {coverPreview && <img src={coverPreview} alt="Cover Preview" style={{ width: '100%', marginTop: '10px' }} />}
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {id ? 'Update Event' : 'Create Event'}
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default CreateEvent;
