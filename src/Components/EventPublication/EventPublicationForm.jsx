import { Button, CircularProgress, FormControl, FormHelperText, Grid, IconButton, InputLabel, Modal, Paper, TextField, Typography, Snackbar } from '@mui/material';
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
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import { useTranslation } from 'react-i18next';
import { apiUrls, messages } from '../../Utils/stringConstant/stringConstant';

const EventPublicationForm = ({ answer, clickableOff }) => {
    const { t } = useTranslation();
    const [eventLocations, setEventLocations] = useState([]);
    const [publicationArea, setPublicationArea] = useState([]);
    const [eventTypes, setEventTypes] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [isPdfModalOpen, setPdfModalOpen] = useState(false);
    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
    const [isPublicationAreaDropdownOpen, setIsPublicationAreaDropdownOpen] = useState(false);
    const [isEventTypeDropdownOpen, setIsEventTypeDropdownOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

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
        const fetchEventLocations = async () => {
            try {
                const response = await axios.get(apiUrls.getEventsLocations);
                setEventLocations(response.data);
            } catch (error) {
                setSnackbarMessage(`${t('errorFetchingLocations')}`, error);
                setSnackbarOpen(true);
            }
        };

        fetchEventLocations();
    }, []);
    useEffect(() => {
        const fetchEventPublicationArea = async () => {
            try {
                const response = await axios.get(apiUrls.getEventsPublicationAreas);
                setPublicationArea(response.data);
            } catch (error) {
                setSnackbarMessage(`${t('errorFetchingPublicationArea')}`, error);
                setSnackbarOpen(true);
            }
        };

        fetchEventPublicationArea();
    }, []);
    useEffect(() => {
        const fetchEventTypes = async () => {
            try {
                const response = await axios.get(apiUrls.getEventsTypes);
                setEventTypes(response.data);
            } catch (error) {
                setSnackbarMessage(`${t('errorFetchingEventTypes')}`, error);
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
    const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            const addEventData = {
                eventName: data.EventName,
                eventAddress: data.EventLocationAddress,
                eventLocation: data.locations.map(item => item.name),
                eventPublicationArea: data.publicationArea.map(item => item.name),
                eventType: data.eventTypes.map(item => item.name),
                eventDetails: data.eventDetails,
                eventDateAndTime: `${data.date}T${data.time}`,
            };
            const addEventResponse = await axios.post(apiUrls.addEventUrl, addEventData);

            // Upload files if any
            if (data.uploadedFiles && data.uploadedFiles.length > 0) {
                const formData = new FormData();
                data.uploadedFiles.forEach(file => {
                    formData.append('imageFiles', file);
                });
                const eventId = addEventResponse.data;
                const imageUploadResponse = await axios.post(apiUrls.imageUploadUrl(eventId), formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setSnackbarMessage(`${t('imageUploadedSuccessfully')}`, imageUploadResponse.data);
                setSnackbarOpen(true);
            }

            // Reset form and state
            setResponseMessage(`${t('eventPublishRequestSent')}`);
            setFormModalOpen(false);
            setIsLoading(false);
            setUploadedFiles([]);
            reset();
        } catch (error) {
            setSnackbarMessage(`${t('errorSubmittingEvent')}`, error);
            setSnackbarOpen(true);
            setIsLoading(false);
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
            alert(`${t('selectOnlyJPGorPNG')}`);
            e.target.value = '';
            return;
        }
        const newFiles = [...uploadedFiles, ...selectedFiles];  // Concatenate new files with existing ones
        setValue('uploadedFiles', newFiles);

        if (newFiles.length > 3) {  // Check the total number of files
            alert(`${t('uploadUpTo3Files')}`);
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
        setIsLocationDropdownOpen(false);
        setIsPublicationAreaDropdownOpen(false);
        setIsEventTypeDropdownOpen(false);
    };

    return (
        <>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6">Event Submission</Typography>
                <Typography variant="body2" color="textSecondary">
                    {answer?.message}
                </Typography>
                <Button className='Custom-Button' onClick={openFormModal} disabled={clickableOff}>
                    {t('openForm')}
                </Button>
                {responseMessage && <Typography sx={{ mt: 2 }}>{responseMessage}</Typography>}
            </Paper>
            <Modal
                open={isFormModalOpen}
                onClose={closeFormModal}
                aria-labelledby="form-modal-title"
                aria-describedby="form-modal-description"
                className='event-submission-form-modal'
            >
                <Paper elevation={3} className="event-form-modal modalContentStyle">
                    <div className='event-model-close-btn'>
                        <IconButton onClick={closeFormModal} aria-label="close">
                            <CloseIcon className='color-white' />
                        </IconButton>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{pt:2}}>{t('eventSubmissionForm')}</Typography>
                            </Grid>
                            <Grid item lg={6} md={12} sm={12} xs={12}>
                                <InputLabel>{t('openForm')}</InputLabel>
                                <Controller
                                    control={control}
                                    name="EventName"
                                    rules={{
                                        required: `${t('eventNameRequired')}`,
                                        minLength: {
                                            value: 3,
                                            message: `${t('eventNameMinLength')}`,
                                        },
                                        maxLength: {
                                            value: 50,
                                            message: `${t('eventNameMaxLength')}`,
                                        },
                                    }}
                                    render={({ field }) => (
                                        <div>
                                            <TextField
                                                {...field}
                                                type="outlined"
                                                placeholder={t('eventName')}
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
                                <InputLabel>{t('location')}</InputLabel>
                                <Controller
                                    control={control}
                                    name="locations"
                                    defaultValue={[]}
                                    rules={{ required: `${t('locationRequired')}` }}
                                    render={({ field }) => (
                                        <div>
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
                                                customArrow={!isLocationDropdownOpen ? <ArrowDropDownCircleIcon className='event-submission-multiselect-icon' onClick={handleLocationDropdownToggle} /> : <CancelIcon className='event-submission-multiselect-icon' onClick={handleLocationDropdownToggle} />}
                                                closeOnSelect
                                                showCheckbox
                                                keepListOpen={isLocationDropdownOpen}
                                                className={!isLocationDropdownOpen ? "displayNoneShow" : "displayBlockShow"}
                                            />
                                            {errors.locations && <span className='error-message'>{errors.locations.message}</span>}
                                        </div>
                                    )}
                                />
                            </Grid>
                            <Grid item lg={6} md={12} sm={12} xs={12}>
                                <InputLabel>{t('eventLocationAddress')}</InputLabel>
                                <Controller
                                    control={control}
                                    name="EventLocationAddress"
                                    rules={{
                                        required: `${t('eventLocationAddressRequired')}`,
                                    }}
                                    render={({ field }) => (
                                        <div>
                                            <TextField
                                                {...field}
                                                variant="outlined"
                                                placeholder={t('eventLocationAddressLabel')}
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
                                <InputLabel>{t('dateLabel')}</InputLabel>
                                <Controller
                                    control={control}
                                    name="date"
                                    rules={{
                                        required: `${t('dateRequired')}`,
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
                                <InputLabel>{t('time')}</InputLabel>
                                <Controller
                                    control={control}
                                    name="time"
                                    rules={{
                                        required: `${t('timeRequired')}`,
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
                                <InputLabel>{t('publicationArea')}</InputLabel>
                                <Controller
                                    control={control}
                                    name="publicationArea"
                                    defaultValue={[]}
                                    rules={{ required: `${t('publicationAreaRequired')}` }}
                                    render={({ field }) => (
                                        <div>
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
                                                customArrow={!isPublicationAreaDropdownOpen ? <ArrowDropDownCircleIcon className='event-submission-multiselect-icon' onClick={handlePublicationAreaDropdownToggle} /> : <CancelIcon className='event-submission-multiselect-icon' onClick={handlePublicationAreaDropdownToggle} />}
                                                closeOnSelect
                                                showCheckbox
                                                keepListOpen={isPublicationAreaDropdownOpen}
                                                className={!isPublicationAreaDropdownOpen ? "displayNoneShow" : "displayBlockShow"}
                                            />
                                            {errors.publicationArea && <span className='error-message'>{errors.publicationArea.message}</span>}
                                        </div>
                                    )}
                                />
                            </Grid>
                            <Grid item lg={6} md={12} sm={12} xs={12}>
                                <InputLabel>{t('eventType')}</InputLabel>
                                <Controller
                                    control={control}
                                    name="eventTypes"
                                    defaultValue={[]}
                                    rules={{ required: `${t('eventTypeRequired')}` }}
                                    render={({ field }) => (
                                        <div>
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
                                                customArrow={!isEventTypeDropdownOpen ? <ArrowDropDownCircleIcon className='event-submission-multiselect-icon' onClick={handleEventTypeDropdownToggle} /> : <CancelIcon className='event-submission-multiselect-icon' onClick={handleEventTypeDropdownToggle} />}
                                                closeOnSelect
                                                showCheckbox
                                                keepListOpen={isEventTypeDropdownOpen}
                                                className={!isEventTypeDropdownOpen ? "displayNoneShow" : "displayBlockShow"}
                                            />
                                            {errors.eventTypes && <span className='error-message'>{errors.eventTypes.message}</span>}
                                        </div>
                                    )}
                                />
                            </Grid>
                            <Grid item lg={6} md={12} sm={12} xs={12}>
                                <InputLabel>{t('uploadFiles')}</InputLabel>
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
                                                    {`${t('cannotUploadMoreThan3Files')} ${field.value.length}/3`}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <InputLabel>{t('eventDetails')}</InputLabel>
                                <Controller
                                    control={control}
                                    name="eventDetails"
                                    rules={{
                                        required: `${t('eventDetailsRequired')}`,
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
                                    {isLoading ? <CircularProgress size={24} className='event-submission-button-loader' /> : `${t('submit')}`}
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
                className='event-submission-pdf-modal'
            >
                <div className="pdf-modal">
                    <IconButton
                        onClick={closePdfModal}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    {selectedPdf && (
                        <div>
                            {selectedPdf.type.startsWith('image/') ? (
                                <img src={URL.createObjectURL(selectedPdf)} alt={selectedPdf.name} className='event-submission-image' />
                            ) : (
                                <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}>
                                    <Viewer fileUrl={URL.createObjectURL(selectedPdf)} />
                                </Worker>
                            )}
                        </div>
                    )}
                </div>
            </Modal>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </ >

    );
};

export default EventPublicationForm;
