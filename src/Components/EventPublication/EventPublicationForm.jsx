import { Autocomplete, Box, Button, FormControl, FormHelperText, Grid, IconButton, InputLabel, MenuItem, Modal, Paper, Select, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Multiselect from 'multiselect-react-dropdown';
import "./EventPublicationForm.scss"
import { Input } from '@mui/base';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { pdfjs } from 'react-pdf';
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import axios, { Axios } from 'axios';

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

const EventPublicationForm = () => {
    const [eventLocations, setEventLocations] = useState([]);
    const [publicationArea, setPublicationArea] = useState([]);
    const [eventTypes, setEventTypes] = useState([]);
    console.log("eventLocations", eventLocations);
    console.log("publicationArea", publicationArea);
    console.log("eventTypes", eventTypes);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [selectedValues, setSelectedValues] = useState([]);
    console.log("selectedValues", selectedValues);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [isPdfModalOpen, setPdfModalOpen] = useState(false);
    const [isFormModalOpen, setFormModalOpen] = useState(false);
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
    const closePdfModal = () => {
        setSelectedPdf(null);
        setPdfModalOpen(false);
    };
    const { control, handleSubmit, setValue, register, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        console.log("data", data);
        try {
            const requestData = {
                EventName: data.EventName,
                EventLocation: data.locations,
                EventPublicationArea: data.publicationArea,
                EventType: data.eventTypes,
                EventDetails: data.eventDetails,
                EventDateAndTime: `${data.date}T${data.time}`,
                ImageUrl: data.uploadedFiles.map(file => file.name), 
            };

            // Make the API POST request
            const response = await Axios.post('/api/events/add-event', requestData);

            // Handle the response as needed
            console.log(response.data);
        } catch (error) {
            // Handle errors
            console.error('Error submitting event:', error);
        }
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

    return (
        <Box className="demo-enterprise-wrapper">
            <Paper elevation={3}>
                <Typography variant="h6">Event Submission</Typography>
                <Typography variant="body2" color="textSecondary">
                    Please click the "Open Form" button to submit your event details.
                </Typography>
                <Button variant="contained" color="primary" onClick={openFormModal} style={{ marginTop: '20px' }}>
                    Open Form
                </Button>
            </Paper>
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
                        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}>
                            <Viewer fileUrl={URL.createObjectURL(selectedPdf)} />
                        </Worker>
                    )}
                </div>
            </Modal>
        </Box >

    );
};

export default EventPublicationForm;
