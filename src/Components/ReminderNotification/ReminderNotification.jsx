import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import React, { useState } from 'react';
import "./ReminderNotification.scss"

const ReminderNotification = ({ answer }) => {
    // Dummy reminder list for demonstration
    const dummyReminders = [
        { id: 1, message: "Reminder 1", time: "10:00 AM" },
        { id: 2, message: "Reminder 2", time: "12:00 PM" },
        { id: 3, message: "Reminder 3", time: "3:00 PM" }
    ];

    const handleCancel = (id) => {
        // Handle cancel action here
        console.log("Cancel reminder with ID:", id);
    };

    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Reminder
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
                        {dummyReminders.map((reminder) => (
                            <TableRow key={reminder.id}>
                                <TableCell>{reminder.message}</TableCell>
                                <TableCell>{reminder.time}</TableCell>
                                <TableCell>
                                    <Typography className='Custom-Button' onClick={() => handleCancel(reminder.id)}>Cancel</Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default ReminderNotification;
