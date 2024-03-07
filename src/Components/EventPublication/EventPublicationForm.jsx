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

const EventPublicationForm = () => {
    const [options, setOptions] = useState([
        { name: 'location 1️', id: 1 },
        { name: 'location 2️', id: 2 },
        { name: 'location 3', id: 3 },
        { name: 'location 4', id: 4 },
    ]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const eventTypes = [
        { label: 'Type 1', value: 'type1' },
        { label: 'Type 2', value: 'type2' },
        { label: 'Others', value: 'others' },
    ];
    const [selectedValues, setSelectedValues] = useState([]);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [isPdfModalOpen, setPdfModalOpen] = useState(false);
    console.log("selectedPdf", selectedPdf);
    const handlePdfSelect = (file) => {
        setSelectedPdf(file);
        setPdfModalOpen(true);
    };
    const closePdfModal = () => {
        setSelectedPdf(null);
        setPdfModalOpen(false);
    };
    const { control, handleSubmit, setValue, register, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        console.log(data);
    };

    const onSelect = (selectedList, selectedItem) => {
        console.log(selectedList, selectedItem);
        setSelectedValues(selectedList);
    };

    const onRemove = (selectedList, removedItem) => {
        console.log(selectedList, removedItem);
        setSelectedValues(selectedList);
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

    return (
        <Box className="demo-enterprise-wrapper">
            <Paper elevation={3}>
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
                                        options={options}
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
                                        options={options}
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
                                name="eventType"
                                rules={{
                                    required: 'Event Type is required',
                                }}
                                render={({ field }) => (
                                    <Autocomplete
                                        {...field}
                                        options={eventTypes}
                                        getOptionLabel={(option) => option.label}
                                        renderInput={(params) => (
                                            <TextField {...params} placeholder="Type event type here" fullWidth />
                                        )}
                                        onChange={(_, value) => setValue('eventType', value ? value.value : null)}
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
