import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, TextField, Box, Paper, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import io from 'socket.io-client';
import api from '../api';
import EventCard from '../components/EventCard';

const socket = io(process.env.REACT_APP_BASE_URL);

const Events = () => {
  const [events, setEvents] = useState([]);
  const [eventName, setEventName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [timeoutId, setTimeoutId] = useState(null);
  const [counts, setCounts] = useState({ totalEvents: 0, totalCategories: 0 });

  useEffect(() => {
    socket.on('updateCounts', (data) => {
      setCounts((prevCounts) => ({ ...prevCounts, ...data }));
    });
    return () => {
      socket.off('updateCounts');
    };
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const params = new URLSearchParams();
        if (eventName) params.append('eventName', eventName);
        if (categoryName) params.append('categoryName', categoryName);
        socket.emit('requestData');
        const response = await api.get(`/events?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setEvents(response.data);
      } catch (error) {
        console.error('Failed to fetch events', error);
      }
    };

    if (timeoutId) clearTimeout(timeoutId);
    setTimeoutId(setTimeout(fetchEvents, 500));

    return () => clearTimeout(timeoutId);
  }, [eventName, categoryName]);

  const handleDelete = (eventId) => {
    setEvents(events.filter((event) => event._id !== eventId));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
          <CalendarTodayIcon sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
          <Typography variant="h4" component="h1" align="center" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Events
          </Typography>
        </Box>
        <Box display="flex" justifyContent="center" mb={4}>
          <Typography variant="body1" align="center" sx={{ mr: 3 }}>
            Total Events: <strong>{counts.totalEvents}</strong>
          </Typography>
          <Typography variant="body1" align="center">
            Total Categories: <strong>{counts.totalCategories}</strong>
          </Typography>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          flexDirection={{ xs: 'column', sm: 'row' }}
        >
          <TextField
            label="Search by Event Name"
            variant="outlined"
            margin="normal"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, mr: { xs: 0, sm: 2 }, mb: { xs: 2, sm: 0 } }}
          />
          <TextField
            label="Search by Category Name"
            variant="outlined"
            margin="normal"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1 }}
          />
        </Box>
        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid item key={event._id} xs={12} sm={6} md={4}>
              <EventCard event={event} onDelete={handleDelete} />
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default Events;
