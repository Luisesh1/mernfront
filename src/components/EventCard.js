import React from 'react';
import { Card, CardContent, Typography, CardActions, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const generateBackground = (title) => {
  const hash = [...title].reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
  const h = hash % 360;
  const s = 70 + (hash % 30); // Saturation between 70 and 100
  const l = 50 + (hash % 20); // Lightness between 50 and 70
  const angle = hash % 360;
  return `linear-gradient(${angle}deg, hsl(${h}, ${s}%, ${l}%), hsl(${(h + 60) % 360}, ${s}%, ${l}%))`;
};

const EventCard = ({ event, onDelete }) => {
  const { user } = useAuth();

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete the event "${event.title}"?`)) {
      try {
        await api.delete(`/events/${event._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        onDelete(event._id);
      } catch (error) {
        console.error('Failed to delete event', error);
      }
    }
  };

  const backgroundStyle = {
    height: '140px',
    background: generateBackground(event.title),
  };

  return (
    <Card sx={{ maxWidth: 345, margin: 'auto', bgcolor: 'background.paper', boxShadow: 3, borderRadius: 2 }}>
      <Box sx={backgroundStyle}></Box>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {event.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {event.description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {new Date(event.date).toLocaleDateString()} at {event.time}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Location: {event.location}
        </Typography>
      </CardContent>
      <CardActions>
        {(user?.role === 'ticket_office' || user?.role === 'organizer') && (
          <Button
            size="small"
            component={Link}
            to={`/edit-event/${event._id}`}
          >
            Edit
          </Button>
        )}
        {user?.role === 'ticket_office' && (
          <Button
            size="small"
            color="secondary"
            onClick={handleDelete}
          >
            Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default EventCard;
