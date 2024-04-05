import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, TextField, Modal, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, InputLabel, Snackbar, CircularProgress, useMediaQuery, Grid, FormHelperText, Pagination } from '@mui/material';
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
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';

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
    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [loadingRows, setLoadingRows] = useState([]);
    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [eventIdToDelete, setEventIdToDelete] = useState(null);
    const [editEventData, setEditEventData] = useState(null);
    const [editEventId, setEditEventId] = useState(null);
    const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
    const [isPublicationAreaDropdownOpen, setIsPublicationAreaDropdownOpen] = useState(false);
    const [isEventTypeDropdownOpen, setIsEventTypeDropdownOpen] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [pageNumber, setPageNumber] = useState(1);
    console.log("eventRequests", eventRequests);
    const handlePageChange = (event, newPage) => {
        setPageNumber(newPage);
        fetchEventRequest(newPage);
    };

    const handleLocationDropdownToggle = () => {
        setIsLocationDropdownOpen(!isLocationDropdownOpen);
        setIsPublicationAreaDropdownOpen(false);
        setIsEventTypeDropdownOpen(false);
    };

    const handlePublicationAreaDropdownToggle = () => {
        setIsPublicationAreaDropdownOpen(!isPublicationAreaDropdownOpen);
        setIsLocationDropdownOpen(false);
        setIsEventTypeDropdownOpen(false);
    };

    const handleEventTypeDropdownToggle = () => {
        setIsEventTypeDropdownOpen(!isEventTypeDropdownOpen);
        setIsLocationDropdownOpen(false);
        setIsPublicationAreaDropdownOpen(false);
    };

    useEffect(() => {
        if (editEventData) {
            setValue('EventName', editEventData?.eventName || "");  // Set default value for EventName
            setValue('EventLocationAddress', editEventData?.eventAddress || "");  // Set default value for EventLocationAddress
        }
    }, [editEventData, setValue]);

    const fetchEventRequest = async (pageNumber) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/events/get-allevents?pageNumber=${pageNumber}`);
    
            if (response.status === 200) {
                setEventRequests(response.data);
                setTotalPages(Math.ceil(response.data.totalCount / 10));
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
        fetchEventRequest(pageNumber);
    }, [isFormModalOpen, pageNumber]);
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
        try {
            setIsLoading(true);
            const addEventUrl = `${process.env.REACT_APP_API_HOST}/api/events/add-event`;
            const addEventData = {
                eventName: data.EventName,
                eventAddress: data.EventLocationAddress,
                eventLocation: data.locations.map(item => item.name),
                eventPublicationArea: data.publicationArea.map(item => item.name),
                eventType: data.eventTypes.map(item => item.name),
                eventDetails: data.eventDetails,
                eventDateAndTime: `${data.date}T${data.time}`,
            };
            const addEventResponse = await axios.post(addEventUrl, addEventData);
            const eventId = addEventResponse.data;
            if (!uploadedFiles || uploadedFiles.length === 0) {
                window.location.reload();
            }
            const formData = new FormData();
            if (Array.isArray(data.uploadedFiles)) {
                data.uploadedFiles.forEach(file => {
                    formData.append('imageFiles', file);
                });
            } else {
                console.error('Error: uploadedFiles is not an array');
                setIsLoading(false);
                return;
            }

            const imageUploadUrl = `${process.env.REACT_APP_API_HOST}/api/events/event-image-upload?eventId=${eventId}`;
            const imageUploadResponse = await axios.post(imageUploadUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("imageUploadResponse", imageUploadResponse);
            console.log("Event added successfully:", addEventResponse.data);
            console.log("Image uploaded successfully:", imageUploadResponse.data);
            setIsLoading(false);
            setUploadedFiles([]);
            setEventLocations([]);
            setEventTypes([])
            setPublicationArea([])
            reset();
            setFormModalOpen(false);
            setSnackbarMessage('Your event publish request has been sent successfully');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error submitting event:', error);
            setSnackbarMessage('Error submitting event:', error);
            setSnackbarOpen(true);
            setIsLoading(false);
        }
    };

    const handleEditClick = (event, eventId) => {
        setEditEventData(event);
        setEditEventId(eventId);
        openFormModal();
        if (editEventData) {
            setValue('EventName', event.eventName || "");
            setValue('EventLocationAddress', event.eventAddress || "");
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
                eventName: formData.EventName,
                eventAddress: formData.EventLocationAddress,
                status: formData.status,
                eventLocation: formData.locations.map(item => item.name),
                eventPublicationArea: formData.publicationArea.map(item => item.name),
                eventType: formData.eventTypes.map(item => item.name),
                eventDetails: formData.eventDetails,
                eventDateAndTime: `${formData.date}T${formData.time}`,
            };

            const apiUrl = `${process.env.REACT_APP_API_HOST}/api/events/update-event`;
            const response = await axios.put(apiUrl, requestData);
            console.log('Update response:', response.data);
            if (Array.isArray(formData.uploadedFiles) && formData.uploadedFiles.length > 0) {
                const formDataImages = new FormData();
                formData.uploadedFiles.forEach(file => {
                    formDataImages.append('imageFiles', file);
                });
                const imageUploadUrl = `${process.env.REACT_APP_API_HOST}/api/events/event-image-upload?eventId=${editEventId}`;
                await axios.post(imageUploadUrl, formDataImages, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log("Image(s) uploaded successfully.");
            }

            setFormModalOpen(false);
            setIsLoading(false);
            setUploadedFiles([]);
            reset();
            window.location.reload();
            setSnackbarMessage("Event has been updated successfully");
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error updating event:', error);
            setIsLoading(false);
        }
    };

    const handleApprove = async (eventId, userId, EventName) => {
        try {
            const updatedLoadingRows = [...loadingRows, eventId];
            setLoadingRows(updatedLoadingRows);
            const approveUrl = `${process.env.REACT_APP_API_HOST}/api/events/approve-reject-events-requests/${eventId}/approve`;
            const approveResponse = await axios.post(approveUrl);
            if (approveResponse.status === 200) {
                const emailUrl = `${process.env.REACT_APP_API_HOST}/api/events/send-email-to-eventSubscribers?eventId=${eventId}`;
                await axios.post(emailUrl);
                setSnackbarMessage(`Event ${EventName} approved successfully`, 'success');
                setSnackbarOpen(true);
                fetchEventRequest();
            } else {
                setSnackbarMessage('Failed to approve event request', 'error');
                setSnackbarOpen(true);
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

            const url = `${process.env.REACT_APP_API_HOST}/api/events/approve-reject-events-requests/${eventId}/reject`;
            const response = await axios.post(url);

            if (response.status === 200) {
                setSnackbarMessage(`Event ${EventName} rejected successfully`, 'success');
                setSnackbarOpen(true);
                fetchEventRequest();
            } else {
                setSnackbarMessage('Failed to reject event request', 'error');;
                setSnackbarOpen(true);

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

            const url = `${process.env.REACT_APP_API_HOST}/api/events/approve-reject-events-requests/${eventId}/askformoreinformation`;
            const response = await axios.post(url);

            if (response.status === 200) {

                setSnackbarMessage(`The request for more information has been sent successfully`);
                setSnackbarOpen(true);
                fetchEventRequest();
            } else {
                setSnackbarMessage('Failed to reject Event request', 'error');
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            const updatedLoadingRows = loadingRows.filter((rowId) => rowId !== eventId);
            setLoadingRows(updatedLoadingRows);
        }
    };

    const handleDeleteClick = (eventId) => {
        setConfirmationText(`Are you sure you want to delete this event`);
        setConfirmDialogOpen(true);
        setEventIdToDelete(eventId);
    };

    const handleConfirmDelete = async () => {
        try {
            const url = `${process.env.REACT_APP_API_HOST}/api/events/delete-event/${eventIdToDelete}`;
            const response = await axios.delete(url);

            if (response.status === 200) {
                fetchEventRequest();
                setSnackbarMessage(`Request deleted successfully`, 'success');
                setSnackbarOpen(true);
            } else {
                setSnackbarMessage('Failed to delete the request', 'error');
                setSnackbarMessage(`Request deleted successfully`, 'success');
                setSnackbarOpen(true);
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
        const invalidFiles = selectedFiles.filter(file => !["image/jpeg", "image/png"].includes(file.type));
        if (invalidFiles.length > 0) {
            alert("Please select only JPG or PNG files.");
            e.target.value = '';
            return;
        }
        const newFiles = [...uploadedFiles, ...selectedFiles];
        setValue('uploadedFiles', newFiles);

        const totalFilesCount = editEventData ? editEventData.imageUrl.length + uploadedFiles.length : uploadedFiles.length;
        if (totalFilesCount + selectedFiles.length > 3) {
            alert('You can upload up to 3 files.');
            e.target.value = '';
            return;
        }
        setUploadedFiles(newFiles);
        e.target.value = '';
    };

    const handleFileRemove = (fileName) => {
        const updatedFiles = uploadedFiles.filter((file) => file.name !== fileName);
        setUploadedFiles(updatedFiles);
    };

    const handleDeleteImage = async (imageId) => {
        try {
            const deleteImageUrl = `${process.env.REACT_APP_API_HOST}/api/events/delete-event-image/${imageId}`;
            const response = await axios.delete(deleteImageUrl);
            console.log('Image deleted successfully:', response.data);
            setSnackbarMessage("Image deleted successfully");
            setSnackbarOpen(true);
            const updatedImages = editEventData.imageUrl.filter(image => image.imageId !== imageId);
            const updatedEditEventData = {
                ...editEventData,
                imageUrl: updatedImages,
            };

            setEditEventData(updatedEditEventData);
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    const openFormModal = () => {
        setFormModalOpen(true);
    };

    const closeFormModal = () => {
        setFormModalOpen(false);
        reset();
        setIsLocationDropdownOpen(false);
        setIsPublicationAreaDropdownOpen(false);
        setIsEventTypeDropdownOpen(false);
    };

    const closePdfModal = () => {
        setPdfModalOpen(false);
        setSelectedPdf(null);
    };

    const handleImageClick = (imageUrl) => {
        setSelectedImage({ url: imageUrl.imageUrl });
        setIsImageModalOpen(true);
    };

    const getImageFilename = (imageUrl) => {
        const parts = imageUrl.split('/');
        return parts.pop();
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
                    {Array.isArray(eventRequests.events) && eventRequests.events.length > 0 ? (
                        <TableContainer component={Paper} style={styles.tableContainer} className='enterprise-request-table'>
                            <Table style={styles.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={styles.headerCell}>Name</TableCell>
                                        <TableCell style={styles.headerCell}>Location</TableCell>
                                        <TableCell style={styles.headerCell}>Address</TableCell>
                                        <TableCell style={styles.headerCell}>Date</TableCell>
                                        <TableCell style={styles.headerCell}>Time</TableCell>
                                        <TableCell style={styles.headerCell}>Event Detail</TableCell>
                                        <TableCell style={styles.headerCell}>Event Type</TableCell>
                                        <TableCell style={styles.headerCell}>Event Publication Area</TableCell>
                                        <TableCell style={styles.headerCell}>Images</TableCell>
                                        <TableCell style={styles.headerCell}>Status</TableCell>
                                        <TableCell style={{ ...styles.headerCell, textAlign: "right", }}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {[
                                        ...eventRequests.events.filter(event => event.status === 'Pending'),
                                        ...eventRequests.events.filter(event => event.status !== 'Pending')
                                    ].map((event, index) => (
                                        <TableRow key={index}>
                                            <TableCell style={styles.cell}>{event.eventName}</TableCell>
                                            <TableCell style={styles.cell}>{event.eventLocation.join(', ')}</TableCell>
                                            <TableCell style={styles.cell}>{event.eventAddress}</TableCell>
                                            <TableCell style={styles.cell}>{new Date(event.eventDateAndTime).toLocaleDateString()}</TableCell>
                                            <TableCell style={styles.cell}>{new Date(event.eventDateAndTime).toLocaleTimeString()}</TableCell>
                                            <TableCell style={styles.cell}>{event.eventDetails}</TableCell>
                                            <TableCell style={styles.cell}>{event.eventType.join(', ')}</TableCell>
                                            <TableCell style={styles.cell}>{event.eventPublicationArea.join(', ')}</TableCell>
                                            <TableCell style={styles.cell}>
                                                {event.imageUrl && event.imageUrl.length > 0 ? (
                                                    event.imageUrl.map((image, index) => (
                                                        <p style={{ cursor: "pointer", textDecoration: 'underline' }} key={index} onClick={() => handleImageClick(image)}>
                                                            {getImageFilename(image.imageUrl)}
                                                        </p>
                                                    ))
                                                ) : (
                                                    <p>N/A</p>
                                                )}
                                            </TableCell>
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
                                                        onClick={() => handleDeleteClick(event.eventId)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
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
                        </TableContainer>) : (
                        <Typography variant="body1" className='no-data-found'>
                            No event submission request available.
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
                    {selectedImage && selectedImage.url && (
                        <img
                            src={selectedImage.url}
                            alt={selectedImage.name || 'Image'}
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', }}
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
                                                //defaultValue={editEventData?.eventName}
                                                value={field.value} // Use value prop
                                                onChange={field.onChange} // Use onChange prop
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
                                    rules={{ required: 'Location is required.' }}
                                    render={({ field }) => (
                                        <>
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
                                                showArrow
                                                customArrow={!isLocationDropdownOpen ? <ArrowDropDownCircleIcon style={{ cursor: 'pointer' }} onClick={handleLocationDropdownToggle} /> : <CancelIcon style={{ cursor: 'pointer' }} onClick={handleLocationDropdownToggle} />}
                                                closeOnSelect
                                                showCheckbox
                                                keepListOpen={isLocationDropdownOpen}
                                                className={!isLocationDropdownOpen ? "displayNoneShow" : "displayBlockShow"}
                                            />
                                            {errors.locations && <span className='error-message'>{errors.locations.message}</span>}
                                        </>
                                    )}
                                />
                            </Grid>
                            <Grid item lg={6} md={12} sm={12} xs={12}>
                                <InputLabel>Event Location Address</InputLabel>
                                <Controller
                                    control={control}
                                    name="EventLocationAddress"
                                    rules={{
                                        required: "Event location address is required.",
                                    }}
                                    render={({ field }) => (
                                        <div>
                                            <TextField
                                                {...field}
                                                variant="outlined"
                                                placeholder="Event location address"
                                                fullWidth
                                                //defaultValue={editEventData?.eventAddress}
                                                value={field.value} // Use value prop
                                                onChange={field.onChange} // Use onChange prop
                                            />
                                            {errors['EventLocationAddress'] && (
                                                <FormHelperText className='error-message'>{errors['EventLocationAddress'].message}</FormHelperText>
                                            )}
                                        </div>
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
                                    rules={{ required: 'Publication area is required.' }}
                                    render={({ field }) => (
                                        <>
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
                                                showArrow
                                                customArrow={!isPublicationAreaDropdownOpen ? <ArrowDropDownCircleIcon style={{ cursor: 'pointer' }} onClick={handlePublicationAreaDropdownToggle} /> : <CancelIcon style={{ cursor: 'pointer' }} onClick={handlePublicationAreaDropdownToggle} />}
                                                closeOnSelect
                                                showCheckbox
                                                keepListOpen={isPublicationAreaDropdownOpen}
                                                className={!isPublicationAreaDropdownOpen ? "displayNoneShow" : "displayBlockShow"}
                                            />
                                            {errors.publicationArea && <span className='error-message'>{errors.publicationArea.message}</span>}
                                        </>
                                    )}
                                />
                            </Grid>
                            <Grid item lg={6} md={12} sm={12} xs={12}>
                                <InputLabel>Event Type</InputLabel>
                                <Controller
                                    control={control}
                                    name="eventTypes"
                                    defaultValue={editEventData && editEventData.eventType ? editEventData.eventType.flatMap(type => type.split(',')).map(type => ({ name: type })) : []}
                                    rules={{ required: 'Event type is required.' }}
                                    render={({ field }) => (
                                        <>
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
                                                showArrow
                                                customArrow={!isEventTypeDropdownOpen ? <ArrowDropDownCircleIcon style={{ cursor: 'pointer' }} onClick={handleEventTypeDropdownToggle} /> : <CancelIcon style={{ cursor: 'pointer' }} onClick={handleEventTypeDropdownToggle} />}
                                                closeOnSelect
                                                showCheckbox
                                                keepListOpen={isEventTypeDropdownOpen}
                                                className={!isEventTypeDropdownOpen ? "displayNoneShow" : "displayBlockShow"}
                                            />
                                            {errors.eventTypes && <span className='error-message'>{errors.eventTypes.message}</span>}
                                        </>
                                    )}
                                />
                            </Grid>
                            <Grid item lg={6} md={12} sm={12} xs={12}>
                                <InputLabel>Upload Files</InputLabel>
                                <Controller
                                    control={control}
                                    name="uploadedFiles"
                                    render={({ field }) => (
                                        <FormControl fullWidth>
                                            <input
                                                className='event-form-file'
                                                type="file"
                                                onChange={handleFileChange}
                                                accept="image/*, .pdf"
                                                multiple
                                                name="uploadedFiles"
                                            />
                                            <>
                                                {editEventData && editEventData.imageUrl && editEventData.imageUrl.map((file) => (
                                                    <div className='pdf-img-style-box' key={file.imageId}>
                                                        <p>{getImageFilename(file.imageUrl)}</p>
                                                        <p>
                                                            <span onClick={() => handleImageClick(file)} className="icon-style"><VisibilityIcon /></span>
                                                            <span onClick={() => handleDeleteImage(file.imageId)} className="icon-style2"><DeleteIcon /></span>
                                                        </p>
                                                    </div>
                                                ))}
                                                {uploadedFiles.map((file) => (
                                                    <div className='pdf-img-style-box' key={file.name}>
                                                        <p>{file.name}</p>
                                                        <p>
                                                            <span onClick={() => handlePdfSelect(file)} className="icon-style"><VisibilityIcon /></span>
                                                            <span onClick={() => handleFileRemove(file.name)} className="icon-style2"><DeleteIcon /></span>
                                                        </p>
                                                    </div>
                                                ))}
                                            </>

                                            {uploadedFiles.length > 3 && (
                                                <FormHelperText className='error-message'>
                                                    {`Can not upload more than 3 files: ${field.value.length}/3`}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    )}
                                />
                            </Grid>
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
                                <img src={URL.createObjectURL(selectedPdf)} alt={selectedPdf.name} style={{ width: '100%', height: '100%', objectFit: 'contain', }} />
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
