import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container, MenuItem, Select, FormControl, InputLabel, FormHelperText } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import api from '../api';

const theme = createTheme();

const validationSchema = Yup.object({
  username: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Password should be of minimum 6 characters length').required('Required'),
  role: Yup.string().oneOf(['organizer', 'participant'], 'Invalid role').required('Required'),
});

const Register = () => {
  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      role: 'participant', // Valor por defecto
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await api.post('/users/register', values);
        window.location.href = '/login';
      } catch (error) {
        console.error('Failed to register', error);
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
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={formik.values.username}
              onChange={formik.handleChange}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <FormControl fullWidth margin="normal" error={formik.touched.role && Boolean(formik.errors.role)}>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                label="Role"
              >
                <MenuItem value="participant">Participant</MenuItem>
                <MenuItem value="organizer">Organizer</MenuItem>
              </Select>
              <FormHelperText>{formik.touched.role && formik.errors.role}</FormHelperText>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box mt={8} mb={4} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            {'Copyright © '}
            <Link color="inherit" href="#">
              Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Register;
