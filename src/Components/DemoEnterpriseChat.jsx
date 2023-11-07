import { Box, Typography, List, Button, Paper, Grid } from '@mui/material';
import React, { useState } from 'react';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import axios from 'axios';

const DemoEnterpriseChat = ({ answer }) => {
    const [selectedEnterprise, setSelectedEnterprise] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [selectedEnterpriseMessage, setSelectedEnterpriseMessage] = useState("");

    const handleSendEmail = async (enterprise) => {
        console.log("enterprise", enterprise);
        try {
            // Prepare the request data
            const requestData = {
                enterpriseName: enterprise?.enterpriseName,
                enterpriseEmail: enterprise.email,
            };

            // Make a POST request to the API
            const response = await axios.post(`${process.env.REACT_APP_API_HOST}/api/yanki-ai/send-mail-to-enterprise`,
                requestData);

            if (response.status === 200) {
                const message = `Your message has been sent to ${enterprise?.enterpriseName}. The organization administrator will contact you directly if needed.`;
                setChatMessages([...chatMessages, message]);

                // Display the response message in the component
                setSelectedEnterpriseMessage(response.data.message);
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
            <Paper elevation={3} style={{ marginBottom: "10px", backgroundColor: "#1d4a72" }}>
                <div style={{ padding: '12px' }}>
                    <List style={{ display: 'flex', alignItems: 'center' }}>
                        <InsertCommentIcon fontSize="small" style={{ marginRight: '8px', color: "#fff" }} />
                        <Typography style={{ fontSize: "18px", color: "#fff" }}>
                        {answer.message}
                        </Typography>
                    </List>
                </div>
            </Paper>
            <Paper elevation={3} style={{ backgroundColor: "#002d55", marginBottom: "10px", padding: "15px", }}>
                <List>
                    <Grid container spacing={2}>
                        {answer.enterprises.map((enterprise) => (
                            <Grid item xs={12} sm={6} md={6} key={enterprise.id}>
                                <Button
                                    style={{
                                        backgroundColor: "#2f587d",
                                        color: "#fff",
                                        padding: "15px",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        display: "flex",
                                        width: "100%",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        justifyContent: "flex-start",
                                        alignItems: "center",
                                        minHeight: "90px",
                                        textAlign: "left",
                                        textTransform: "capitalize",
                                    }}
                                    onClick={() => {
                                        setSelectedEnterprise(enterprise.enterpriseName);
                                        handleSendEmail(enterprise);
                                    }}
                                    disabled={selectedEnterpriseMessage !== ""}
                                >
                                    <div>
                                        <div>Name: {enterprise.enterpriseName}</div>
                                        <div style={{ color: "#4984b9" }}>Email: {enterprise.email}</div>
                                        <div>Address: {enterprise.address}</div>
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
