import { Box, Typography, Grid, TextField, Button, Paper, useMediaQuery } from '@mui/material';
import React, { useContext, useState, useEffect } from 'react';
import 'react-tagsinput/react-tagsinput.css'; 
import axios from 'axios';
import { Context } from '../App';
import AdminDashboard from './AdminDashboard';
import SearchQueryReport from './SearchQueryReport';
import { Outlet } from 'react-router-dom';
import {
  Pagination,
  CircularProgress,
} from '@mui/material';
import { agentChatResponse } from '../Utils/stringConstant/AgentChatResponse';

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
        `${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/admin-user-report`,
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

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  return (
    <Box className="event-request-container">
      <Box sx={{
          width:
            drawerOpen && !isSmallScreen
              ? agentChatResponse.drawerOpenWidth
              : agentChatResponse.zeroWidth,
              transition: agentChatResponse.transitionStyle,
        }}><AdminDashboard /></Box>
      <Box className={agentChatResponse.enterpriseFormBox}
        sx={{
          width: drawerOpen
            ? agentChatResponse.drawerOpenCalcWidth
            : agentChatResponse.hundredWidth,transition: agentChatResponse.transitionStyle,
        }}>
        <Box className="event-content">
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
              <Grid item xs={12} sm={12} md={2} lg={2} className='event-pdf-modal-open'>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={fetchData}
                  disabled={isSubmitting}
                  className='admin-search-report-button'
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
            <div className='enterprise-pagination'>
              <Pagination
                count={Math.ceil(queryAnswer.totalCount / selectedPageSize)}
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