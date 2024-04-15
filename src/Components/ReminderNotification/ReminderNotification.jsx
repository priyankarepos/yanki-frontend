import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Snackbar } from '@mui/material';
import React, { useEffect, useState } from 'react';
import "./ReminderNotification.scss"
import axios from 'axios';

const ReminderNotification = ({ answer }) => {
    const [reminders, setReminders] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const yankiUser = JSON.parse(window.localStorage.getItem(process.env.REACT_APP_LOCALSTORAGE_TOKEN) || '{}');
    const userId = yankiUser?.userObject?.userId || '';
    console.log("reminders", reminders);
    const fetchReminders = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/reminder/get-upcoming-reminder-userId?userId=${userId}`);
            setReminders(response.data);
        } catch (error) {
            setSnackbarMessage('Error fetching reminders:', error);
            setSnackbarOpen(true);
        }
    };
    useEffect(() => {
        fetchReminders();
    }, [userId]);

    const handleCancel = async (id, messageServiceId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_HOST}/api/reminder/delete-reminder?reminderId=${id}&messageServiceId=${messageServiceId}`);
            setReminders(reminders.filter(reminder => reminder.id !== id));
            setSnackbarMessage('Reminder cancelled successfully');
            setSnackbarOpen(true);
            fetchReminders();
        } catch (error) {
            setSnackbarMessage('Error cancelling reminder:', error.message);
            setSnackbarOpen(true);
        }
    };

    return (
        <Paper className='ReminderNotificationUser' sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                {answer?.message}
            </Typography>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Message</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reminders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} align="center">No reminders available</TableCell>
                            </TableRow>
                        ) : (
                            reminders.map((reminder) => (
                                <TableRow key={reminder.id}>
                                    <TableCell>{reminder.reminderMessage}</TableCell>
                                    <TableCell>{new Date(reminder.reminderTime).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Typography className='Custom-Button' onClick={() => handleCancel(reminder?.reminderId, reminder?.messageServiceId)}>Cancel</Typography>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </Paper>
    );
};

export default ReminderNotification;
