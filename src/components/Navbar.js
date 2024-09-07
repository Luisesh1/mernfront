import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, ListItemIcon, Divider, Box, Collapse } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import EventIcon from '@mui/icons-material/Event';
import CategoryIcon from '@mui/icons-material/Category';
import CreateIcon from '@mui/icons-material/Create';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(true);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* AppBar for the top navigation */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            Event Management
          </Typography>
          {user ? (
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          ) : (
            <Button color="inherit" component={Link} to="/login">Login</Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Adding Toolbar to push the content below AppBar */}
      <Toolbar />

      {/* Drawer for the sidebar */}
      <Drawer
        variant="permanent"
        open={drawerOpen}
        sx={{
          width: drawerOpen ? 240 : 60,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerOpen ? 240 : 60,
            boxSizing: 'border-box',
            transition: 'width 0.3s',
          },
        }}
      >
        <Toolbar>
          <IconButton onClick={handleDrawerToggle}>
            {drawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Toolbar>
        <Divider />
        <List>
          <ListItem button component={Link} to="/" onClick={handleDrawerToggle}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <Collapse in={drawerOpen} orientation="horizontal">
              <ListItemText primary="Home" />
            </Collapse>
          </ListItem>
          <ListItem button component={Link} to="/events" onClick={handleDrawerToggle}>
            <ListItemIcon>
              <EventIcon />
            </ListItemIcon>
            <Collapse in={drawerOpen} orientation="horizontal">
              <ListItemText primary="Events" />
            </Collapse>
          </ListItem>
          {user && (user.role === 'ticket_office' || user.role === 'organizer') && (
            <>
              <Divider />
              <ListItem button component={Link} to="/create-event" onClick={handleDrawerToggle}>
                <ListItemIcon>
                  <CreateIcon />
                </ListItemIcon>
                <Collapse in={drawerOpen} orientation="horizontal">
                  <ListItemText primary="Create Event" />
                </Collapse>
              </ListItem>
              <ListItem button component={Link} to="/create-category" onClick={handleDrawerToggle}>
                <ListItemIcon>
                  <CategoryIcon />
                </ListItemIcon>
                <Collapse in={drawerOpen} orientation="horizontal">
                  <ListItemText primary="Create Category" />
                </Collapse>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
