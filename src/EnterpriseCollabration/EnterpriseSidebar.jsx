import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@mui/material';
import NetworkWifiIcon from '@mui/icons-material/NetworkWifi';
import BusinessIcon from '@mui/icons-material/Business';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { NavLink } from 'react-router-dom';

const EnterpriseSidebar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <List>
        <ListItem
          button
          onClick={toggleDropdown}
        >
          <ListItemIcon>
            <NetworkWifiIcon />
          </ListItemIcon>
          <ListItemText primary="Networking Interface" />
        </ListItem>
        <Collapse in={isDropdownOpen}>
          <List component="div">
            <NavLink
              to="/enterprise/enterprise-profile"
              style={{ textDecoration: 'none', color: '#fff' }}
              activeClassName="active"
            >
              <ListItem button>
                <ListItemIcon>
                  <BusinessIcon />
                </ListItemIcon>
                <ListItemText primary="Enterprise Profile" />
              </ListItem>
            </NavLink>
            <NavLink
              to="/enterprise/departments"
              style={{ textDecoration: 'none', color: '#fff' }}
              activeClassName="active"
            >
              <ListItem button>
                <ListItemIcon>
                  <AccountBalanceIcon />
                </ListItemIcon>
                <ListItemText primary="Departments" />
              </ListItem>
            </NavLink>
          </List>
        </Collapse>
      </List>
    </div>
  );
};

export default EnterpriseSidebar;
