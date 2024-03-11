import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, TextField, Modal, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, InputLabel, Snackbar, CircularProgress, useMediaQuery } from '@mui/material';
import AdminDashboard from './AdminDashboard';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { Context } from '../App';
import ConfirmDialog from '../EnterpriseCollabration/ConfirmDialog';
import "./AdminStyle.css";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { pdfjs } from 'react-pdf';
import CloseIcon from "@mui/icons-material/Close";

const styles = {
    tableContainer: {
        marginBottom: '0',
    },
    label: {
        color: '#8bbae5',
        marginBottom: '8px',
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
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContent: {
        backgroundColor: '#063762',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
        padding: '35px 25px',
        width: '500px',
        borderRadius: '8px',
    },
    modalTitle: {
        fontWeight: 'medium',
        marginBottom: '16px',
    },
    modalForm: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    modalButton: {
        backgroundColor: '#fff',
        color: '#063762',
        textTransform: 'capitalize',
        borderRadius: '10px',
        padding: '30px 15px',
        fontSize: '16px',
        marginTop: "20px",
    },
    approveButton: {
        backgroundColor: "#063762",
        color: "#fff",
        textTransform: "capitalize",
        borderRadius: "50px",
        padding: "0 15px",
        height: "40px",
        marginLeft: "7px",
        width: "max-content",
    },
};

const AdminEventRequest = () => {
    const { drawerOpen } = useContext(Context);
    const [eventRequest, setEventRequest] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [editCategoryId, setEditCategoryId] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [confirmationText, setConfirmationText] = useState('');
    const [loading, setLoading] = useState(false);
    const [isPdfModalOpen, setPdfModalOpen] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const dummyImageUrls = [
        {
            url: 'https://m.media-amazon.com/images/I/71GUQN6ivhL._AC_UF1000,1000_QL80_.jpg',
            name: 'Image 1',
        },
        {
            url: 'https://m.media-amazon.com/images/I/71GUQN6ivhL._AC_UF1000,1000_QL80_.jpg',
            name: 'Image 2',
        },
        {
            url: 'https://m.media-amazon.com/images/I/71GUQN6ivhL._AC_UF1000,1000_QL80_.jpg',
            name: 'Image 3',
        },
    ];

    const openPdfModal = (pdfUrl) => {
        setSelectedPdf(pdfUrl);
        setPdfModalOpen(true);
    };

    const closePdfModal = () => {
        setPdfModalOpen(false);
        setSelectedPdf(null);
    };

    const handleImageClick = (imageUrl) => {
        console.log("imageUrl", imageUrl);
        setSelectedImage({ url: imageUrl.url });
        setIsImageModalOpen(true);
    };

    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
    const contentMargin = drawerOpen ? '0' : '0';

    return (
        <Box style={{ display: "flex" }}>
            <Box sx={{ width: drawerOpen && !isSmallScreen ? '270px' : "0" }}><AdminDashboard /></Box>
            <Box style={{ ...styles.content, marginLeft: contentMargin }} className="enterpriseFormBox" sx={{ width: drawerOpen ? 'calc(100% - 270px)' : "100%", marginTop: '70px', padding: '16px' }}>
                <Box style={{ ...styles.content, marginLeft: contentMargin }}>
                    <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: "15px", }}>
                        <Typography variant="h6" sx={{ flex: '1', pb: 2 }}>
                            Event Submission Requests
                        </Typography>
                        <IconButton color="secondary" size="small" style={{ color: "#fff", padding: "5px" }}>
                            <AddIcon /> Add
                        </IconButton>
                    </Box>
                    {!eventRequest.length > 0 ? (
                        <TableContainer component={Paper} style={styles.tableContainer} className='enterprise-request-table'>
                            <Table style={styles.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={styles.headerCell}>Name</TableCell>
                                        <TableCell style={styles.headerCell}>Email</TableCell>
                                        <TableCell style={styles.headerCell}>Location</TableCell>
                                        <TableCell style={styles.headerCell}>Date</TableCell>
                                        <TableCell style={styles.headerCell}>Time</TableCell>
                                        <TableCell style={styles.headerCell}>Event Detail</TableCell>
                                        <TableCell style={styles.headerCell}>Images</TableCell>
                                        <TableCell style={{ ...styles.headerCell, textAlign: "right", }}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {/* {eventRequest.map((row) => ( */}
                                    <TableRow>
                                        <TableCell style={styles.cell}>XYZ</TableCell>
                                        <TableCell style={styles.cell}>xyz@gmail.com</TableCell>
                                        <TableCell style={styles.cell}>XYZ</TableCell>
                                        <TableCell style={styles.cell}>XYZ</TableCell>
                                        <TableCell style={styles.cell}>XYZ</TableCell>
                                        <TableCell style={styles.cell}>XYZ</TableCell>
                                        <TableCell style={styles.cell}>
                                            {dummyImageUrls.map((image, index) => (
                                                <p key={index} onClick={() => handleImageClick(image)}>
                                                    {image.name}
                                                </p>
                                            ))}
                                        </TableCell>
                                        <TableCell style={{ ...styles.cell, textAlign: "right", }}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    style={styles.approveButton}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    size="small"
                                                    style={styles.approveButton}
                                                >
                                                    Reject
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    size="small"
                                                    style={styles.approveButton}
                                                >
                                                    Ask for more info
                                                </Button>                                                </div>
                                        </TableCell>
                                    </TableRow>
                                    {/* ))} */}
                                </TableBody>
                            </Table>
                        </TableContainer>) : (
                        <Typography variant="body1" className='no-data-found'>
                            No event submession request available.
                        </Typography>
                    )}
                </Box>
            </Box>
            <Modal
                open={isPdfModalOpen || isImageModalOpen}
                onClose={() => {
                    closePdfModal();
                    setIsImageModalOpen(false);
                }}
                aria-labelledby="pdf-modal-title"
                aria-describedby="pdf-modal-description"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div className="pdf-modal">
                    <IconButton onClick={() => {
                        closePdfModal();
                        setIsImageModalOpen(false);
                    }} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    {selectedImage && (
                        <img
                            src={selectedImage.url}
                            alt={selectedImage.name || 'Image'}
                            style={{ maxWidth: '100%', maxHeight: '100%' }}
                        />
                    )}
                </div>
            </Modal>
        </Box>
    )
}

export default AdminEventRequest;
