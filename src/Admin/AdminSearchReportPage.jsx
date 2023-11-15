import { Box, Typography, Grid, TextField, Button, Paper } from '@mui/material';
import React, { useContext, useState, useEffect } from 'react';
import 'react-tagsinput/react-tagsinput.css'; // Import the CSS
import axios from 'axios';
import { Context } from '../App';
import AdminDashboard from './AdminDashboard';
import SearchQueryReport from './SearchQueryReport';
import { Outlet } from 'react-router-dom';
import {
    Pagination,
    CircularProgress,
  } from '@mui/material';


const styles = {
  inputField: {
    backgroundColor: '#eaf5ff',
    border: '1px solid #6fa8dd',
    borderRadius: '8px',
    marginBottom: '16px',
    color: "#8bbae5",
    with: "100%"
  },
  label: {
    color: '#8bbae5',
    marginBottom: '8px',
  },
  tagsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '8px',
  },
  tag: {
    backgroundColor: '#6fa8dd',
    color: '#fff',
    borderRadius: '4px',
    padding: '4px 8px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  tagText: {
    marginRight: '8px',
  },
  removeTag: {
    cursor: 'pointer',
  },
  content: {
    flex: 1,
    padding: '16px',
    marginLeft: '0',
    transition: 'margin-left 0.3s',
  },
};

const AdminSearchRepostPage = () => {
  const { drawerOpen } = useContext(Context);

  const [startDate, setStartDate] = useState('');
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);
  const [endDate, setEndDate] = useState(
    currentDate.toISOString().split('T')[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [queryAnswer, setQueryAnswer] = useState(null);

  // Pagination and sorting state
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedPageSize, setSelectedPageSize] = useState(10);

  const [ascending, setAscending] = useState(true);

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
                pageSize: selectedPageSize,
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
  /* eslint-disable */
  useEffect(() => {
    if (startDate && endDate) {
      fetchData();
    }
  }, [pageNumber, selectedPageSize, ascending]);

  const contentMargin = drawerOpen ? '0' : '0';

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

  const handlePageSizeChange = (event) => {
    setSelectedPageSize(event.target.value);
  };


  return (
    <Box style={{display:"flex"}}>
        <Box sx={{ width: drawerOpen ? '270px' : "0" }}><AdminDashboard /></Box>
        <Box style={{ ...styles.content, marginLeft: contentMargin }} className="enterpriseFormBox" sx={{ width: drawerOpen ? 'calc(100% - 270px)' : "100%", marginTop: '70px', padding: '16px' }}>
        <Box style={{ ...styles.content, marginLeft: contentMargin }}>
        <Typography variant="h6" sx={{ pb: 2 }}>Search Query Report</Typography>
        <Paper sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                id="startDate"
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                id="endDate"
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => handleEndDateChange(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
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
                fullWidth
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <TextField
                select
                label="Queries per Page"
                value={selectedPageSize}
                onChange={handlePageSizeChange}
                InputLabelProps={{
                  shrink: true,
                }}
                SelectProps={{
                  native: true,
                }}
                fullWidth
                disabled={
                  (queryAnswer?.totalCount <= 10 && selectedPageSize > queryAnswer?.totalCount) ||
                  (pageNumber * selectedPageSize >= queryAnswer?.totalCount)
                }
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </TextField>


            </Grid>
            <Grid item xs={12} sm={12} md={2} lg={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={fetchData}
                disabled={isSubmitting}
                style={{ width: '100%', maxWidth: '120px' }}
              >
                {isSubmitting ? <CircularProgress size={24} /> : 'Submit'}
              </Button>
            </Grid>
          </Grid>
        </Paper>
        {isError && (
          <Typography variant="body1" color="error">
            {errorMsg}
          </Typography>
        )}
        <Grid item xs={12}>
          <SearchQueryReport queryAnswer={queryAnswer} />
        </Grid>
        <Outlet />
        {queryAnswer && queryAnswer.totalCount > selectedPageSize && (
          <div style={styles.pagination}>
            <Pagination
              count={Math.ceil(queryAnswer.totalCount / selectedPageSize)} // Use selectedPageSize
              page={pageNumber}
              onChange={handlePageChange}
              color="primary"
            />
          </div>
        )}
      </Box>
        </Box>
    </Box>
  )
}

export default AdminSearchRepostPage