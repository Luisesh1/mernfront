import React, { useEffect, useState } from 'react';
import { Grid, Box } from '@mui/material';
import api from '../api';
import EventCard from './EventCard';

const EventList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Failed to fetch events', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={4} justifyContent="center">
        {events.map((event) => (
          <Grid item key={event._id} xs={12} sm={6} md={4} lg={3}>
            <EventCard event={event} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default EventList;
