import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, FormHelperText, Modal, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, InputLabel, Snackbar, CircularProgress, useMediaQuery } from '@mui/material';
import AdminDashboard from './AdminDashboard';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { Context } from '../App';
import ConfirmDialog from '../EnterpriseCollabration/ConfirmDialog';
import TagsInput from 'react-tagsinput';
import { useForm, Controller } from 'react-hook-form';
import "./AdminStyle.css"
import VisibilityIcon from '@mui/icons-material/Visibility';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { pdfjs } from 'react-pdf';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import CloseIcon from '@mui/icons-material/Close';


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
        // padding: '16px',
        marginLeft: '0',
        transition: 'margin-left 0.3s',
        alignItems: "center",
        justifyContent: "space-between",
        // marginTop:"-15px",
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
        padding: '20px 15px',
        fontSize: '16px',
        marginTop: "20px",
    },
};

const AdminFileUpload = () => {
    const { drawerOpen } = useContext(Context);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [confirmationText, setConfirmationText] = useState('');
    const [loading, setLoading] = useState(false);
    const { control, handleSubmit,reset, formState: { isSubmitted, errors } } = useForm();
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [tableData, setTableData] = useState([]);
    console.log("tableData", tableData);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [pdfLoadError, setPdfLoadError] = useState(false);

    const s3BaseUrl = "https://jewishprayer-text-pdf.s3.amazonaws.com/";

    const openPdfModal = (pdfName) => {
        const cleanPdfName = pdfName.replace(/%27/g, '');
        const pdfUrl = `${s3BaseUrl}${cleanPdfName}`;
        setSelectedPdf(pdfUrl);
        setPdfLoadError(false);
    };

    const closePdfModal = () => {
        setSelectedPdf(null);
    };

    const handleAddTag = (newTag) => {
        setTags([...tags, newTag]);
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    // const onSubmit = async (data) => {
    //     try {
    //       setLoading(true);

    //       const tagsAsString = tags.join(',');
    //       const response = await axios.post(`${process.env.REACT_APP_API_HOST}/api/JewishPrayerTextIndex/index-document`, {
    //         pdfName: data.file.name,
    //         keywords: tagsAsString,
    //       });

    //       // Handle the response, for example, show a success message
    //       console.log('API response:', response.data);
    //       setSnackbarMessage('File uploaded successfully');

    //       // Close the modal after successful upload
    //       setIsModalOpen(false);

    //       // Add the uploaded file and keywords to the table
    //       setTableData((prevTableData) => [
    //         ...prevTableData,
    //         {
    //           id: prevTableData.length + 1,
    //           pdfName: data.file.name,
    //           keywords: data.keywords.join(', '),
    //         },
    //       ]);
    //     } catch (error) {
    //       // Handle errors, show a user-friendly message or log details
    //       console.error('Error calling API:', error);
    //       setSnackbarMessage('An error occurred while uploading the file.');
    //       setSnackbarOpen(true);
    //     } finally {
    //       setLoading(false);
    //     }
    //   };

    const onSubmit = (data) => {
        try {
            setLoading(true);

            // Simulate a successful API response
            const uploadedData = {
                id: tableData.length + 1,
                pdfName: data.file.name,
                keywords: tags.join(', '),
            };

            // Close the modal after "successful upload"
            setIsModalOpen(false);

            // Add the uploaded file and keywords to the table
            setTableData((prevTableData) => [...prevTableData, uploadedData]);
            reset();
            setTags([]);

            // Show a success message
            setSnackbarMessage('File uploaded successfully');
            setSnackbarOpen(true);
        } catch (error) {
            // Handle errors, show a user-friendly message or log details
            console.error('Error during upload:', error);
            setSnackbarMessage('An error occurred while uploading the file.');
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };


    const isLargeScreen = useMediaQuery("(min-width: 600px)");


    const handleView = (pdfName) => {
        // Implement the logic to view the PDF
        console.log(`Viewing PDF: ${pdfName}`);
    };

    const handleDelete = (pdfName) => {
        // Find the index of the row with the matching pdfName
        const rowIndex = tableData.findIndex((row) => row.pdfName === pdfName);

        if (rowIndex !== -1) {
            // Create a copy of the array and remove the row at the found index
            const updatedTableData = [...tableData];
            updatedTableData.splice(rowIndex, 1);

            // Update the state with the new array
            setTableData(updatedTableData);
        }

        // Additional logic for actual deletion (e.g., making an API call) can be added here
    };

    const renderPdfModal = () => {
        return (
            <Modal
                open={Boolean(selectedPdf)}
                onClose={closePdfModal}
                aria-labelledby="pdf-modal-title"
                aria-describedby="pdf-modal-description"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div className="pdf-modal" style={{ width: '90vw', height: '88vh', position: 'relative' }}>
                    <IconButton
                        style={{ position: 'absolute', top: !isLargeScreen ? '40px' : '20px', right: '8px', zIndex: 1, backgroundColor: "#6fa8dd", }}
                        onClick={closePdfModal}
                        aria-label="close"
                    >
                        <CloseIcon style={{ color: "#fff" }} />
                    </IconButton>
                    {pdfLoadError ? (
                        <div>Error loading PDF. Please try again.</div>
                    ) : (
                        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}>
                            <Viewer fileUrl={selectedPdf} />
                        </Worker>
                    )}
                </div>
            </Modal>
        );
    };

    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

    const contentMargin = drawerOpen ? '0' : '0';

    return (
        <Box style={{ display: "flex" }}>
            <Box sx={{ width: drawerOpen && !isSmallScreen ? '270px' : "0" }}><AdminDashboard /></Box>
            <Box style={{ ...styles.content, marginLeft: contentMargin, }} className="enterpriseFormBox" sx={{ width: drawerOpen ? 'calc(100% - 270px)' : "100%", marginTop: '50px', padding: '16px' }}>
                <Box style={{ ...styles.content, marginLeft: contentMargin, display: "flex", alignItems: "center", }}>
                    <Typography variant="h5" sx={{ ...styles.modalTitle, fontWeight: "bold", marginBottom: "0px", }} >Upload Files</Typography >
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
                    <Typography variant="h6" sx={{ marginTop: '20px', color: '#6fa8dd', textAlign:"center" }}>
                        No data available.
                    </Typography>
                ) : (
                    <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Sr No.</TableCell>
                                    <TableCell>PDF Name</TableCell>
                                    <TableCell>Keywords</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tableData.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.pdfName}</TableCell>
                                        <TableCell>{row.keywords}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => openPdfModal(row.pdfName)}>
                                                <VisibilityIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(row.pdfName)}>
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
                                            field.onChange(e.target.files[0]);
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
                                        <FormHelperText style={{ color: 'red', fontSize: '12px', margin: 0 }}>
                                            {errors.file.message}
                                        </FormHelperText>
                                    )}
                                </div>
                            )}
                            rules={{ required: 'File is required' }}
                        />

                        {/* Keywords */}
                        <Controller
                            control={control}
                            name="keywords"
                            render={({ field }) => (
                                <div>
                                    <TagsInput
                                        value={tags}
                                        onChange={(newTags) => setTags(newTags)}
                                        addKeys={[13, 9]}
                                        placeholder="Type keywords here"
                                        inputProps={{
                                            style: {
                                                backgroundColor: '#eaf5ff',
                                                border: '1px solid #6fa8dd',
                                                borderRadius: '8px',
                                                marginBottom: '16px',
                                                color: '#8bbae5',
                                                width: '100%',
                                                outline: 'none',
                                                height: "60px",
                                            },
                                            ...field,
                                            value: tagInput,
                                            onChange: (e) => setTagInput(e.target.value),
                                            onKeyDown: (e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    e.persist();
                                                    handleAddTag(e.target.value);
                                                    field.onChange('');
                                                    setTagInput('');
                                                }
                                            },
                                        }}
                                    />
                                    {isSubmitted && Array.isArray(tags) && tags.length === 0 && (
                                        <FormHelperText style={{ color: 'red', fontSize: '12px', margin: 0 }}>
                                            At least one keyword is required
                                        </FormHelperText>
                                    )}
                                </div>
                            )}
                            rules={{
                                validate: (value) => {
                                    const keywordsArray = Array.isArray(value) ? value : [value];
                                    return keywordsArray.length > 0 || 'Keywords are required';
                                },
                            }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            style={styles.modalButton}
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Upload'}
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
                handleConfirm={""}
                confirmationText={confirmationText}
            />
        </Box>
    )
}

export default AdminFileUpload;
