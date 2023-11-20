import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import 'react-tagsinput/react-tagsinput.css'; // Import the CSS
import { Context } from '../App';
import AdminDashboard from './AdminDashboard';
import { Grid, FormControl, Select, MenuItem, ListItemIcon, useMediaQuery } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import axios from "axios";
import {
    Pagination,
    CircularProgress,
  } from '@mui/material';

const styles = {
    tableContainer: {
        marginBottom: '0',
    },
    headerCell: {
        fontWeight: 'bold',
        background: '#13538b',
        color: 'white',
        minWidth: "200px",
        fontSize: 16,
    },
    cell: {
        fontSize: 16,
    },
    approveButton: {
        backgroundColor: "#063762",
        color: "#fff",
        textTransform: "capitalize",
        borderRadius: "50px",
        padding: "0 15px",
        height: "40px",
        marginLeft: "7px",
    },
    content: {
        flex: 1,
        padding: '16px',
        marginLeft: '0',
        transition: 'margin-left 0.3s',
    },
};

const AdminEnterpriseRequest = () => {
    const { drawerOpen } = useContext(Context);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [enterpriseCategories, setEnterpriseCategories] = useState([]);
    const [enterpriseRequests, setEnterpriseRequests] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [isSubmitting, setIsSubmitting] = useState(false);
    console.log("enterpriseCategories", enterpriseCategories);
    console.log("enterpriseRequests", enterpriseRequests);

    const openSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    useEffect(() => {
        const fetchEnterpriseCategories = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_HOST}/api/yanki-ai/get-enterprises-categories`
                );

                if (response.status === 200) {
                    setEnterpriseCategories(response.data);
                    // if (response.data.length > 0) {
                    //     setSelectedCategory(response.data[0].id);
                    // }
                } else {
                    console.error("Failed to fetch enterprise categories");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        const fetchEnterpriseRequests = async () => {
            try {
                if (!selectedCategory) {
                    console.error("Please select an enterprise category");
                    return;
                }
    
                const response = await axios.get(
                    `${process.env.REACT_APP_API_HOST}/api/yanki-ai/get-enterprises-requests`,
                    {
                        params: {
                            categoryId: selectedCategory,
                            pageNumber: 1,
                        },
                    }
                );
    
                if (response.status === 200) {
                    setEnterpriseRequests(response.data);
                } else {
                    console.error("Failed to fetch enterprise requests");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };
    

        fetchEnterpriseCategories();
        fetchEnterpriseRequests();
    }, [selectedCategory]);

    const handleApprove = async (enterpriseId, userId, enterpriseName) => {
        console.log("enterpriseId", enterpriseId);
        try {
            setIsSubmitting(true);
            const url = `${process.env.REACT_APP_API_HOST}/api/yanki-ai/approve-reject-enterprises-requests/${userId}/${enterpriseId}/approve`;
            console.log('Request URL:', url);

            const response = await axios.post(url);

            if (response.status === 200) {
                setIsSubmitting(false);
                openSnackbar(`Enterprise ${enterpriseName} approved successfully`, 'success');
            } else {
                openSnackbar('Failed to approve enterprise request', 'error');
            }
        } catch (error) {
            setIsSubmitting(false);
            console.error("Error:", error);
        }
    };

    const handleReject = async (enterpriseId, userId, enterpriseName) => {
        console.log("enterpriseId", enterpriseId);
        try {
            setIsSubmitting(true);
            const url = `${process.env.REACT_APP_API_HOST}/api/yanki-ai/approve-reject-enterprises-requests/${userId}/${enterpriseId}/reject`;
            console.log('Request URL:', url);

            const response = await axios.post(url);

            if (response.status === 200) {
                setIsSubmitting(false);
                openSnackbar(`Enterprise ${enterpriseName} rejected successfully`, 'success');
            } else {
                openSnackbar('Failed to reject enterprise request', 'error');
            }
        } catch (error) {
            setIsSubmitting(false);
            console.error("Error:", error);
        }
    };


    const contentMargin = drawerOpen ? '0' : '0';

    return (
        <Box style={{ display: "flex" }}>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
            >
                <SnackbarContent
                    message={snackbarMessage}
                    style={{
                        backgroundColor: snackbarSeverity === 'success' ? '#2862953' : '#286295',
                      }}
                />
            </Snackbar>
            <Box sx={{ width: drawerOpen ? '270px' : "0" }}><AdminDashboard /></Box>
            <Box style={{ ...styles.content, marginLeft: contentMargin }} className="enterpriseFormBox" sx={{ width: drawerOpen ? 'calc(100% - 270px)' : "100%", marginTop: '70px', padding: '16px' }}>
                <Box style={{ ...styles.content, marginLeft: contentMargin }}>
                    <Typography variant="h6" sx={{ pb: 2 }}>Enterprise Request</Typography>
                    <Box sx={{ marginBottom: "25px", }}>
                        <FormControl fullWidth sx={{
                            width: { xs: '100%', md: '30%' },
                        }}>
                            <Select
                                value={selectedCategory}
                                onChange={(event) => setSelectedCategory(event.target.value)}
                                displayEmpty
                                sx={{ marginBottom: "10px" }}
                                className='EnterpriseCategorySelect'
                            >
                                <MenuItem value="">
                                    Select an Enterprise Category
                                </MenuItem>
                                {enterpriseCategories.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <TableContainer component={Paper} style={styles.tableContainer}>
                        <Table style={styles.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={styles.headerCell}>Enterprise Name</TableCell>
                                    <TableCell style={styles.headerCell}>Email</TableCell>
                                    <TableCell style={styles.headerCell}>Phone Number</TableCell>
                                    <TableCell style={styles.headerCell}>Contact Person</TableCell>
                                    <TableCell style={styles.headerCell}>Website</TableCell>
                                    <TableCell style={styles.headerCell}>Request Date</TableCell>
                                    <TableCell style={styles.headerCell}>Status</TableCell>
                                    <TableCell style={{ ...styles.headerCell, textAlign: "center", }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {enterpriseRequests && enterpriseRequests.data ? (
                                    enterpriseRequests.data.map((row) => (
                                        <TableRow key={row.enterpriseId}>
                                            <TableCell style={styles.cell}>{row.enterpriseName}</TableCell>
                                            <TableCell style={styles.cell}>{row.email}</TableCell>
                                            <TableCell style={styles.cell}>{row.phoneNumber}</TableCell>
                                            <TableCell style={styles.cell}>{row.contactPersonName}</TableCell>
                                            <TableCell style={styles.cell}>
                                                <a href={row.website} style={{ color: "#fff" }}>
                                                    {row.website}
                                                </a>
                                            </TableCell>
                                            <TableCell style={styles.cell}>  {new Date(row.requestDate).toLocaleDateString('en-GB')}</TableCell>
                                            <TableCell style={styles.cell}>{row.status}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    style={styles.approveButton}
                                                    disabled={isSubmitting}
                                                    onClick={() => handleApprove(row.enterpriseId, row.userId, row.enterpriseName)}
                                                >
                                                    {isSubmitting ? <CircularProgress size={24} /> : 'Approve'}
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    size="small"
                                                    style={styles.approveButton}
                                                    disabled={isSubmitting}
                                                    onClick={() => handleReject(row.enterpriseId, row.userId, row.enterpriseName)}
                                                >
                                                    {isSubmitting ? <CircularProgress size={24} /> : 'Reject'}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} style={{ textAlign: 'left' }}>
                                            {selectedCategory ? 'Loading or no data available' : 'Please select a category'}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>

                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </Box >
    )
}

export default AdminEnterpriseRequest