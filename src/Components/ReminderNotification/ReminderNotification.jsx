import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Snackbar } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import "./ReminderNotification.scss"
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { apiUrls } from '../../Utils/stringConstant/stringConstant';

const ReminderNotification = () => {
    const { t } = useTranslation();
    const [reminders, setReminders] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const yankiUser = JSON.parse(window.localStorage.getItem(import.meta.env.VITE_APP_LOCALSTORAGE_TOKEN) || '{}');
    const userId = yankiUser?.userObject?.userId || '';
    const fetchReminders = useCallback(async () => {
        try {
            const response = await axios.get(apiUrls.getUpcomingReminders(userId));
            setReminders(response.data);
        } catch (error) {
            setSnackbarMessage(`${t('errorFetchingReminders')}: ${error}`);
            setSnackbarOpen(true);
        }
    }, [userId]);

    useEffect(() => {
        fetchReminders();
    }, [fetchReminders]);

    const handleCancel = async (id, messageServiceId) => {
        try {
            await axios.delete(`${import.meta.env.VITE_APP_API_HOST}/api/reminder/delete-reminder?reminderId=${id}&messageServiceId=${messageServiceId}`);
            setReminders(reminders.filter(reminder => reminder.id !== id));
            setSnackbarMessage(t('reminderCancelledSuccessfully'));
            setSnackbarOpen(true);
            fetchReminders();
        } catch (error) {
            setSnackbarMessage(`${t('errorCancellingReminder')}: ${error.message}`);
            setSnackbarOpen(true);
        }
    };

    return (
        <Paper className='ReminderNotificationUser' sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                {t('belowAreYourUpcomingReminders')}
            </Typography>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('messageText')}</TableCell>
                            <TableCell>{t('timeText')}</TableCell>
                            <TableCell>{t('actionText')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reminders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} align="center">{t('noRemindersAvailable')}</TableCell>
                            </TableRow>
                        ) : (
                            reminders.map((reminder) => (
                                <TableRow key={reminder.id}>
                                    <TableCell>{reminder.reminderMessage}</TableCell>
                                    <TableCell>{new Date(reminder.reminderTime).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Typography className='Custom-Button' onClick={() => handleCancel(reminder?.reminderId, reminder?.messageServiceId)}>{t('cancelReminder')}</Typography>
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
