import { Paper, TextField, Typography, CircularProgress, FormHelperText, Snackbar } from '@mui/material';
import React, { useState } from 'react';
import axios from "axios";
import "./SafetyChecker.scss"

const SafetyChecker = ({ answer, fetchRemainingMessage }) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState(false);
    const [mailMessage, setMailMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const yankiUser = JSON.parse(window.localStorage.getItem(process.env.REACT_APP_LOCALSTORAGE_TOKEN) || '{}');
    const userRoles = yankiUser?.userObject?.userRoles || '';

    const handleSafetyCheck = async () => {
        try {
            setLoading(true);
            const apiUrl = `${process.env.REACT_APP_API_HOST}/api/yanki-ai/safety-checker-email`;
            const response = await axios.post(apiUrl, { content });
            if (response.status === 200) {
                setMailMessage(response?.data?.message)
                setLoading(false);
                setContent("");
                setTouched(false)
                fetchRemainingMessage();
            } else {
                setSnackbarMessage('Failed to send safety check email');
                setSnackbarOpen(true);
            }
        } catch (error) {
            setSnackbarMessage('Error sending safety check email:', error);
            setSnackbarOpen(true);
        }
    };

    const handleBlur = () => {
        setTouched(true);
    };

    return (
        <>
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
                    disabled={mailMessage !== "" || !answer?.safetyChecker === true}
                />
                <FormHelperText className="error-message">
                    {touched && !content.trim() && 'This field is required.'}
                </FormHelperText>
                <Typography
                    className={`${content.length === 0 ? "Custom-disabled-Button" : "Custom-Button"} ${userRoles === "Enterprise" ? "Custom-disable-light" : ""}`}
                    onClick={content.length === 0 ? null : handleSafetyCheck}
                    sx={{ mt: "8px", cursor: (content.length === 0 || loading || mailMessage !== "" || !answer?.safetyChecker === true) ? 'text' : 'pointer' }}
                >
                    {loading ? <CircularProgress size={24} className='dark-blur-color' /> : "Submit Safety Check"}
                </Typography>
                {mailMessage && <Typography sx={{ mt: 2 }}>Your Safety Check submission is now under review by our agents. You can expect to receive the results at the email address registered with us.</Typography>}
            </Paper>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </>
    );
};

export default SafetyChecker;
