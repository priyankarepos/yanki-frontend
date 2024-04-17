import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, TextField, Modal, Button, Snackbar, CircularProgress, useMediaQuery, Card, CardContent } from '@mui/material';
import AdminDashboard from './AdminDashboard';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { Context } from '../App';
import ConfirmDialog from '../EnterpriseCollabration/ConfirmDialog';
import "./AdminStyle.css";

const styles = {
    content: {
        flex: 1,
        padding: '16px',
        marginLeft: '0',
        transition: 'margin-left 0.3s',
    },
};

const AdminAddFaq = () => {
    const { drawerOpen } = useContext(Context);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [adminFaqData, setAdminFaqData] = useState([]);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [editFaqId, setEditFaqId] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [selectedFaqId, setSelectedFaqId] = useState(null);
    const [confirmationText, setConfirmationText] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);

    useEffect(() => {
        const fetchFAQs = async () => {
            setLoadingData(true)
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/faqManagement/get-faq`);
                setAdminFaqData(response.data);
                setLoadingData(false)
            } catch (error) {
                setSnackbarMessage('Error fetching FAQs');
                setSnackbarOpen(false); 
                setLoadingData(false)
            }
        };

        fetchFAQs();
    }, [isModalOpen]);

    const handleEdit = (data) => {
        setQuestion(data?.question);
        setAnswer(data?.answer);
        setEditFaqId(data.id);
        setIsModalOpen(true);
    };

    const handleDeleteFaqs = (id) => {
        setConfirmDialogOpen(true);
        setSelectedFaqId(id);
        setConfirmationText(`Are you sure you want to delete this?`);
    };

    const handleConfirmDelete = async () => {
        try {
            const apiUrl = `${process.env.REACT_APP_API_HOST}/api/faqManagement/delete-faq/${selectedFaqId}`;
            const response = await axios.delete(apiUrl);
            const updatedFaqList = adminFaqData.filter((faq) => faq.id !== selectedFaqId);
            setAdminFaqData(updatedFaqList);
            setConfirmDialogOpen(false);
            setSnackbarMessage(response.data.message);
            setSnackbarOpen(true);
        } catch (error) {
            setSnackbarMessage("Error while deleting FAQs");
            setSnackbarOpen(true);
        }
    };

    const handleAddFaqs = () => {
        setAnswer('');
        setQuestion('');
        setEditFaqId(null);
        setIsModalOpen(true);
    };

    const handleSaveFaqs = async () => {
        try {
            setLoading(true);
            const apiUrl = `${process.env.REACT_APP_API_HOST}/api/faqManagement/add-faq`;
            const response = await axios.post(apiUrl, {
                question: question,
                answer: answer
            });
            setIsModalOpen(false);
            setAnswer('');
            setQuestion('');
            setSnackbarMessage(response.data.message);
            setSnackbarOpen(true);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setSnackbarMessage("Error: Bad Request. Please check your data.");
            } else {
                setSnackbarMessage("Error: Unable to save FAQs.");
            }
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);
            const apiUrl = `${process.env.REACT_APP_API_HOST}/api/faqManagement/edit-faq`;
            const response = await axios.put(apiUrl, { id: editFaqId, question, answer });
            const updatedFAQ = response.data;
            setAdminFaqData(prevCategories => {
                const updatedCategories = prevCategories.map(faqs => faqs.id === editFaqId ? { ...faqs, question: updatedFAQ.question, answer: updatedFAQ.answer } : faqs);
                setIsModalOpen(false);
                setAnswer('');
                setQuestion('');
                setEditFaqId(null);
                return updatedCategories;
            });
            setSnackbarMessage(response.data.message);
            setSnackbarOpen(true);
        } catch (error) {
            setSnackbarMessage("Error while updating data");
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
    const contentMargin = drawerOpen ? '0' : '0';

    return (
        <div className="admin-faq-wrapper">
            <Box sx={{ width: drawerOpen && !isSmallScreen ? '270px' : "0" }}><AdminDashboard /></Box>
            <Box style={{ ...styles.content, marginLeft: contentMargin }} sx={{ width: drawerOpen ? 'calc(100% - 270px)' : "100%", padding: '16px' }}>
                <Box className="admin-faq-heading">
                    <Typography variant="h6" sx={{ flex: '1', pb: 2 }}>
                        Add FAQs
                    </Typography>
                    <IconButton color="secondary" size="small" onClick={handleAddFaqs}>
                        <AddIcon /> Add
                    </IconButton>
                </Box>
                {adminFaqData.length > 0 ? (
                    adminFaqData.map((row) => (
                        <Card key={row.id} className='admin-faq-card'>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {row.question}
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                    {row.answer}
                                </Typography>
                                <div className='admin-faq-card-btn-box'>
                                    <Button variant="contained" onClick={() => handleEdit(row)} sx={{mr:1}}>
                                        Edit
                                    </Button>
                                    <Button variant="contained" color="error" onClick={() => handleDeleteFaqs(row.id)}>
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : loadingData ? (
                    <Typography className='admin-faq-progressbar'>
                        <CircularProgress />
                    </Typography>
                ) : (
                    <Typography variant="body1" className='no-data-found'>
                        No FAQs available
                    </Typography>
                )}
            </Box>
            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className='admin-faq-model-style'
            >
                <Box className="admin-faq-model-content">
                    <Typography variant="h6" sx={{ mb: 3 }}>
                        {editFaqId !== null ? "Update FAQs" : "Add FAQs"}
                    </Typography>
                    <form
                        className='admin-faq-form-model'
                        onSubmit={(e) => {
                            e.preventDefault();
                            editFaqId !== null ? handleUpdate() : handleSaveFaqs();
                        }}
                    >
                        <TextField
                            variant="outlined"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder='Enter Question'
                            label="Question"
                        />
                        <TextField
                            multiline
                            rowsmax={20}
                            variant="outlined"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Enter Answer"
                            label="Answer"
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={loading || !question.trim() || !answer.trim()}
                        >
                            {loading ? <CircularProgress className='CircularProgressColor' size={24} /> : (editFaqId !== null ? "Save Changes" : "Save & Add")}
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
                handleConfirm={handleConfirmDelete}
                confirmationText={confirmationText}
            />
        </div>
    )
}

export default AdminAddFaq;
