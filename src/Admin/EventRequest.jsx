import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, TextField, Modal, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, InputLabel, Snackbar, CircularProgress, useMediaQuery, Grid, FormHelperText } from '@mui/material';
import AdminDashboard from './AdminDashboard';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { Context } from '../App';
import ConfirmDialog from '../EnterpriseCollabration/ConfirmDialog';
import "./AdminStyle.css";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { pdfjs } from 'react-pdf';
import CloseIcon from "@mui/icons-material/Close";
import Multiselect from 'multiselect-react-dropdown';
import { Controller, useForm } from 'react-hook-form';
import VisibilityIcon from "@mui/icons-material/Visibility";
import { FormControl } from '@mui/base';

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

const modalContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'auto',
    padding: '20px',
    outline: 'none',
    marginTop: 'auto',
};

const AdminEventRequest = () => {
    const { control, handleSubmit, setValue, reset, getValues, formState: { errors } } = useForm();
    const { drawerOpen } = useContext(Context);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [confirmationText, setConfirmationText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPdfModalOpen, setPdfModalOpen] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [eventLocations, setEventLocations] = useState([]);
    const [eventRequests, setEventRequests] = useState([]);
    const [publicationArea, setPublicationArea] = useState([]);
    const [eventTypes, setEventTypes] = useState([]);
    //const [selectedValues, setSelectedValues] = useState([]);
    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    // const [responseMessage, setResponseMessage] = useState("");
    const [loadingRows, setLoadingRows] = useState([]);
     const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [eventIdToDelete, setEventIdToDelete] = useState(null);
    const [userIdToDelete, setUserIdToDelete] = useState(null);
    const [editEventData, setEditEventData] = useState(null);
    const [editEventId, setEditEventId] = useState(null);
    console.log("editEventData", editEventData);
    console.log("editEventId", editEventId);

    const fetchEventRequest = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/events/get-allevents`);

            if (response.status === 200) {
                setEventRequests(response.data);
            } else {
                console.error('Failed to fetch event location');
                setSnackbarMessage('Failed to fetch event location');
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error('Error fetching event location:', error);
            setSnackbarMessage('Error fetching event location');
            setSnackbarOpen(true);
        }
    };

    useEffect(() => {
        fetchEventRequest();
    }, [isFormModalOpen]);
    useEffect(() => {
        const fetchEventLocations = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/event-location/get-events-locations`);

                if (response.status === 200) {
                    setEventLocations(response.data);
                } else {
                    console.error('Failed to fetch event location');
                }
            } catch (error) {
                console.error('Error fetching event location:', error);
                setSnackbarMessage('Error fetching event location');
                setSnackbarOpen(true);
            }
        };

        fetchEventLocations();
    }, []);
    useEffect(() => {
        const fetchEventPublicationArea = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/event-publication-area/get-events-publicationAreas`);

                if (response.status === 200) {
                    setPublicationArea(response.data);
                } else {
                    console.error('Failed to fetch publication area');
                }
            } catch (error) {
                console.error('Error fetching publication area:', error);
                setSnackbarMessage('Error fetching publication area');
                setSnackbarOpen(true);
            }
        };

        fetchEventPublicationArea();
    }, []);
    useEffect(() => {
        const fetchEventTypes = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/event-type/get-events-types`);

                if (response.status === 200) {
                    setEventTypes(response.data);
                } else {
                    console.error('Failed to fetch event types');
                }
            } catch (error) {
                console.error('Error fetching event types:', error);
                setSnackbarMessage('Error fetching event types');
                setSnackbarOpen(true);
            }
        };

        fetchEventTypes();
    }, []);
    const handlePdfSelect = (file) => {
        setSelectedPdf(file);
        setPdfModalOpen(true);
    };

    const onSubmit = async (data) => {
        console.log("data", data);
        try {
            setIsLoading(true);
            const apiUrl = `${process.env.REACT_APP_API_HOST}/api/events/add-event`;

            const requestData = {
                eventName: data.EventName,
                eventLocation: data.locations.map(item => item.name),
                eventPublicationArea: data.publicationArea.map(item => item.name),
                eventType: data.eventTypes.map(item => item.name),
                eventDetails: data.eventDetails,
                eventDateAndTime: `${data.date}T${data.time}`,
                // imageUrl: data.uploadedFiles.map(file => file.name), // Uncomment if needed
            };

            const response = await axios.post(apiUrl, requestData);
            //setResponseMessage("Your event publish request has been sent successfully");
            console.log("=====", response.data);
            setFormModalOpen(false);
            setIsLoading(false);
            setUploadedFiles([]);
            reset();
        } catch (error) {
            console.error('Error submitting event:', error);
            setIsLoading(false);
        }
    };

    const handleEditClick = (event, eventId) => {
        setEditEventData(event);
        setEditEventId(eventId);
        openFormModal();
        if (editEventData) {
            setValue('EventName', event.eventName || "");
            setValue('EventDetails', event.eventDetails || "");
            setValue('EventDateAndTime', event.eventDateAndTime || "");
            setValue('locations', editEventData.eventLocation ? editEventData.eventLocation.flatMap(location => location.split(',')).map(location => ({ name: location })) : []);
            setValue('publicationArea', editEventData.eventPublicationArea ? editEventData.eventPublicationArea.flatMap(area => area.split(',')).map(area => ({ name: area })) : []);
            setValue('eventTypes', editEventData.eventType ? editEventData.eventType.flatMap(area => area.split(',')).map(area => ({ name: area })) : []);
        }
    };

    const handleUpdate = async () => {
        try {
            setIsLoading(true);
            const formData = getValues();
            const requestData = {
                eventId: editEventId,
                //userId: formData.userId, 
                eventName: formData.EventName,
                status: formData.status,
                eventLocation: formData.locations.map(item => item.name),
                eventPublicationArea: formData.publicationArea.map(item => item.name),
                eventType: formData.eventTypes.map(item => item.name),
                eventDetails: formData.eventDetails,
                eventDateAndTime: `${formData.date}T${formData.time}`,
                //imageUrl: formData.uploadedFiles.map(file => file.name), // If imageUrl is available
            };

            const apiUrl = `${process.env.REACT_APP_API_HOST}/api/events/update-event`;
            const response = await axios.put(apiUrl, requestData);

            // Handle response as needed
            console.log('Update response:', response.data);

            // Perform actions after successful update
            //setResponseMessage(response.data);
            setFormModalOpen(false);
            setIsLoading(false);
            setUploadedFiles([]);
            reset(); // Reset form if needed
            window.location.reload(); // Refresh the page
        } catch (error) {
            console.error('Error submitting event:', error);
            setIsLoading(false);
            // Handle error as needed
        }
    };

    const openSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleApprove = async (eventId, userId, EventName) => {
        try {
            const updatedLoadingRows = [...loadingRows, eventId];
            setLoadingRows(updatedLoadingRows);

            const url = `${process.env.REACT_APP_API_HOST}/api/events/approve-reject-enterprises-requests/${eventId}/approve`;
            const response = await axios.post(url);

            if (response.status === 200) {
                openSnackbar(`Enterprise ${EventName} approved successfully`, 'success');
                fetchEventRequest();
            } else {
                openSnackbar('Failed to approve enterprise request', 'error');
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            const updatedLoadingRows = loadingRows.filter((rowId) => rowId !== eventId);
            setLoadingRows(updatedLoadingRows);
        }
    };

    const handleReject = async (eventId, userId, EventName) => {
        try {
            const updatedLoadingRows = [...loadingRows, eventId];
            setLoadingRows(updatedLoadingRows);

            const url = `${process.env.REACT_APP_API_HOST}/api/events/approve-reject-enterprises-requests/${eventId}/reject`;
            const response = await axios.post(url);

            if (response.status === 200) {
                openSnackbar(`Enterprise ${EventName} rejected successfully`, 'success');
                fetchEventRequest();
            } else {
                openSnackbar('Failed to reject enterprise request', 'error');
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            const updatedLoadingRows = loadingRows.filter((rowId) => rowId !== eventId);
            setLoadingRows(updatedLoadingRows);
        }
    };

    const handlePending = async (eventId, userId, EventName) => {
        try {
            const updatedLoadingRows = [...loadingRows, eventId];
            setLoadingRows(updatedLoadingRows);

            const url = `${process.env.REACT_APP_API_HOST}/api/events/approve-reject-enterprises-requests/${eventId}/askformoreinformation`;
            const response = await axios.post(url);

            if (response.status === 200) {

                openSnackbar(`Enterprise ${EventName} rejected successfully`, 'success');
                fetchEventRequest();
            } else {
                openSnackbar('Failed to reject enterprise request', 'error');
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            const updatedLoadingRows = loadingRows.filter((rowId) => rowId !== eventId);
            setLoadingRows(updatedLoadingRows);
        }
    };

    const handleDeleteClick = (eventId, userId, EventName) => {
        console.log("eventId", eventId);
        setConfirmationText(`Are you sure you want to delete the request for ${EventName}?`);
        setConfirmDialogOpen(true);
        setEventIdToDelete(eventId);
        setUserIdToDelete(userId);
    };

    const handleConfirmDelete = async () => {
        try {
            const url = `${process.env.REACT_APP_API_HOST}/api/events/delete-event/${eventIdToDelete}`;
            const response = await axios.delete(url);

            if (response.status === 200) {
                fetchEventRequest();
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

    const onSelectLocations = (selectedList) => {
        setValue("locations", selectedList);
    };

    const onRemoveLocations = (selectedList) => {
        setValue("locations", selectedList);
    };

    const onSelectEventTypes = (selectedList) => {
        setValue("eventTypes", selectedList);
    };

    const onRemoveEventTypes = (selectedList) => {
        setValue("eventTypes", selectedList);
    };

    const onSelectPublicationArea = (selectedList) => {
        setValue("publicationArea", selectedList);
    };

    const onRemovePublicationArea = (selectedList) => {
        setValue("publicationArea", selectedList);
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        // Check if all selected files are of allowed types
        const invalidFiles = selectedFiles.filter(file => !["image/jpeg", "image/png"].includes(file.type));
        if (invalidFiles.length > 0) {
            alert("Please select only JPG or PNG files.");
            e.target.value = ''; // Clear the input field
            return;
        }

        // Set the value of 'uploadedFiles' using setValue
        setValue('uploadedFiles', selectedFiles);

        // Check if the total number of files exceeds 3
        if (selectedFiles.length + uploadedFiles.length > 3) {
            alert('You can upload up to 3 files.');
            e.target.value = ''; // Clear the input field
            return;
        }

        // Add the selected files to the 'uploadedFiles' state
        setUploadedFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

        // Clear the input field
        e.target.value = '';
    };

    const validateFile = (value) => {
        if (!value || value.length === 0 || !value[0]) {
            return "File is required";
        }

        const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
        if (!allowedTypes.includes(value[0].type)) {
            return "Please select a valid file (PDF, JPG, or PNG)";
        }

        return true;
    };

    const handleFileRemove = (fileName) => {
        const updatedFiles = uploadedFiles.filter((file) => file.name !== fileName);
        setUploadedFiles(updatedFiles);
    };

    const openFormModal = () => {
        setFormModalOpen(true);
    };

    const closeFormModal = () => {
        setFormModalOpen(false);
        reset();
    };
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
                    <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: "25px", }}>
                        <Typography variant="h6" sx={{ flex: '1' }}>
                            Event Submission Requests
                        </Typography>
                        <IconButton onClick={openFormModal} color="secondary" size="small" style={{ color: "#fff", padding: "5px" }}>
                            <AddIcon /> Add
                        </IconButton>
                    </Box>
                    {Array.isArray(eventRequests) && eventRequests.length > 0 ? (
                        <TableContainer component={Paper} style={styles.tableContainer} className='enterprise-request-table'>
                            <Table style={styles.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={styles.headerCell}>Name</TableCell>
                                        <TableCell style={styles.headerCell}>Location</TableCell>
                                        <TableCell style={styles.headerCell}>Date</TableCell>
                                        <TableCell style={styles.headerCell}>Time</TableCell>
                                        <TableCell style={styles.headerCell}>Event Detail</TableCell>
                                        <TableCell style={styles.headerCell}>Event Type</TableCell>
                                        <TableCell style={styles.headerCell}>Event Publication Area</TableCell>
                                        {/* This commented code is going to be used in next scope */}
                                        {/* <TableCell style={styles.headerCell}>Images</TableCell> */}
                                        <TableCell style={styles.headerCell}>Status</TableCell>
                                        <TableCell style={{ ...styles.headerCell, textAlign: "right", }}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Array.isArray(eventRequests) && eventRequests.map((event, index) => (
                                        <TableRow key={index}>
                                            <TableCell style={styles.cell}>{event.eventName}</TableCell>
                                            <TableCell style={styles.cell}>{event.eventLocation.join(', ')}</TableCell>
                                            <TableCell style={styles.cell}>{new Date(event.eventDateAndTime).toLocaleDateString()}</TableCell>
                                            <TableCell style={styles.cell}>{new Date(event.eventDateAndTime).toLocaleTimeString()}</TableCell>
                                            <TableCell style={styles.cell}>{event.eventDetails}</TableCell>
                                            <TableCell style={styles.cell}>{event.eventType.join(', ')}</TableCell>
                                            <TableCell style={styles.cell}>{event.eventPublicationArea.join(', ')}</TableCell>
                                            {/* This commented code is going to be used in next scope */}
                                            {/* <TableCell style={styles.cell}>
                                                {event.imageUrl.map((image, index) => (
                                                    <p key={index} onClick={() => handleImageClick(image)}>
                                                        {image.imageUrl}
                                                    </p>
                                                ))}
                                            </TableCell> */}
                                            <TableCell style={styles.cell}>{event.status}</TableCell>
                                            <TableCell style={{ ...styles.cell, textAlign: "right", }}>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        size="small"
                                                        style={styles.approveButton}
                                                        disabled={
                                                            loadingRows.includes(event.eventId) ||
                                                            event.status === 'Approved'
                                                        }
                                                        onClick={() => {
                                                            setIsApproving(true);
                                                            handleApprove(event.eventId, event.userId, event.eventName);
                                                        }}
                                                    >
                                                        {(isApproving && loadingRows.includes(event.eventId)) ? <CircularProgress size={24} /> : 'Approve'}
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        size="small"
                                                        style={styles.approveButton}
                                                        disabled={
                                                            loadingRows.includes(event.eventId) ||
                                                            event.status === 'Rejected'
                                                        }
                                                        onClick={async () => {
                                                            setIsRejecting(true);
                                                            await handleReject(event.eventId, event.userId, event.eventName);
                                                            setIsRejecting(false);
                                                        }}
                                                    >
                                                        {(isRejecting && loadingRows.includes(event.eventId)) ? <CircularProgress size={24} /> : 'Reject'}
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        size="small"
                                                        style={styles.approveButton}
                                                        disabled={
                                                            loadingRows.includes(event.eventId)
                                                        }
                                                        onClick={async () => {
                                                            setIsPending(true);
                                                            await handlePending(event.eventId, event.userId, event.eventName);
                                                            setIsPending(false);
                                                        }}
                                                    >
                                                        {(isPending && loadingRows.includes(event.eventId)) ? <CircularProgress size={24} /> : 'Ask for more info'}
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        size="small"
                                                        style={styles.approveButton}
                                                        onClick={() => handleEditClick(event, event.eventId)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        size="small"
                                                        style={styles.approveButton}
                                                        disabled={loadingRows.includes(event.eventId)}
                                                        onClick={() => handleDeleteClick(event.eventId, event.userId, event.eventName)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
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
            <Modal
                open={isFormModalOpen}
                onClose={closeFormModal}
                aria-labelledby="form-modal-title"
                aria-describedby="form-modal-description"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'auto',
                }}
            >
                <Paper elevation={3} className="event-form-modal" style={modalContentStyle}>
                    <div className='event-model-close-btn'>
                        <IconButton onClick={closeFormModal} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                    </div>

                    <form onSubmit={editEventData !== null ? handleSubmit(handleUpdate) : handleSubmit(onSubmit)}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="h6">Event Submission Form</Typography>
                            </Grid>
                            <Grid item lg={6} md={12} sm={12} xs={12}>
                                <InputLabel>Event Name</InputLabel>
                                <Controller
                                    control={control}
                                    name="EventName"
                                    rules={{
                                        required: "Event name is required.",
                                        minLength: {
                                            value: 3,
                                            message: "Event name should be at least 3 characters long.",
                                        },
                                        maxLength: {
                                            value: 50,
                                            message: "Event name should not exceed 30 characters.",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <div>
                                            <TextField
                                                {...field}
                                                type="outlined"
                                                placeholder="Event name"
                                                fullWidth
                                                defaultValue={editEventData?.eventName}
                                            />
                                            {errors['EventName'] && (
                                                <FormHelperText className='error-message'>{errors['EventName'].message}</FormHelperText>
                                            )}
                                        </div>
                                    )}
                                />
                            </Grid>
                            <Grid item lg={6} md={12} sm={12} xs={12}>
                                <InputLabel>Location</InputLabel>
                                <Controller
                                    control={control}
                                    name="locations"
                                    defaultValue={editEventData && editEventData.eventLocation ? editEventData.eventLocation.flatMap(location => location.split(',')).map(location => ({ name: location })) : []}
                                    render={({ field }) => (
                                        <Multiselect
                                            options={eventLocations.map(location => ({
                                                name: location.eventLocationName,
                                                id: location.id,
                                            }))}
                                            selectedValues={field.value}
                                            onSelect={(selectedList) => {
                                                onSelectLocations(selectedList);
                                                field.onChange(selectedList);
                                            }}
                                            onRemoveLocation={(selectedList) => {
                                                onRemoveLocations(selectedList);
                                                field.onChange(selectedList);
                                            }}
                                            displayValue="name"
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item lg={6} md={12} sm={12} xs={12}>
                                <InputLabel>Date</InputLabel>
                                <Controller
                                    control={control}
                                    name="date"
                                    defaultValue={editEventData ? new Date(editEventData.eventDateAndTime).toISOString().split('T')[0] : ''}
                                    rules={{
                                        required: 'Date is required',
                                    }}
                                    render={({ field }) => (
                                        <div>
                                            <TextField
                                                {...field}
                                                type="date"
                                                fullWidth
                                            />
                                            {errors['date'] && (
                                                <FormHelperText className='error-message'>{errors['date'].message}</FormHelperText>
                                            )}
                                        </div>
                                    )}
                                />
                            </Grid>
                            <Grid item lg={6} md={12} sm={12} xs={12}>
                                <InputLabel>Time</InputLabel>
                                <Controller
                                    control={control}
                                    name="time"
                                    defaultValue={editEventData ? new Date(editEventData.eventDateAndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : ''}
                                    rules={{
                                        required: 'Time is required',
                                    }}
                                    render={({ field }) => (
                                        <div>
                                            <TextField
                                                {...field}
                                                type="time"
                                                fullWidth
                                            />
                                            {errors['time'] && (
                                                <FormHelperText className='error-message'>{errors['time'].message}</FormHelperText>
                                            )}
                                        </div>
                                    )}
                                />
                            </Grid>
                            <Grid item lg={6} md={12} sm={12} xs={12}>
                                <InputLabel>Publication Area</InputLabel>
                                <Controller
                                    control={control}
                                    name="publicationArea"
                                    defaultValue={editEventData && editEventData.eventPublicationArea ? editEventData.eventPublicationArea.flatMap(area => area.split(',')).map(area => ({ name: area })) : []}
                                    render={({ field }) => (
                                        <Multiselect
                                            options={publicationArea.map(item => ({
                                                name: item.eventPublicationAreaName,
                                                id: item.id,
                                            }))}
                                            selectedValues={field.value}
                                            onSelect={(selectedList) => {
                                                onSelectPublicationArea(selectedList);
                                                field.onChange(selectedList);
                                            }}
                                            onRemove={(selectedList) => {
                                                onRemovePublicationArea(selectedList);
                                                field.onChange(selectedList);
                                            }}
                                            displayValue="name"
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item lg={6} md={12} sm={12} xs={12}>
                                <InputLabel>Event Type</InputLabel>
                                <Controller
                                    control={control}
                                    name="eventTypes"
                                    defaultValue={editEventData && editEventData.eventType ? editEventData.eventType.flatMap(type => type.split(',')).map(type => ({ name: type })) : []}
                                    render={({ field }) => (
                                        <Multiselect
                                            options={eventTypes.map(item => ({
                                                name: item.eventTypeName,
                                                id: item.id,
                                            }))}
                                            selectedValues={field.value}
                                            onSelect={(selectedList) => {
                                                onSelectEventTypes(selectedList);
                                                field.onChange(selectedList);
                                            }}
                                            onRemove={(selectedList) => {
                                                onRemoveEventTypes(selectedList);
                                                field.onChange(selectedList);
                                            }}
                                            displayValue="name"
                                        />
                                    )}
                                />
                            </Grid>
                            {/* This commented code is going to be used in next scope */}
                            {/* <Grid item lg={6} md={12} sm={12} xs={12}>
                                <InputLabel>Upload Files</InputLabel>
                                <Controller
                                    control={control}
                                    name="uploadedFiles"
                                    render={({ field }) => (
                                        <FormControl fullWidth>
                                            <input
                                                className='event-form-file'
                                                type="file"
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    handleFileChange(e);
                                                }}
                                                accept="image/*, .pdf"
                                                multiple
                                                name="uploadedFiles"
                                            />
                                            {uploadedFiles.map((file) => (
                                                <div className='pdf-img-style-box' key={file.name}>
                                                    <p>{file.name}</p>
                                                    <p>
                                                        <span onClick={() => handlePdfSelect(file)} className="icon-style"><VisibilityIcon /></span>
                                                        <span onClick={() => handleFileRemove(file.name)} className="icon-style2"><DeleteIcon /></span>
                                                    </p>
                                                </div>
                                            ))}
                                            {uploadedFiles.length > 3 && (
                                                <FormHelperText className='error-message'>
                                                    {`Can not upload more than 3 files: ${field.value.length}/3`}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    )}
                                    rules={{ validate: validateFile }}
                                />
                            </Grid> */}
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <InputLabel>Event Details</InputLabel>
                                <Controller
                                    control={control}
                                    name="eventDetails"
                                    defaultValue={editEventData ? editEventData.eventDetails : ''}
                                    rules={{
                                        required: 'Event Details are required',
                                    }}
                                    render={({ field }) => (
                                        <div>
                                            <TextField
                                                {...field}
                                                multiline
                                                rows={4}
                                                fullWidth
                                            />
                                            {errors['eventDetails'] && (
                                                <FormHelperText className='error-message'>{errors['eventDetails'].message}</FormHelperText>
                                            )}
                                        </div>
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
                                    {isLoading ? <CircularProgress size={24} style={{ color: "#0d416f" }} /> : "Submit"}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Modal>
            <Modal
                open={isPdfModalOpen}
                onClose={closePdfModal}
                aria-labelledby="pdf-modal-title"
                aria-describedby="pdf-modal-description"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div className="pdf-modal">
                    <IconButton
                        onClick={closePdfModal}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    {selectedPdf && (
                        <>
                            {selectedPdf.type.startsWith('image/') ? (
                                <img src={URL.createObjectURL(selectedPdf)} alt={selectedPdf.name} />
                            ) : (
                                <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}>
                                    <Viewer fileUrl={URL.createObjectURL(selectedPdf)} />
                                </Worker>
                            )}
                        </>
                    )}
                </div>
            </Modal>
            <ConfirmDialog
                open={confirmDialogOpen}
                handleClose={() => setConfirmDialogOpen(false)}
                handleConfirm={handleConfirmDelete}
                confirmationText={confirmationText}
            />
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </Box>
    )
}

export default AdminEventRequest;
