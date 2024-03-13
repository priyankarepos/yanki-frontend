import { Paper, TextField, Button, Typography, Snackbar, CircularProgress, FormHelperText } from '@mui/material';
import React, { useState } from 'react';
import axios from "axios";

const SafetyChecker = ({ answer }) => {
    const [content, setContent] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState(false);
    const [mailMessage, setMailMessage]= useState("")

    const handleSafetyCheck = async () => {
        try {
            setLoading(true);
            const apiUrl = `${process.env.REACT_APP_API_HOST}/api/yanki-ai/safety-checker-email`;
            const response = await axios.post(apiUrl, { content });
            if (response.status === 200) {
                setSnackbarMessage(response?.data?.message)
                setMailMessage(response?.data?.message)
                setSnackbarOpen(true)
                setLoading(false);
                setContent("");
                setTouched(false)
            } else {
                setSnackbarMessage('Failed to send safety check email')
                setSnackbarOpen(true)
            }
        } catch (error) {
            console.error('Error sending safety check email:', error);
        }
    };

    const handleBlur = () => {
        setTouched(true);
    };

    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Safety Checker
            </Typography>
            <Typography>
                {answer?.message}
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
                onBlur={handleBlur}
                error={touched && !content.trim()}
                disabled={mailMessage !=="" || !answer?.safetyChecker === true}
            />
            <FormHelperText className="error-message">
                {touched && !content.trim() && 'This field is required.'}
            </FormHelperText>
            <Button
                variant="contained"
                color="primary"
                onClick={handleSafetyCheck}
                disabled={content.length === 0 || loading || mailMessage !=="" || !answer?.safetyChecker === true}
                sx={{mt:"8px"}}
            >
                {loading ? <CircularProgress size={24} /> : "Submit Safety Check"}
            </Button>
            {mailMessage && <Typography sx={{mt:2}}>Your Safety Check submission is now under review by our agents. You can expect to receive the results at the email address registered with us.</Typography>}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </Paper>
    );
};

export default SafetyChecker;
