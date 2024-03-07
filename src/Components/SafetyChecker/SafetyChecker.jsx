import { Paper, TextField, Button, Typography } from '@mui/material';
import React, { useState } from 'react';

const SafetyChecker = () => {
    const [content, setContent] = useState('');

    const handleSafetyCheck = () => {
        // Assuming you have a function to send the content to the specified email
        sendSafetyCheckEmail(content);
    };

    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Safety Checker
            </Typography>
            <Typography>
                What content would you like the agent to check?
            </Typography>
            <Typography>
                Please fill in the URL or content details below:
            </Typography>
            <TextField
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                margin="normal"
                placeholder="Enter the website URL or content here"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleSafetyCheck}
            >
                Submit Safety Check
            </Button>
        </Paper>
    );
};

// Function to send safety check email
const sendSafetyCheckEmail = (content) => {
    // Assuming logic to send an email to pa@yanki.ai from torah@yanki.ai with user details
    const emailData = {
        content,
        user: {
            name: 'User Name', // Replace with actual user details
            contactNumber: 'User Contact Number',
            email: 'User Email',
        },
    };

    // Implement logic to send the email with the emailData
    console.log('Email sent:', emailData);
};

export default SafetyChecker;
