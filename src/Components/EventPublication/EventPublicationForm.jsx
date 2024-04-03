import { Box, Button, CircularProgress, FormControl, FormHelperText, Grid, IconButton, InputLabel, Modal, Paper, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Multiselect from 'multiselect-react-dropdown';
import "./EventPublicationForm.scss"
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { pdfjs } from 'react-pdf';
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from 'axios';

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

const EventPublicationForm = ({ answer }) => {
    const [eventLocations, setEventLocations] = useState([]);
    const [publicationArea, setPublicationArea] = useState([]);
    const [eventTypes, setEventTypes] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [isPdfModalOpen, setPdfModalOpen] = useState(false);
    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
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
    const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);

            // Call the add-event API
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

            // Reset form and state
            setResponseMessage("Your event publish request has been sent successfully");
            setFormModalOpen(false);
            setIsLoading(false);
            setUploadedFiles([]);
            reset();
        } catch (error) {
            console.error('Error submitting event:', error);
            setIsLoading(false);
        }
        setFormModalOpen(false);
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
        const newFiles = [...uploadedFiles, ...selectedFiles];  // Concatenate new files with existing ones
        setValue('uploadedFiles', newFiles);

        if (newFiles.length > 3) {  // Check the total number of files
            alert('You can upload up to 3 files.');
            e.target.value = '';
            return;
        }
        setUploadedFiles(newFiles);  // Update the state with the concatenated array
        e.target.value = '';
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
        <>
            <Paper elevation={3} sx={{p:3}}>
                <Typography variant="h6">Event Submission</Typography>
                <Typography variant="body2" color="textSecondary">
                    {answer?.message}
                </Typography>
                <Typography className='Custom-Button' onClick={openFormModal} style={{ marginTop: '20px' }}>
                    Open Form
                </Typography>
                {responseMessage && <Typography sx={{ mt: 2 }}>{responseMessage}</Typography>}
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
                            <CloseIcon className='color-white' />
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
                                    name="publicationArea"
                                    defaultValue={[]}
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
                                    defaultValue={[]}
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
                                />
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
        </ >

    );
};

export default EventPublicationForm;
