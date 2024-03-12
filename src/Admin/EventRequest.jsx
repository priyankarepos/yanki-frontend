import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, TextField, Modal, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, InputLabel, Snackbar, CircularProgress, useMediaQuery, Grid, FormHelperText } from '@mui/material';
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
    const { control, handleSubmit, setValue, register, formState: { errors } } = useForm();
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
    const [eventLocations, setEventLocations] = useState([]);
    const [publicationArea, setPublicationArea] = useState([]);
    const [eventTypes, setEventTypes] = useState([]);
    const [selectedValues, setSelectedValues] = useState([]);
    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    useEffect(() => {
        const fetchEventLocations = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/event-location/get-events-locations`);

                if (response.status === 200) {
                    setEventLocations(response.data);
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

    const onSubmit = (data) => {
        console.log(data);
    };

    const onSelect = (selectedList) => {
        console.log("==========", selectedList?.name);
        setSelectedValues(selectedList?.name);
    };

    const onRemove = (selectedList) => {
        setSelectedValues(selectedList?.name);
    };

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);

        // Ensure only up to 3 files are selected
        if (selectedFiles.length + uploadedFiles.length > 3) {
            alert('You can upload up to 3 files.');
            // Clear the input field value
            event.target.value = '';
            return;
        }

        // Update state with the new files
        setUploadedFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
        // Clear the input field value
        event.target.value = '';
    };

    const handleFileRemove = (fileName) => {
        // Filter out the file with the given name
        const updatedFiles = uploadedFiles.filter((file) => file.name !== fileName);
        setUploadedFiles(updatedFiles);
    };

    const openFormModal = () => {
        setFormModalOpen(true);
    };

    const closeFormModal = () => {
        setFormModalOpen(false);
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
                        <IconButton onClick={openFormModal} color="secondary" size="small" style={{ color: "#fff", padding: "5px" }}>
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
                                                </Button> 
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    size="small"
                                                    style={styles.approveButton}
                                                    onClick={openFormModal}
                                                >
                                                    Edit
                                                </Button>  
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    size="small"
                                                    style={styles.approveButton}
                                                >
                                                    Delete
                                                </Button>                                                 </div>
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

                    <form onSubmit={handleSubmit(onSubmit)}>
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
                                    defaultValue={[]}
                                    render={({ field }) => (
                                        <Multiselect
                                            options={eventLocations.map(location => ({
                                                name: location.eventLocationName,
                                                id: location.id,
                                            }))}
                                            selectedValues={selectedValues}
                                            onSelect={onSelect}
                                            onRemove={onRemove}
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
                                    name="locations"
                                    defaultValue={[]}
                                    render={({ field }) => (
                                        <Multiselect
                                            options={publicationArea.map(location => ({
                                                name: location.eventPublicationAreaName,
                                                id: location.id,
                                            }))}
                                            selectedValues={selectedValues}
                                            onSelect={onSelect}
                                            onRemove={onRemove}
                                            displayValue="name"
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item lg={6} md={12} sm={12} xs={12}>
                                <InputLabel>Event Type</InputLabel>
                                <Controller
                                    control={control}
                                    name="locations"
                                    defaultValue={[]}
                                    render={({ field }) => (
                                        <Multiselect
                                            options={eventTypes.map(location => ({
                                                name: location.eventTypeName,
                                                id: location.id,
                                            }))}
                                            selectedValues={selectedValues}
                                            onSelect={onSelect}
                                            onRemove={onRemove}
                                            displayValue="name"
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item lg={6} md={12} sm={12} xs={12}>
                                <InputLabel>Upload Files</InputLabel>
                                <FormControl fullWidth>
                                    <input
                                        className='event-form-file'
                                        type="file"
                                        onChange={handleFileChange}
                                        accept="image/*, .pdf"
                                        multiple
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
                                    {uploadedFiles.length > 0 && (
                                        <FormHelperText className='error-message'>
                                            {`Can not upload more than 3 files: ${uploadedFiles.length}/3`}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <InputLabel>Event Details</InputLabel>
                                <Controller
                                    control={control}
                                    name="eventDetails"
                                    rules={{
                                        required: 'Event Details are required',
                                    }}
                                    render={({ field }) => (
                                        <div className='event-detail-input'>
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
                                <Button type="submit" variant="contained" color="primary">
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Modal>
        </Box>
    )
}

export default AdminEventRequest;
