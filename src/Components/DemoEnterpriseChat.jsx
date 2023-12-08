import { Box, Typography, List, Button, Paper, Grid, CircularProgress } from '@mui/material';
import React, { useState } from 'react';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import axios from 'axios';

const DemoEnterpriseChat = ({ answer }) => {

    const [selectedEnterprise, setSelectedEnterprise] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [selectedEnterpriseMessage, setSelectedEnterpriseMessage] = useState("");

    const handleSendEmail = async (enterprise) => {
        try {
            // Prepare the request data
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
                // setIsSendMail(true)
                console.log("response.data.message", response.data.message);
            }
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };


    return (
        <Box>
            <Paper elevation={3} style={{ backgroundColor: "#002d55", marginBottom: "10px", padding: "10px", paddingLeft: "20px", paddingRight: "20px", }}>
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
                                <Button
                                    style={{
                                        backgroundColor: "#2f587d",
                                        color: "#fff",
                                        padding: "12px",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        display: "flex",
                                        width: "100%",
                                        justifyContent: "flex-start",
                                        alignItems: "center",
                                        height: "auto",
                                        textAlign: "left",
                                        textTransform: "none",
                                        marginLeft: "0px",
                                    }}
                                    onClick={() => {
                                        setSelectedEnterprise(enterprise.enterpriseName);
                                        handleSendEmail(enterprise);
                                    }}
                                    disabled={(!answer?.isMail === true || selectedEnterpriseMessage !=="" )}
                                >
                                    <div>
                                        {enterprise.enterpriseName && <div>Enterprise Name: {enterprise.enterpriseName}</div>}
                                        {enterprise.enterpriseEmail && <div>Enterprise Email: <span style={{ color: "#b9deff" }}>{enterprise.enterpriseEmail}</span></div>}
                                        {enterprise.enterpriseAddress && <div>Enterprise Address: {enterprise.enterpriseAddress}</div>}
                                        {enterprise.website && <div>Website: {enterprise.website}</div>}
                                        {enterprise.enterprisePhoneNumber && <div>Enterprise Phone: {enterprise.enterprisePhoneNumber}</div>}
                                        {enterprise.departmentName && <div>Department Name: {enterprise.departmentName}</div>}
                                        {enterprise.departmentEmail && <div>Department Email: <span style={{ color: "#b9deff" }}>{enterprise.departmentEmail}</span></div>}
                                        {enterprise.departmentHeadName && <div>Department Head Name: {enterprise.departmentHeadName}</div>}
                                        {(answer?.isMail === true || selectedEnterpriseMessage !=="")? <strong style={{backgroundColor: "#063762", padding: "3px",fontSize: "12px",marginTop: "15px", display: "inline-block",}}>Click here to send message to Enterprise</strong> : <></>}
                                    </div>
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </List>
                {selectedEnterprise &&  (
                    <Typography style={{ fontSize: "16px", padding: "10px", color: "#fff" }}>
                        {selectedEnterpriseMessage==="" ? <CircularProgress size={24} style={{color:"#fff"}} /> : selectedEnterpriseMessage}
                    </Typography>
                )}
            </Paper>
        </Box>
    );
};

export default DemoEnterpriseChat;
