import { Paper, TextField, Typography, CircularProgress, FormHelperText, Snackbar } from '@mui/material';
import React, { useState } from 'react';
import axios from "axios";
import "./SafetyChecker.scss"
import { useTranslation } from 'react-i18next';

const SafetyChecker = ({ answer, fetchRemainingMessage, clickableOff}) => {
    const { t } = useTranslation();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState(false);
    const [mailMessage, setMailMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const yankiUser = JSON.parse(window.localStorage.getItem(import.meta.env.VITE_APP_LOCALSTORAGE_TOKEN) || '{}');
    const userRoles = yankiUser?.userObject?.userRoles || '';

    const handleSafetyCheck = async () => {
        try {
            setLoading(true);
            const apiUrl = `${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/safety-checker-email`;
            const response = await axios.post(apiUrl, { content });
            if (response.status === 200) {
                setMailMessage(response?.data?.message)
                setLoading(false);
                setContent("");
                setTouched(false)
                fetchRemainingMessage();
            } else {
                setSnackbarMessage(`${t('failedToSendSafetyCheckEmail')}`);
                setSnackbarOpen(true);
            }
        } catch (error) {
            setSnackbarMessage(`${t('errorSendingSafetyCheckEmail')}`, error);
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
                {t('safetyChecker')}
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
                    placeholder={t('enterWebsiteURLOrContentHere')}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onBlur={handleBlur}
                    error={touched && !content.trim()}
                    disabled={mailMessage !== "" || !answer?.safetyChecker === true || clickableOff}
                />
                <FormHelperText className="error-message">
                    {touched && !content.trim() && `${t('fieldRequired')}`}
                </FormHelperText>
                <Typography
                    className={`${content.length === 0 ? "Custom-disabled-Button" : "Custom-Button"} ${userRoles === "Enterprise" ? "Custom-disable-light" : ""}`}
                    onClick={content.length === 0 ? null : handleSafetyCheck}
                    sx={{ mt: "8px", cursor: (content.length === 0 || loading || mailMessage !== "" || !answer?.safetyChecker === true) ? 'text' : 'pointer' }}
                >
                    {loading ? <CircularProgress size={24} className='dark-blur-color' /> : `${t('submitSafetyCheck')}`}
                </Typography>
                {mailMessage && <Typography sx={{ mt: 2 }}>{t('safetyCheckSubmissionReview')}</Typography>}
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
