import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, InputLabel } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import 'react-tagsinput/react-tagsinput.css'; // Import the CSS
import { Context } from '../App';
import AdminDashboard from './AdminDashboard';
import { FormControl, Select, MenuItem } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import axios from "axios";
import {
    Pagination,
    CircularProgress,
} from '@mui/material';
import "./AdminStyle.css"
import ConfirmDialog from '../EnterpriseCollabration/ConfirmDialog';

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
    label: {
        color: '#8bbae5',
        marginBottom: '8px',
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
    const [pageNumber, setPageNumber] = useState(1);
    // const [pageSize, setPageSize] = useState(10); 
    const [totalPages, setTotalPages] = useState(1);
    const [loadingRows, setLoadingRows] = useState([]);
    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [confirmationText, setConfirmationText] = useState('');
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [enterpriseIdToDelete, setEnterpriseIdToDelete] = useState(null);
    const [userIdToDelete, setUserIdToDelete] = useState(null);

    console.log("enterpriseRequests", enterpriseRequests);
    console.log("selectedCategory", selectedCategory);

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
                const categoryIdParam = selectedCategory || null;

                const response = await axios.get(
                    `${process.env.REACT_APP_API_HOST}/api/yanki-ai/get-enterprises-requests`,
                    {
                        params: {
                            categoryId: categoryIdParam,
                            pageNumber: pageNumber,
                            pageSize: 10,
                        },
                    }
                );

                if (response.status === 200) {
                    setEnterpriseRequests(response.data);
                    setTotalPages(Math.ceil(response.data.totalCount / 10));
                } else {
                    console.error("Failed to fetch enterprise requests");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchEnterpriseCategories();
        fetchEnterpriseRequests();
    }, [selectedCategory, pageNumber]);


    const handlePageChange = (event, newPage) => {
        setPageNumber(newPage);
    };

    const handleApprove = async (enterpriseId, userId, enterpriseName) => {
        try {
            const updatedLoadingRows = [...loadingRows, enterpriseId];
            setLoadingRows(updatedLoadingRows);

            const url = `${process.env.REACT_APP_API_HOST}/api/yanki-ai/approve-reject-enterprises-requests/${userId}/${enterpriseId}/approve`;
            const response = await axios.post(url);

            if (response.status === 200) {
                const updatedRequests = enterpriseRequests.data.map((row) =>
                    row.enterpriseId === enterpriseId ? { ...row, status: 'Approved' } : row
                );
                setEnterpriseRequests({ ...enterpriseRequests, data: updatedRequests });

                openSnackbar(`Enterprise ${enterpriseName} approved successfully`, 'success');
            } else {
                openSnackbar('Failed to approve enterprise request', 'error');
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            const updatedLoadingRows = loadingRows.filter((rowId) => rowId !== enterpriseId);
            setLoadingRows(updatedLoadingRows);
        }
    };

    const handleReject = async (enterpriseId, userId, enterpriseName) => {
        try {
            const updatedLoadingRows = [...loadingRows, enterpriseId];
            setLoadingRows(updatedLoadingRows);

            const url = `${process.env.REACT_APP_API_HOST}/api/yanki-ai/approve-reject-enterprises-requests/${userId}/${enterpriseId}/reject`;
            const response = await axios.post(url);

            if (response.status === 200) {
                const updatedRequests = enterpriseRequests.data.map((row) =>
                    row.enterpriseId === enterpriseId ? { ...row, status: 'Rejected' } : row
                );
                setEnterpriseRequests({ ...enterpriseRequests, data: updatedRequests });

                openSnackbar(`Enterprise ${enterpriseName} rejected successfully`, 'success');
            } else {
                openSnackbar('Failed to reject enterprise request', 'error');
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            const updatedLoadingRows = loadingRows.filter((rowId) => rowId !== enterpriseId);
            setLoadingRows(updatedLoadingRows);
        }
    };

    const handleDeleteClick = (enterpriseId, userId, enterpriseName) => {
        setConfirmationText(`Are you sure you want to delete the request for ${enterpriseName}?`);
        setConfirmDialogOpen(true);
        setEnterpriseIdToDelete(enterpriseId);
        setUserIdToDelete(userId);
    };

    const handleConfirmDelete = async () => {
        try {
            const url = `${process.env.REACT_APP_API_HOST}/api/yanki-ai/delete-enterprise/${userIdToDelete}/${enterpriseIdToDelete}`;
            const response = await axios.delete(url);

            if (response.status === 200) {
                const updatedRequests = enterpriseRequests.data.filter((row) => row.enterpriseId !== enterpriseIdToDelete);
                setEnterpriseRequests({ ...enterpriseRequests, data: updatedRequests });

                openSnackbar(`Request deleted successfully`, 'success');
            } else {
                openSnackbar('Failed to delete the request', 'error');
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setConfirmDialogOpen(false);
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
                        <InputLabel style={styles.label}>Select Category</InputLabel>
                        <FormControl fullWidth sx={{
                            width: { xs: '100%', md: '100%' },
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
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        size="small"
                                                        style={styles.approveButton}
                                                        disabled={loadingRows.includes(row.enterpriseId) || row.status === 'Approved' || row.status === 'Rejected'}
                                                        onClick={() => {
                                                            setIsApproving(true);
                                                            handleApprove(row.enterpriseId, row.userId, row.enterpriseName);
                                                        }}                                                >
                                                        {(isApproving && loadingRows.includes(row.enterpriseId)) ? <CircularProgress size={24} /> : 'Approve'}
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        size="small"
                                                        style={styles.approveButton}
                                                        disabled={loadingRows.includes(row.enterpriseId) || row.status === 'Approved' || row.status === 'Rejected'}
                                                        onClick={async () => {
                                                            setIsRejecting(true);
                                                            await handleReject(row.enterpriseId, row.userId, row.enterpriseName);
                                                            setIsRejecting(false);
                                                        }}                                               >
                                                        {(isRejecting && loadingRows.includes(row.enterpriseId)) ? <CircularProgress size={24} /> : 'Reject'}

                                                    </Button>
                                                    {row.status === 'Rejected' && (
                                                        <Button
                                                            variant="contained"
                                                            color="secondary"
                                                            size="small"
                                                            style={styles.approveButton}
                                                            disabled={loadingRows.includes(row.enterpriseId)}
                                                            onClick={() => handleDeleteClick(row.enterpriseId, row.userId, row.enterpriseName)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    )}
                                                </div>
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
                        {totalPages > 1 && (
                            <Pagination
                                count={totalPages}
                                page={pageNumber}
                                onChange={handlePageChange}
                                color="primary"
                                style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}
                            />
                        )}
                    </TableContainer>
                </Box>
            </Box>
            <ConfirmDialog
                open={confirmDialogOpen}
                handleClose={() => setConfirmDialogOpen(false)}
                handleConfirm={handleConfirmDelete}
                confirmationText={confirmationText}
            />
        </Box >
    )
}

export default AdminEnterpriseRequest