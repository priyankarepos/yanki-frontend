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
        marginLeft: '0',
        transition: 'margin-left 0.3s',
        alignItems: "center",
        justifyContent: "space-between",
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
        color: "#fff",
    },
    modalButton: {
        backgroundColor: '#fff',
        color: '#063762',
        textTransform: 'capitalize',
        borderRadius: '10px',
        padding: '20px 15px',
        fontSize: '16px',
        marginTop: "20px",
    },
};

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
                const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/EnterpriseDocumentUpload/get-enterprise-document`);

                setTableData(response.data.map((pdfUrl, index) => ({ id: index + 1, pdfUrl })));

            } catch (error) {
                console.error('Error fetching data:', error);
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

            const apiUrl = `${process.env.REACT_APP_API_HOST}/api/EnterpriseDocumentUpload/upload-enterprise-document?IsCertificate=false`;

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
                const response = await axios.delete(`${process.env.REACT_APP_API_HOST}/api/EnterpriseDocumentUpload/delete-enterprise-document?fileName=${encodeURIComponent(pdfName)}`);

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
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div className="pdf-modal" style={{ width: '90vw', height: '88vh', position: 'relative' }}>
                    <IconButton
                        style={{ position: 'absolute', top: !isLargeScreen ? '40px' : '20px', right: '8px', zIndex: 1, backgroundColor: "#6fa8dd" }}
                        onClick={closePdfModal}
                        aria-label="close"
                    >
                        <CloseIcon style={{ color: "#fff" }} />
                    </IconButton>
                    {!pdfLoadError ? (
                        selectedPdf?.pdfUrl.toLowerCase().endsWith('.pdf') ? (
                            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}>
                                <Viewer fileUrl={selectedPdf?.pdfUrl} />
                            </Worker>
                        ) : (
                            <img
                                src={selectedPdf?.pdfUrl}
                                alt="PDF Document"
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
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

    const contentMargin = drawerOpen ? '0' : '0';

    return (
        <Box style={{ display: "flex" }}>
            <Box sx={{ width: drawerOpen && !isSmallScreen ? '270px' : "0" }}><EnterpriseDashboard /></Box>
            <Box style={{ ...styles.content, marginLeft: contentMargin, }} className="enterpriseFormBox" sx={{ width: drawerOpen ? 'calc(100% - 270px)' : "100%", marginTop: '50px', padding: '16px' }}>
                <Box style={{ ...styles.content, marginLeft: contentMargin, display: "flex", alignItems: "center", }}>
                    <Typography variant="h6" sx={{ ...styles.modalTitle, marginBottom: "0px", color: "#6fa8dd" }} >Upload Files</Typography >
                    <Button
                        variant="outlined"
                        sx={{ marginY: { xs: "10px" }, width: "150px" }}
                        color="primary"
                        style={styles.modalButton}
                        onClick={() => setIsModalOpen(true)}
                    >
                        Add Files
                    </Button>
                </Box>
                {tableData.length === 0 ? (
                    <Typography variant="h6" sx={{ marginTop: '20px', color: '#6fa8dd', textAlign: "center" }}>
                        No data available.
                    </Typography>
                ) : (
                    <TableContainer component={Paper} style={{ marginTop: '20px' }}>
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
                style={styles.modal}
            >
                <Box style={styles.modalContent}>
                    <Typography variant="h5" sx={styles.modalTitle}>"Upload File"</Typography>
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
                                        style={{
                                            backgroundColor: '#eaf5ff',
                                            border: '1px solid #6fa8dd',
                                            borderRadius: '8px',
                                            marginBottom: '6px',
                                            color: "#8bbae5", width: '100%', minHeight: "15%", padding: "15px", fontSize: "16px",
                                        }}
                                    />
                                    {errors.file && (
                                        <span style={{ color: 'red', fontSize: '12px', margin: 0 }}>
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
                            style={styles.modalButton}
                            type="submit"
                            disabled={loading}
                        // onClick={(e) => handleSubmit(e)}
                        >
                            {loading ? <CircularProgress size={24} style={{ color: "#0d416f" }} /> : 'Upload'}
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
