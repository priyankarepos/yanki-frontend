import { Box, Typography, List, Button, Paper, Grid, CircularProgress } from '@mui/material';
import React, { useState } from 'react';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import axios from 'axios';
import "./AnswerStyle.scss";

const DemoEnterpriseChat = ({ answer }) => {

    const [selectedEnterprise, setSelectedEnterprise] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [selectedEnterpriseMessage, setSelectedEnterpriseMessage] = useState("");
    const handleSendEmail = async (enterprise) => {
        try {
            const requestData = {
                enterpriseName: enterprise?.enterpriseName,
                enterpriseEmail: enterprise?.enterpriseEmail,
                departmentName: enterprise?.departmentName,
                departmentEmail: enterprise?.departmentEmail,
            };

            const response = await axios.post(`${process.env.REACT_APP_API_HOST}/api/yanki-ai/send-mail-to-enterprise`,
                requestData);
            if (response.status === 200) {
                const message = `Your message has been sent to ${enterprise?.enterpriseName}. The organization administrator will contact you directly if needed.`;
                setChatMessages([...chatMessages, message]);
                setSelectedEnterpriseMessage(response.data.message);
            } else if (response.data && response.data.isSuccess === false) {
                setSelectedEnterpriseMessage("Invalid email. Please provide a valid email address.");
            }
        } catch (error) {
            console.error('Error sending email:', error);
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
        console.log("phoneNumber", phoneNumber);
        if (phoneNumber && phoneNumber.trim() !== "") {
            window.location.href = `tel:${phoneNumber}`;
        } else {
            console.error("Phone number is not valid or empty.", phoneNumber);
        }
    };
    return (
        <Box className="demo-enterprise-wrapper">
            <Paper elevation={3}>
                <div style={{ padding: '0px' }}>
                    <List style={{ display: 'flex' }}>
                        <InsertCommentIcon fontSize="small" style={{ marginRight: '8px', color: "#fff", marginTop: "5px", }} />
                        <Typography style={{ fontSize: "16px", color: "#fff" }}>
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
                                        {enterprise.website && <div>Website: {enterprise.website}</div>}
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
                                            disabled={(!answer?.isMail === true || selectedEnterpriseMessage !== "")}>Click here to send message to Enterprise</Button> : <></>}
                                    </div>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </List>
                {selectedEnterprise && (
                    <Typography className="send-email-message">
                        {selectedEnterpriseMessage === "" ? <CircularProgress size={24} /> : selectedEnterpriseMessage}
                    </Typography>
                )}
            </Paper>
        </Box>
    );
};

export default DemoEnterpriseChat;
