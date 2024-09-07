import React, { useState, useEffect } from 'react';
import { Container, Box, Grid, Paper, Typography, Card, CardContent, Avatar } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import io from 'socket.io-client';
import GroupIcon from '@mui/icons-material/Group';
import EventIcon from '@mui/icons-material/Event';
import api from '../api';

const socket = io(process.env.REACT_APP_BASE_URL);

const Dashboard = () => {
  const [counts, setCounts] = useState({ totalEvents: 0, totalCategories: 0 });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on('updateCounts', (data) => {
      setCounts((prevCounts) => ({ ...prevCounts, ...data }));
    });

    const fetchUsers = async () => {
      try {
        socket.emit('requestData');
        const response = await api.get('/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();

    return () => {
      socket.off('updateCounts');
    };
  }, []);

  // Datos hardcodeados para gráficos de eventos y categorías
  const chartData = [
    { name: 'January', events: 20, categories: 10 },
    { name: 'February', events: 30, categories: 15 },
    { name: 'March', events: 50, categories: 20 },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Contadores */}
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3} sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
              <EventIcon />
            </Avatar>
            <Box>
              <Typography variant="h6">Total Events</Typography>
              <Typography variant="h4">{counts.totalEvents}</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3} sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
            <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
              <GroupIcon />
            </Avatar>
            <Box>
              <Typography variant="h6">Total Categories</Typography>
              <Typography variant="h4">{counts.totalCategories}</Typography>
            </Box>
          </Card>
        </Grid>
        {/* Lista de Usuarios */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, height: 400, overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Users List
            </Typography>
            <DataGrid
              rows={users.map((user, index) => ({ ...user, id: index + 1 }))}
              columns={[
                { field: 'id', headerName: 'ID', width: 90 },
                { field: 'username', headerName: 'Username', width: 150 },
                { field: 'email', headerName: 'Email', width: 200 },
                { field: 'role', headerName: 'Role', width: 150 },
              ]}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              sx={{
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: 'rgba(245, 245, 245, 1)',
                },
              }}
            />
          </Paper>
        </Grid>
        {/* Gráfico de Eventos y Categorías */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Events and Categories Over Time
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={chartData}>
                <Line type="monotone" dataKey="events" stroke="#8884d8" />
                <Line type="monotone" dataKey="categories" stroke="#82ca9d" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
