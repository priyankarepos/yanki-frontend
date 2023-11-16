import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { Context } from "../App";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import "./Style.scss";
import { Link as RouterLink } from "react-router-dom";


const linkStyle = {
    color: "#fff",
    fontSize: "15px",
    textDecoration: "none",
    paddingRight: "10px",
    borderRight: "1px solid #457bac",
};

const TermsOfUse = () => {
    const { activeTab } = React.useContext(Context);

    const navigate = useNavigate();

    const onGoToHome = () => {
        navigate("/", { replace: true });
    };

    const recipientEmail = "hello@yanki.ai";
    const emailSubject = "Email subject";
    const emailBody = "Email body";

    return (
        <>
            <Container maxWidth="xl" className="privacy-policy">
                <Box className="flex justify-center items-center min-h-screen" sx={{ padding: 2 }}>
                    <Box sx={{
                        maxWidth: "800px",
                        width: { xs: "100%", sm: "80%" },
                        margin: "auto",
                    }}>
                        <Box
                            className="w-full object-contain flex items-center justify-center"
                            sx={{ marginBottom: "15px" }}
                        >
                            <RouterLink
                                to="/auth"
                                className="w-full object-contain flex items-center justify-center"
                            >
                                <img
                                    src={
                                        activeTab === 0
                                            ? "/auth-logo-dark.svg"
                                            : "/auth-logo-light.svg"
                                    }
                                    alt="logo"
                                    style={{width: "auto"}}
                                />
                            </RouterLink>
                        </Box>
                        <Typography
                            variant="h4"
                            component="div"
                            sx={{
                                marginBottom: "15px",
                                textAlign: "left",
                                lineHeight: "1.6",
                                fontWeight: "700",
                                fontSize: "22px",
                                color: activeTab === 0 ? "#fff" : "#6fa8dd",
                            }}
                        >
                            Terms and Conditions
                        </Typography>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                marginBottom: "10px",
                                textAlign: "left",
                                fontSize: "15px",
                                lineHeight: "1.6",
                                color: "#6fa8dd",
                            }}
                        >
                            Terms and Conditions Policy for Yanki AI's Smart Chatbot
                        </Typography>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                marginBottom: "10px",
                                textAlign: "left",
                                fontSize: "15px",
                                lineHeight: "1.6",
                                color: "#6fa8dd",
                            }}
                        >
                            Last Updated: November 16, 2023
                        </Typography>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                marginBottom: "10px",
                                textAlign: "left",
                                fontSize: "15px",
                                lineHeight: "1.6",
                                color: "#6fa8dd",
                            }}
                        >
                            Welcome to Yanki AI's smart chatbot! Before using our chatbot, please carefully review the following terms and conditions ("Terms") that govern your use of the chatbot. By accessing and using our chatbot, you agree to these Terms, which form a binding agreement between you and Yanki AI.
                        </Typography>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                marginBottom: "10px",
                                textAlign: "left",
                                fontSize: "16px",
                                lineHeight: "1.6",
                                fontWeight: "700",
                                color: activeTab === 0 ? "#fff" : "#6fa8dd",
                            }}
                        >
                            1. Acceptance of Terms
                        </Typography>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                marginBottom: "10px",
                                textAlign: "left",
                                fontSize: "15px",
                                lineHeight: "1.6",
                                color: "#6fa8dd",
                            }}
                        >
                            By using our smart chatbot, you agree to comply with these Terms and our Privacy Policy. If you do not agree with these Terms, you are not authorized to use our chatbot.
                        </Typography>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                marginBottom: "10px",
                                textAlign: "left",
                                fontSize: "16px",
                                lineHeight: "1.6",
                                fontWeight: "700",
                                color: activeTab === 0 ? "#fff" : "#6fa8dd",
                            }}
                        >
                            2. Use of Chatbot
                        </Typography>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                marginBottom: "10px",
                                textAlign: "left",
                                fontSize: "15px",
                                lineHeight: "1.6",
                                color: "#6fa8dd",
                            }}
                        >
                            You may use the chatbot for the purposes permitted by these Terms. By using the chatbot, you grant Yanki AI the right to use any content that you submit via the chatbot as necessary to provide the service to you.
                        </Typography>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                marginBottom: "10px",
                                textAlign: "left",
                                fontSize: "16px",
                                lineHeight: "1.6",
                                fontWeight: "700",
                                color: activeTab === 0 ? "#fff" : "#6fa8dd",
                            }}
                        >
                            3. User Responsibilities
                        </Typography>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                marginBottom: "10px",
                                textAlign: "left",
                                fontSize: "15px",
                                lineHeight: "1.6",
                                color: "#6fa8dd",
                            }}
                        >
                            When using the chatbot, you agree that you will not:
                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        <FiberManualRecordIcon style={{fontSize: "14px", color: activeTab === 0 ? "#fff" : "#6fa8dd",}} />
                                    </ListItemIcon>
                                    Acquire any intellectual property right or the content accessible on and originating from the chatbot.
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <FiberManualRecordIcon style={{fontSize: "14px", color: activeTab === 0 ? "#fff" : "#6fa8dd",}} />
                                    </ListItemIcon>
                                    Work around any technical limitations of the chatbot.
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <FiberManualRecordIcon style={{fontSize: "14px", color: activeTab === 0 ? "#fff" : "#6fa8dd",}} />
                                    </ListItemIcon>
                                    Modify, reverse engineer, or otherwise alter the chatbot.
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <FiberManualRecordIcon style={{fontSize: "14px", color: activeTab === 0 ? "#fff" : "#6fa8dd",}} />
                                    </ListItemIcon>
                                    Use the chatbot in any way prohibited by law, regulation, governmental order, or decree.
                                </ListItem>
                            </List>
                        </Typography>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                marginBottom: "10px",
                                textAlign: "left",
                                fontSize: "16px",
                                lineHeight: "1.6",
                                fontWeight: "700",
                                color: activeTab === 0 ? "#fff" : "#6fa8dd",
                            }}
                        >
                            4. User Personal Data Responsibilities
                        </Typography>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                marginBottom: "10px",
                                textAlign: "left",
                                fontSize: "15px",
                                lineHeight: "1.6",
                                color: "#6fa8dd",
                            }}
                        >
                            You acknowledge and agree that Yanki AI may utilize your information to provide customized services and may share your information with third parties to offer better services, in compliance with the California Consumer Privacy Act (CCPA).
                        </Typography>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                marginBottom: "10px",
                                textAlign: "left",
                                fontSize: "16px",
                                lineHeight: "1.6",
                                fontWeight: "700",
                                color: activeTab === 0 ? "#fff" : "#6fa8dd",
                            }}
                        >
                            5. Disclaimer of Warranties
                        </Typography>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                marginBottom: "10px",
                                textAlign: "left",
                                fontSize: "15px",
                                lineHeight: "1.6",
                                color: "#6fa8dd",
                            }}
                        >
                            The chatbot is provided "as is" and "as available" with no representations or warranties of any kind, either expressed or implied, including but not limited to, the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
                        </Typography>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                marginBottom: "10px",
                                textAlign: "left",
                                fontSize: "16px",
                                lineHeight: "1.6",
                                fontWeight: "700",
                                color: activeTab === 0 ? "#fff" : "#6fa8dd",
                            }}
                        >
                            6. Limitation of Liability
                        </Typography>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                marginBottom: "10px",
                                textAlign: "left",
                                fontSize: "15px",
                                lineHeight: "1.6",
                                color: "#6fa8dd",
                            }}
                        >
                            Yanki AI shall not be liable for any direct, indirect, incidental, special, or consequential damages arising out of the use or inability to use the chatbot.
                        </Typography>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                marginBottom: "10px",
                                textAlign: "left",
                                fontSize: "16px",
                                lineHeight: "1.6",
                                fontWeight: "700",
                                color: activeTab === 0 ? "#fff" : "#6fa8dd",
                            }}
                        >
                            7. Governing Law
                        </Typography>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                marginBottom: "10px",
                                textAlign: "left",
                                fontSize: "15px",
                                lineHeight: "1.6",
                                color: "#6fa8dd",
                            }}
                        >
                            These Terms are governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law principles.
                        </Typography>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                marginBottom: "10px",
                                textAlign: "left",
                                fontSize: "16px",
                                lineHeight: "1.6",
                                fontWeight: "700",
                                color: activeTab === 0 ? "#fff" : "#6fa8dd",
                            }}
                        >
                            8. Changes to Terms
                        </Typography>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                marginBottom: "10px",
                                textAlign: "left",
                                fontSize: "15px",
                                lineHeight: "1.6",
                                color: "#6fa8dd",
                            }}
                        >
                            Yanki AI reserves the right to modify or replace these Terms at any time. It is your responsibility to review these Terms periodically for changes.
                        </Typography>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                marginBottom: "10px",
                                textAlign: "left",
                                fontSize: "16px",
                                lineHeight: "1.6",
                                fontWeight: "700",
                                color: activeTab === 0 ? "#fff" : "#6fa8dd",
                            }}
                        >
                            9. Third-Party Sharing
                        </Typography>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                marginBottom: "10px",
                                textAlign: "left",
                                fontSize: "15px",
                                lineHeight: "1.6",
                                color: "#6fa8dd",
                            }}
                        >
                            By using our smart chatbot, you grant us permission to share non-personal, aggregated, or de-identified information with third parties to improve and optimize our services. Your personal information will not be shared without explicit consent.
                        </Typography>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                marginBottom: "10px",
                                textAlign: "left",
                                fontSize: "16px",
                                lineHeight: "1.6",
                                fontWeight: "700",
                                color: activeTab === 0 ? "#fff" : "#6fa8dd",
                            }}
                        >
                            10. Termination of Service
                        </Typography>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                marginBottom: "10px",
                                textAlign: "left",
                                fontSize: "15px",
                                lineHeight: "1.6",
                                color: "#6fa8dd",
                            }}
                        >
                            Yanki AI reserves the right to suspend or terminate the services provided by the Smart Chatbot at any time, for any reason, without notice.
                        </Typography>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                marginBottom: "10px",
                                textAlign: "left",
                                fontSize: "16px",
                                lineHeight: "1.6",
                                fontWeight: "700",
                                color: activeTab === 0 ? "#fff" : "#6fa8dd",
                            }}
                        >
                            11. Contact Information
                        </Typography>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                marginBottom: "10px",
                                textAlign: "left",
                                fontSize: "15px",
                                lineHeight: "1.6",
                                color: "#6fa8dd",
                            }}
                        >
                            If you have any questions about these Terms, please contact us at <strong>
                                <a style={{ ...linkStyle, borderRight: "none" }}
                                    href={`mailto:${recipientEmail}?subject=${emailSubject}&body=${emailBody}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    hello@yanki.ai
                                </a>
                            </strong>
                        </Typography>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                marginBottom: "10px",
                                textAlign: "left",
                                fontSize: "15px",
                                lineHeight: "1.6",
                                color: "#6fa8dd",
                            }}
                        >
                            By using our smart chatbot, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.
                        </Typography>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                marginBottom: "10px",
                                textAlign: "left",
                                fontSize: "15px",
                                lineHeight: "1.6",
                                color: "#6fa8dd",
                            }}
                        >
                            Thank you for using Yanki AI's smart chatbot!
                        </Typography>
                        <Box style={{ width: "300px", margin: "auto", marginTop: "20px", marginBottom: "20px" }}>
                            <Button variant="contained" onClick={onGoToHome} style={{ width: "300px", margin: "auto" }}>
                                Go to home
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default TermsOfUse;
