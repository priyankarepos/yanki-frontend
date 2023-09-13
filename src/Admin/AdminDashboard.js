import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Outlet, Link } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  Pagination,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LightYankilogo from '../Assets/images/logo-light.svg';
import DarkYankilogo from '../Assets/images/logo-dark.svg';

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
    marginLeft: '0',
    transition: 'margin-left 0.3s',
  },
  logoStyle: {
    width: '150px',
  },
  pagination: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
};

const AdminDashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const currentDate = new Date(); 
  currentDate.setDate(currentDate.getDate() + 1); 
  const [endDate, setEndDate] = useState(currentDate.toISOString().split('T')[0]); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [queryAnswer, setQueryAnswer] = useState(null);
  console.log("queryAnswer", queryAnswer);

  // Pagination and sorting state
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ascending, setAscending] = useState(false);

  useEffect(() => {
    fetchData();
  }, [pageNumber, pageSize, ascending]);

  const fetchData = async () => {
    try {
      setIsSubmitting(true);
      setIsError(false);
      setErrorMsg('');
      setQueryAnswer(null);

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const response = await axios.get(
        `${process.env.REACT_APP_API_HOST}/api/yanki-ai/admin-user-report`,
        {
          params: {
            startDate: startDate,
            endDate: endDate,
            pageNumber: pageNumber,
            pageSize: pageSize,
            ascending: ascending,
          },
          headers: {
            'Content-Type': 'application/json',
            TimeZone: timezone,
          },
        }
      );

      if (response.status === 200) {
        setIsSubmitting(false);
        setQueryAnswer(response.data);
        setIsError(false);
        setErrorMsg('');
      }
    } catch (error) {
      setIsSubmitting(false);
      setIsError(true);
      setQueryAnswer(null);

      if (error.response) {
        setErrorMsg(error.response.data.message || 'Something went wrong');
      } else if (error.request) {
        setErrorMsg('No response from the server');
      } else {
        setErrorMsg('Something went wrong');
      }
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  const contentMargin = drawerOpen ? '250px' : '0';

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handlePageChange = (event, newPage) => {
    setPageNumber(newPage);
  };

  const handleSortingChange = (event) => {
    setAscending(event.target.value === 'asc');
  };

  return (
    <div style={styles.adminDashboard}>
      <CssBaseline />
      <AppBar position="fixed" style={styles.appBar}>
        <Toolbar>
          <img
            src={DarkYankilogo}
            style={styles.logoStyle}
            className="logo"
            alt="Yanki logo"
          />
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
            style={styles.menuButton}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer open={drawerOpen} onClose={toggleDrawer} variant="persistent">
        <div style={styles.sidebar}>
          <img
            src={DarkYankilogo}
            style={{
              ...styles.logoStyle,
              marginLeft: 'auto',
              marginRight: 'auto',
              marginBottom: '16px',
            }}
            className="logo"
            alt="Yanki logo"
          />
          <List>
              <Link
                to="/"
                style={{ textDecoration: 'none', color: '#fff' }}
              >
            <ListItem button>
                Home
            </ListItem>
              </Link>
            <ListItem button>
              <Link
                to="/search"
                style={{ textDecoration: 'none', color: '#fff' }}
              >
                Search
              </Link>
            </ListItem>
          </List>
        </div>
      </Drawer>
      <div style={{ ...styles.content, marginLeft: contentMargin }}>
        <Toolbar />
        <Typography variant="h4">Search Query Report</Typography>
        <Grid container>
          <Grid item xs={3}>
            <TextField
              id="startDate"
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              id="endDate"
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={3}>
          <label>Sort Order:</label>
          <Select
            value={ascending ? 'asc' : 'desc'}
            onChange={handleSortingChange}
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={fetchData} // Fetch data when the "Submit" button is clicked
          disabled={isSubmitting}
        >
          Submit
        </Button>
        </Grid>
        </Grid>
        {isError && (
          <Typography variant="body1" color="error">
            {errorMsg}
          </Typography>
        )}
        {queryAnswer && (
          <div>
            <p>Total Count: {queryAnswer.totalCount}</p>
            <p>Page Number: {queryAnswer.pageNumber}</p>
            <p>Page Size: {queryAnswer.pageSize}</p>
            <p>Ascending: {queryAnswer && queryAnswer.ascending ? queryAnswer.ascending.toString() : 'N/A'}</p>
            {queryAnswer.data && queryAnswer.data.length > 0 ? (
              <ul>
                {queryAnswer.data.map((item) => (
                  <li key={item.id}>{item.query}</li>
                ))}
              </ul>
            ) : (
              <p>{queryAnswer}</p>
            )}
          </div>
        )}
        <Outlet />
        {queryAnswer && queryAnswer.totalCount > pageSize && (
          <div style={styles.pagination}>
            <Pagination
              count={Math.ceil(queryAnswer.totalCount / pageSize)}
              page={pageNumber}
              onChange={handlePageChange}
              color="primary"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
