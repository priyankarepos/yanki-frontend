import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, Modal, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Snackbar, CircularProgress, useMediaQuery } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { Context } from '../App';
import ConfirmDialog from '../EnterpriseCollabration/ConfirmDialog';
import { useForm, Controller } from 'react-hook-form';
import "../Admin/AdminStyle.css"
import VisibilityIcon from '@mui/icons-material/Visibility';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { pdfjs } from 'react-pdf';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import CloseIcon from '@mui/icons-material/Close';
import EnterpriseDashboard from './EnterpriseDashboard';
import { agentChatResponse } from '../Utils/stringConstant/AgentChatResponse';

const EnterpriseFileUpload = () => {
    const { drawerOpen } = useContext(Context);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [confirmationText, setConfirmationText] = useState('');
    const [loading, setLoading] = useState(false);
    const { control, handleSubmit, setValue, trigger, reset, formState: { errors } } = useForm({
        mode: "onChange",
        defaultValues: {
            file: null,
            keywords: "",
        },
    });
    const [tableData, setTableData] = useState([]);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [pdfLoadError, setPdfLoadError] = useState(false);
    const [pdfName, setPdfName] = useState("");
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_API_HOST}/api/EnterpriseDocumentUpload/get-enterprise-document`);

                setTableData(response.data.map((pdfUrl, index) => ({ id: index + 1, pdfUrl })));

            } catch (error) {
                setSnackbarMessage('Error fetching data:', error);
                setSnackbarOpen(false);
            }
        };

        fetchData();
    }, []);

    const openPdfModal = (index) => {
        const selectedPdfData = tableData[index];
        setSelectedPdf(selectedPdfData);
        setPdfLoadError(false);
    };

    const closePdfModal = () => {
        setSelectedPdf(null);
    };

    const validateFile = (value) => {
        if (!value || value.length === 0) {
            return 'File is required';
        }
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        if (!allowedTypes.includes(value[0].type)) {
            return 'Please select a valid file (PDF, JPG, or PNG)';
        }

        return true;
    };



    const onSubmit = async (data) => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append('file', data.file[0]);

            const apiUrl = `${import.meta.env.VITE_APP_HOST}/api/EnterpriseDocumentUpload/upload-enterprise-document?IsCertificate=false`;

            const response = await axios.post(apiUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                setSnackbarMessage(`Document with Name ${data.file[0].name} added successfully`);
                setSnackbarOpen(true);
                setIsModalOpen(false);
                reset();
                setTableData((prevTableData) => [
                    ...prevTableData,
                    {
                        id: prevTableData.length + 1,
                        pdfUrl: data.file[0].name,
                    },
                ]);
                window.location.reload();
            } else {
                setSnackbarMessage('Failed to upload the file');
                setSnackbarOpen(true);
            }
        } catch (error) {
            setSnackbarMessage('An error occurred while uploading the file.');
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const isLargeScreen = useMediaQuery("(min-width: 600px)");

    const handleDelete = (pdfName) => {
        setPdfName(pdfName);
        setConfirmDialogOpen(true);
        setConfirmationText(`Are you sure you want to delete this file?`);
    };

    const handleConfirmation = async () => {
        const rowIndex = tableData.findIndex((row) => row.pdfUrl.split('/').pop() === pdfName);

        if (rowIndex !== -1) {
            try {
                setLoading(true);
                const response = await axios.delete(`${import.meta.env.VITE_APP_HOST}/api/EnterpriseDocumentUpload/delete-enterprise-document?fileName=${encodeURIComponent(pdfName)}`);

                if (response.status === 200) {
                    const updatedTableData = [...tableData];
                    updatedTableData.splice(rowIndex, 1);
                    setTableData(updatedTableData);
                    setConfirmDialogOpen(false);
                    setSnackbarMessage(`Document with Name ${pdfName} deleted successfully`);
                    setSnackbarOpen(true);
                } else {
                    setSnackbarMessage(`Failed to delete document: ${response.status}, ${response.data.message}`);
                    setSnackbarOpen(true);
                }
            } catch (error) {
                setSnackbarMessage(`Error deleting document: ${error.message}`);
                setSnackbarOpen(true);
            } finally {
                setLoading(false);
            }
        }
    };

    const renderPdfModal = () => {
        return (
            <Modal
                open={Boolean(selectedPdf)}
                onClose={closePdfModal}
                className='enterprise-profile-modal'
            >
                <div className="enterprise-profile-pdf-modal">
                    <IconButton
                        className='enterprise-profile-pdf-modal-icon-button'
                        style={{ top: !isLargeScreen ? '40px' : '20px' }}
                        onClick={closePdfModal}
                        aria-label="close"
                    >
                        <CloseIcon className='enterprise-white-color' />
                    </IconButton>
                    {!pdfLoadError ? (
                        selectedPdf?.pdfUrl.toLowerCase().endsWith('.pdf') ? (
                            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}>
                                <Viewer fileUrl={selectedPdf?.pdfUrl} />
                            </Worker>
                        ) : (
                            <img
                                src={selectedPdf?.pdfUrl}
                                alt=""
                                className='enterprise-profile-image'
                                onError={() => setPdfLoadError(true)}
                            />
                        )
                    ) : (
                        <div>Error loading content. Please try again.</div>
                    )}
                </div>
            </Modal>
        );
    };

    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

    return (
        <Box className='enterprise-box'>
            <Box sx={{
                width:
                    drawerOpen && !isSmallScreen
                        ? agentChatResponse.drawerOpenWidth
                        : agentChatResponse.zeroWidth,
                transition: agentChatResponse.transitionStyle,
            }}><EnterpriseDashboard /></Box>
            <Box className={`enterpriseFormBox ${drawerOpen ? "sidebar-content" : "main-content"}`}>
                <Box className='enterprise-upload-box'>
                    <Typography variant="h6" className='enterprise-upload-modal-title' >Upload Files</Typography >
                    <Button
                        variant="outlined"
                        sx={{ marginY: { xs: "10px" } }}
                        className='enterprise-add-file-button enterprise-profile-modal-button'
                        color="primary"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Add Files
                    </Button>
                </Box>
                {tableData.length === 0 ? (
                    <Typography variant="h6" className='enterprise-upload-empty-message'>
                        No data available.
                    </Typography>
                ) : (
                    <TableContainer className='marginTop-20' component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Sr No.</TableCell>
                                    <TableCell>PDF Name</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tableData.map((row, index) => (
                                    <TableRow key={index + 1}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.pdfUrl ? row.pdfUrl.split('/').pop() : ''}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => openPdfModal(index)}>
                                                <VisibilityIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(row.pdfUrl.split('/').pop())}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
            {renderPdfModal()}
            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className='enterprise-profile-modal'
            >
                <Box className='enterprise-upload-modal-content'>
                    <Typography variant="h5" className='enterprise-modal-title'>Upload File</Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* File Upload */}
                        <Controller
                            control={control}
                            name="file"
                            render={({ field }) => (
                                <div>
                                    <input
                                        type="file"
                                        onChange={(e) => {
                                            const selectedFile = e.target.files[0];
                                            setValue('file', [selectedFile]);
                                            trigger('file');
                                        }}
                                        className='enterprise-input-field enterprise-profile-modal-input-field'
                                    />
                                    {errors.file && (
                                        <span className='error-handling'>
                                            {errors.file.message}
                                        </span>
                                    )}
                                </div>
                            )}
                            rules={{ validate: validateFile }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            className='enterprise-profile-modal-button'
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} className='enterprise-profile-modal-button-loader' /> : 'Upload'}
                        </Button>
                    </form>
                </Box>
            </Modal>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
            <ConfirmDialog
                open={confirmDialogOpen}
                handleClose={() => setConfirmDialogOpen(false)}
                handleConfirm={() => handleConfirmation()}
                confirmationText={confirmationText}
                loading={loading}
            />
        </Box>
    )
}

export default EnterpriseFileUpload;
