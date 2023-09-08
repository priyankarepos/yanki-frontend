import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, Typography, CssBaseline, AppBar, Toolbar, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchQueryReport from './SearchQueryReport'; // Import the SearchQueryReport component
import LightYankilogo from "../Assets/images/logo-light.svg"; // SVG Logo for light theme
import DarkYankilogo from "../Assets/images/logo-dark.svg";

const styles = {
  adminDashboard: {
    display: 'flex',
    height: '100vh',
  },
  appBar: {
    backgroundColor: '#1976D2',
  },
  menuButton: {
    marginLeft: 'auto',
  },
  title: {
    flexGrow: 1,
  },
  sidebar: {
    width: '250px',
    padding: '16px',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: '16px',
    marginLeft: '0', // Initially, no margin
    transition: 'margin-left 0.3s', // Smooth transition for margin
  },
  logoStyle: {
    width: "150px"
  }
};

const AdminDashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Calculate the content margin based on drawerOpen state
  const contentMargin = drawerOpen ? '250px' : '0';

  return (
<div style={styles.adminDashboard}>
      <CssBaseline />

      {/* App Bar */}
      <AppBar position="fixed" style={styles.appBar}>
        <Toolbar>
          <img
            src={DarkYankilogo}
            style={styles.logoStyle}
            className="logo"
            alt="Yanki logo"
          />
          <IconButton edge="end" color="inherit" aria-label="menu" onClick={toggleDrawer} style={styles.menuButton}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer open={drawerOpen} onClose={toggleDrawer} variant="persistent">
        <div style={styles.sidebar}>
          <img
            src={DarkYankilogo} // Use the logo you want for the sidebar
            style={{ ...styles.logoStyle, marginLeft: 'auto', marginRight: 'auto', marginBottom: '16px' }}
            className="logo"
            alt="Yanki logo"
          />
          <List>
            <ListItem button>
              <Link to="/" style={{ textDecoration: 'none', color: '#fff' }}>
                Home
              </Link>
            </ListItem>
            <ListItem button>
              <Link to="/search" style={{ textDecoration: 'none', color: '#fff' }}>
                Search
              </Link>
            </ListItem>
          </List>
        </div>
      </Drawer>

      {/* Content */}
      <div style={{ ...styles.content, marginLeft: contentMargin }}>
        <Toolbar />
        <Typography variant="h4">Search Query Report</Typography>

        {/* Include the SearchQueryReport component here */}
        <SearchQueryReport />

        {/* Outlet for other content */}
        <Outlet />
      </div>
    </div>
  );
}

export default AdminDashboard;