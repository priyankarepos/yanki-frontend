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

const PrivacyPolicy = () => {
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
                            sx={{ marginBottom: "25px" }}
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
                            Privacy Policy
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
                            This privacy policy describes how Yanki AI ("we" or "our") collects, uses, and shares personal information provided by users ("you"). This policy applies to all interactions with our chatbot and related services.
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
                            Information We Collect
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
                            In order to provide our services, we may ask you to provide certain personal information such as your name, email address, phone number, location, interests, and other demographic information. We only collect information that you voluntarily provide to us through conversations with our chatbot.
                        </Typography>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                marginBottom: "4px",
                                textAlign: "left",
                                fontSize: "16px",
                                lineHeight: "1.6",
                                fontWeight: "700",
                                color: activeTab === 0 ? "#fff" : "#6fa8dd",
                            }}
                        >
                            How We Use Information
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
                            We use the personal information you provide in the following ways:
                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        <FiberManualRecordIcon style={{fontSize: "14px", color: activeTab === 0 ? "#fff" : "#6fa8dd",}} />
                                    </ListItemIcon>
                                    To provide our chatbot services and respond to your requests and
                                    questions
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <FiberManualRecordIcon style={{fontSize: "14px", color: activeTab === 0 ? "#fff" : "#6fa8dd",}} />
                                    </ListItemIcon>
                                    To customize and personalize your experience with our chatbot
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <FiberManualRecordIcon style={{fontSize: "14px", color: activeTab === 0 ? "#fff" : "#6fa8dd",}} />
                                    </ListItemIcon>
                                    To improve our chatbot capabilities through testing and analysis of
                                    conversations
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <FiberManualRecordIcon style={{fontSize: "14px", color: activeTab === 0 ? "#fff" : "#6fa8dd",}} />
                                    </ListItemIcon>
                                    To send you administrative communications, service announcements, and
                                    other information about our chatbot and services
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <FiberManualRecordIcon style={{fontSize: "14px", color: activeTab === 0 ? "#fff" : "#6fa8dd",}} />
                                    </ListItemIcon>
                                    To anonymize personal information for statistical analysis and machine
                                    learning to improve our models
                                </ListItem>
                            </List>
                        </Typography>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                marginBottom: "4px",
                                textAlign: "left",
                                fontSize: "16px",
                                lineHeight: "1.6",
                                fontWeight: "700",
                                color: activeTab === 0 ? "#fff" : "#6fa8dd",
                            }}
                        >
                            Information Sharing and Disclosure
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
                            We do not sell your personal information to third parties. However, we may share your personal information with third party service providers we work with to assist in providing our services. This may include sharing your information with:
                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        <FiberManualRecordIcon style={{fontSize: "14px", color: activeTab === 0 ? "#fff" : "#6fa8dd",}} />
                                    </ListItemIcon>
                                    Cloud hosting services and IT service providers to store information
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <FiberManualRecordIcon style={{fontSize: "14px", color: activeTab === 0 ? "#fff" : "#6fa8dd",}} />
                                    </ListItemIcon>
                                    Virtual assistants or bots integrated into our chatbot to provide additional services
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <FiberManualRecordIcon style={{fontSize: "14px", color: activeTab === 0 ? "#fff" : "#6fa8dd",}} />
                                    </ListItemIcon>
                                    Marketing platforms to send communications on our behalf
                                </ListItem>
                            </List>
                            We may also be required to disclose personal information if required by law, subpoena, or court order.
                        </Typography>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                marginBottom: "4px",
                                textAlign: "left",
                                fontSize: "16px",
                                lineHeight: "1.6",
                                fontWeight: "700",
                                color: activeTab === 0 ? "#fff" : "#6fa8dd",
                            }}
                        >
                            Data Retention
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
                            We will retain your personal information for as long as you continue to use our chatbot. If you request that your account be deleted, we will delete your information within 30 days.
                        </Typography>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                marginBottom: "4px",
                                textAlign: "left",
                                fontSize: "15px",
                                lineHeight: "1.6",
                                fontWeight: "700",
                                color: activeTab === 0 ? "#fff" : "#6fa8dd",
                            }}
                        >
                            Your Rights
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
                            You have the right to request access to the personal information we hold about you. You also have the right to request that we correct your information if you believe it is inaccurate or outdated.
                        </Typography>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                marginBottom: "4px",
                                textAlign: "left",
                                fontSize: "16px",
                                lineHeight: "1.6",
                                fontWeight: "700",
                                color: activeTab === 0 ? "#fff" : "#6fa8dd",
                            }}
                        >
                            Changes to this Policy
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
                            We may occasionally update this privacy policy to comply with law or reflect changes to our data practices. Any changes will be reflected here immediately.
                        </Typography>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                marginBottom: "4px",
                                textAlign: "left",
                                fontSize: "16px",
                                lineHeight: "1.6",
                                fontWeight: "700",
                                color: activeTab === 0 ? "#fff" : "#6fa8dd",
                            }}
                        >
                            Contact Us
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
                            If you have any questions about this privacy policy or your rights, please contact us at <strong>
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
                            By using our chatbot, you acknowledge that you have read and understood this privacy policy.
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

export default PrivacyPolicy;
