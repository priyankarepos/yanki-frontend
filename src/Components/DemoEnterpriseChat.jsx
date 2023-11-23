import { Box, Typography, List, Button, Paper, Grid } from '@mui/material';
import React, { useState } from 'react';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import axios from 'axios';

const DemoEnterpriseChat = ({ answer }) => {
    console.log("answer", answer);
    const [selectedEnterprise, setSelectedEnterprise] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [selectedEnterpriseMessage, setSelectedEnterpriseMessage] = useState("");
    console.log("selectedEnterpriseMessage",selectedEnterpriseMessage);

    const handleSendEmail = async (enterprise) => {
        console.log("enterprise", enterprise);
        try {
            // Prepare the request data
            const requestData = {
                enterpriseName: enterprise?.enterpriseName,
                enterpriseEmail: enterprise?.enterpriseEmail,
                departmentName: enterprise?.departmentName,
                departmentEmail: enterprise?.departmentEmail,
            };

            // Make a POST request to the API
            const response = await axios.post(`${process.env.REACT_APP_API_HOST}/api/yanki-ai/send-mail-to-enterprise`,
                requestData);

            if (response.status === 200) {
                const message = `Your message has been sent to ${enterprise?.enterpriseName}. The organization administrator will contact you directly if needed.`;
                setChatMessages([...chatMessages, message]);

                // Display the response message in the component
                setSelectedEnterpriseMessage(response.data.message);
                console.log("response.data.message",response.data.message);
            }
        } catch (error) {
            console.error('Error sending email:', error);
            // Handle error as needed
        }
    };


    return (
        <Box>
            {/* <Paper elevation={3} style={{ marginBottom: "10px", backgroundColor: "#1d4a72" }}>
                <div style={{ padding: "10px" }}>
                    <List style={{ display: 'flex', alignItems: 'center' }}>
                        <ChatBubbleIcon fontSize="small" style={{ marginRight: '8px', color: "#fff" }} />
                        <Typography style={{ fontSize: "18px", color: "#fff" }}>{answer.message}</Typography>
                    </List>
                </div>
            </Paper> */}
            {/* <Paper elevation={3} style={{ marginBottom: "10px", backgroundColor: "#1d4a72" }}>
                <div style={{ padding: '12px' }}>
                    <List style={{ display: 'flex', alignItems: 'center' }}>
                        <InsertCommentIcon fontSize="small" style={{ marginRight: '8px', color: "#fff" }} />
                        <Typography style={{ fontSize: "18px", color: "#fff" }}>
                            {answer.message}
                        </Typography>
                    </List>
                </div>
            </Paper> */}
            <Paper elevation={3} style={{ backgroundColor: "#002d55", marginBottom: "10px", padding: "10px", paddingLeft: "20px", paddingRight: "20px",}}>
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
                                    disabled={selectedEnterpriseMessage !== ""}
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
                                    </div>
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </List>
                {selectedEnterprise && (
                    <Typography style={{ fontSize: "16px", padding: "10px", color: "#fff" }}>
                        {selectedEnterpriseMessage}
                    </Typography>
                )}
            </Paper>
        </Box>
    );
};

export default DemoEnterpriseChat;
