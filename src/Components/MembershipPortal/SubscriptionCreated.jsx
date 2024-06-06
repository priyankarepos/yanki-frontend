import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { ThemeModeContext } from "../../App";
import "./PaymentSuccessPage.scss";

const SubscriptionCreatedPage = () => {
    const { themeMode } = useContext(ThemeModeContext);
    const navigate = useNavigate();

    const onGoToHome = () => {
        navigate("/", { replace: true });
    };

    const onClickAICustomization = () => {
        navigate("/ai-customization");
    };

    return (
        <Container maxWidth="xl">
            <Box className="payment-success-container subscribe-success-container">
                <Box className="payment-success-box">
                    <Box className="logo-container">
                        <img
                            src={
                                themeMode === "dark"
                                    ? "/auth-logo-dark.svg"
                                    : "/auth-logo-light.svg"
                            }
                            alt="logo"
                            className="logo"
                        />
                    </Box>
                    <Typography
                        variant="h5"
                        component="h1"
                        className="title"
                    >
                        Welcome to Yanki!
                    </Typography>
                    <Typography
                        variant="body1"
                        className="message"
                    >
                        Your account has been successfully created.
                    </Typography>
                    <Typography
                        variant="body1"
                        className="subscribe-model-question"
                    >
                        What's Next?
                    </Typography>
                    <Typography
                        variant="body1"
                        className="subscribe-model-ans"
                    >
                        To tailor your Yanki experience to your needs, please complete our optional AI questionnaire. Your answers will help us provide you with highly accurate and personalized services.
                    </Typography>
                    <Typography
                        variant="body1"
                        className="subscribe-model-question"
                    >
                        Get Started with AI Customization
                    </Typography>
                    <Typography className="subscribe-link">
                        <span onClick={onClickAICustomization}>
                            AI Customization
                        </span>
                    </Typography>
                    <Typography
                        variant="body1"
                        className="subscribe-model-question"
                    >
                        Not Now, Continue to Home
                    </Typography>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={onGoToHome}
                        className="button"
                    >
                        Continue to Home
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default SubscriptionCreatedPage;
