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
  Box
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DarkYankilogo from '../Assets/images/logo-dark.svg';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
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
    if (startDate && endDate) {
      fetchData();
    }
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

  // const handleReset = () => {
  //   setStartDate(null);
  //   setEndDate(currentDate.toISOString().split('T')[0]);
  //   setQueryAnswer(null);
  // };

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
      <Box style={{ ...styles.content, marginLeft: contentMargin }}>
        <Toolbar />
        <Typography variant="h6" sx={{ py: 2 }}>Search Query Report</Typography>
        <Paper sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
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
                style={{ width: '100%' }}
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
                style={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                select
                label="Sort Order"
                value={ascending ? 'asc' : 'desc'}
                onChange={handleSortingChange}
                InputLabelProps={{
                  shrink: true,
                }}
                SelectProps={{
                  native: true,
                }}
                style={{ width: '100%' }}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </TextField>
            </Grid>
            <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={fetchData}
                disabled={isSubmitting}
                style={{ width: '80%', maxWidth: '120px' }}
              >
                Submit
              </Button>
              {/* <Button
                variant="contained"
                color="primary"
                onClick={handleReset}
                disabled={isSubmitting}
                style={{ marginLeft:"8px" }}
              >
                Reset
              </Button> */}
            </Grid>
          </Grid>

        </Paper>
        {isError && (
          <Typography variant="body1" color="error">
            {errorMsg}
          </Typography>
        )}
        {queryAnswer && (
          <div>
            {/* <p>Total Count: {queryAnswer.totalCount}</p>
            <p>Page Number: {queryAnswer.pageNumber}</p>
            <p>Page Size: {queryAnswer.pageSize}</p>
            <p>Ascending: {queryAnswer && queryAnswer.ascending ? queryAnswer.ascending.toString() : 'N/A'}</p> */}
            {queryAnswer == null ? (
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Typography variant="body1">Please select a date range to view search queries.</Typography>
                </Grid>
              </Grid>
            ) : (
              queryAnswer && queryAnswer.data && queryAnswer.data.length > 0 ? (
                <TableContainer sx={{ my: 2 }} component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Query</TableCell>
                        {/* Add more table headers as needed */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {queryAnswer.data.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.id}</TableCell>
                          <TableCell>{item.query}</TableCell>
                          {/* Add more table cells for additional data */}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <p>{queryAnswer}</p>
              )
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
      </Box>
    </div>
  );
};

export default AdminDashboard;
