import { Box, Typography, List, Button, Paper, Grid, CircularProgress, Snackbar } from '@mui/material';
import React, { useState } from 'react';
import axios from 'axios';
import "./AnswerStyle.scss";

const DemoEnterpriseChat = ({ answer, fetchRemainingMessage }) => {

    const [selectedEnterprise, setSelectedEnterprise] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [selectedEnterpriseMessage, setSelectedEnterpriseMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const handleSendEmail = async (enterprise) => {
        try {
            const requestData = {
                enterpriseName: enterprise?.enterpriseName,
                enterpriseEmail: enterprise?.enterpriseEmail,
                departmentName: enterprise?.departmentName,
                departmentEmail: enterprise?.departmentEmail,
            };

            const response = await axios.post(`${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/send-mail-to-enterprise`,
                requestData);
            if (response.status === 200) {
                const message = `Your message has been sent to ${enterprise?.enterpriseName}. The organization administrator will contact you directly if needed.`;
                setChatMessages([...chatMessages, message]);
                setSelectedEnterpriseMessage(response.data.message);
                fetchRemainingMessage();
            } else if (response.data && response.data.isSuccess === false) {
                setSelectedEnterpriseMessage("Invalid email. Please provide a valid email address.");
            }
        } catch (error) {
            setSnackbarMessage('Error sending email:', error);
            setSnackbarOpen(true);
        }
    };

    const emailSubject = "Email subject";
    const emailBody = "Email body";

    const handleOpenEmailClient = () => {
        const emailToUse = answer?.enterpriseSelections?.departmentEmail || answer?.enterpriseSelections?.enterpriseEmail;
        const mailtoLink = `mailto:${emailToUse}?subject=${emailSubject}&body=${emailBody}`;
        window.location.href = mailtoLink;
    };

    const handleCall = (phoneNumber) => {
        if (phoneNumber && phoneNumber.trim() !== "") {
            window.location.href = `tel:${phoneNumber}`;
        } else {
            setSnackbarMessage("Phone number is not valid or empty.", phoneNumber);
            setSnackbarOpen(true);
        }
    };
    return (
        <>
            <Box className="demo-enterprise-wrapper">
                <Paper elevation={3}>
                    <div>
                        <List className='demo-enterprise-List'>
                            <Typography className='demo-enterprise-Typography'>
                                {answer.message}
                            </Typography>
                        </List>
                    </div>
                    <List>
                        <Grid container spacing={2}>
                            {answer.enterpriseSelections && answer?.enterpriseSelections.map((enterprise) => (
                                <Grid item xs={12} sm={6} md={6} key={enterprise.id}>
                                    <Box className="enterprise-info-box">
                                        <div>
                                            {enterprise.enterpriseName && <div>Enterprise Name: {enterprise.enterpriseName}</div>}
                                            {enterprise.enterpriseEmail && <div>
                                                Enterprise Email:{" "}
                                                <span className='email-click'
                                                    onClick={handleOpenEmailClient}
                                                >
                                                    {enterprise.enterpriseEmail}
                                                </span>
                                            </div>}
                                            {enterprise.enterpriseAddress && <div>Enterprise Address: {enterprise.enterpriseAddress}</div>}
                                            {enterprise.enterprisePhoneNumber && <div>
                                                Enterprise Phone:{" "}
                                                <span className='email-click'
                                                    onClick={() => handleCall(enterprise.enterprisePhoneNumber)}
                                                >
                                                    {enterprise.enterprisePhoneNumber}
                                                </span>
                                            </div>}
                                            {enterprise.departmentName && <div>Department Name: {enterprise.departmentName}</div>}
                                            {enterprise.departmentEmail && <div>
                                                Department Email:{" "}
                                                <span className='email-click'
                                                    onClick={handleOpenEmailClient}>{enterprise.departmentEmail}</span>
                                            </div>}
                                            {enterprise.departmentHeadName && <div>Department Head Name: {enterprise.departmentHeadName}</div>}
                                            {(answer?.isMail === true || selectedEnterpriseMessage !== "") ? <Button className="enterprise-info-button" onClick={() => {
                                                setSelectedEnterprise(enterprise.enterpriseName);
                                                handleSendEmail(enterprise);
                                            }}
                                                disabled={(!answer?.isMail === true || selectedEnterpriseMessage !== "")}>Click here to send message to Enterprise</Button> : null}
                                        </div>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </List>
                    {answer.enterpriseSelections && answer.enterpriseSelections.length >=1 && <Typography className='demo-enterprise-Typography enterprise-prompt-msg'>
                        Use the prompt: “Connect” to engage contact with this enterprise
                    </Typography>}
                    {selectedEnterprise && (
                        <Typography className="send-email-message">
                            {selectedEnterpriseMessage === "" ? <CircularProgress size={24} /> : selectedEnterpriseMessage}
                        </Typography>
                    )}
                </Paper>
            </Box>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </>
    );
};

export default DemoEnterpriseChat;
