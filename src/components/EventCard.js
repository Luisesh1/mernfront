import React, { useState } from 'react';
import { Card, CardContent, Typography, CardActions, Button, Box, Avatar, Modal, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import VisibilityIcon from '@mui/icons-material/Visibility';

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
  const [isCoverLoaded, setIsCoverLoaded] = useState(false);
  const [isLogoLoaded, setIsLogoLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subscribers, setSubscribers] = useState([]);
  
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

  const handleSubscribe = async () => {
    try {
      await api.post('/events/subscribe', {
        userId: user._id,
        eventId: event._id,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Subscribed successfully!');
    } catch (error) {
      console.error('Failed to subscribe to event', error);
      alert('Failed to subscribe to event');
    }
  };

  const handleViewSubscribers = async () => {
    try {
      const response = await api.get(`/events/${event._id}/subscribers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSubscribers(response.data.events);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch subscribers', error);
      alert('Failed to fetch subscribers');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const backgroundStyle = {
    height: '140px',
    background: generateBackground(event.title),
  };

  const coverStyle = {
    height: '140px',
    width: '100%',
    objectFit: 'cover',
    display: isCoverLoaded ? 'block' : 'none', // Hide if not loaded
  };

  const logoStyle = {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 40,
    height: 40,
    borderRadius: '50%',
    border: '2px solid white',
    backgroundColor: '#ccc', // Default color if no logo
    display: isLogoLoaded ? 'block' : 'none', // Hide if not loaded
  };

  const handleCoverError = () => {
    setIsCoverLoaded(false);
  };

  const handleLogoError = () => {
    setIsLogoLoaded(false);
  };

  return (
    <>
      <Card sx={{ maxWidth: 345, margin: 'auto', bgcolor: 'background.paper', boxShadow: 3, borderRadius: 2, position: 'relative' }}>
        {event.cover && (
          <img
            src={`${process.env.REACT_APP_BASE_URL}/${event.cover}`}
            alt="Event Cover"
            style={coverStyle}
            onLoad={() => setIsCoverLoaded(true)}
            onError={handleCoverError}
          />
        )}
        {!isCoverLoaded && <Box sx={backgroundStyle}></Box>} {/* Render background if cover is not loaded */}
        
        {event.logo && (
          <Avatar
            src={`${process.env.REACT_APP_BASE_URL}/${event.logo}`}
            alt="Event Logo"
            sx={logoStyle}
            onLoad={() => setIsLogoLoaded(true)}
            onError={handleLogoError}
          />
        )}
        {!isLogoLoaded && (
          <Avatar sx={logoStyle}>
            <span style={{ fontSize: '0.8rem', color: '#555' }}>Logo</span> {/* Fallback generic logo */}
          </Avatar>
        )}

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
          <Button
            size="small"
            color="primary"
            onClick={handleSubscribe}
          >
            Subscribe
          </Button>
          <IconButton
            size="small"
            color="primary"
            onClick={handleViewSubscribers}
          >
            <VisibilityIcon />
          </IconButton>
        </CardActions>
      </Card>

      {/* Modal to show subscribers */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="subscribers-modal-title"
        aria-describedby="subscribers-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
          <Typography id="subscribers-modal-title" variant="h6" component="h2">
            Subscribers
          </Typography>
          <List>
            {subscribers.map((subscriber) => (
              <ListItem key={subscriber._id}>
                <ListItemText primary={subscriber.username} secondary={subscriber.email} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Modal>
    </>
  );
};

export default EventCard;
