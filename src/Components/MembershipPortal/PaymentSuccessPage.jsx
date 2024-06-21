import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { ThemeModeContext } from "../../App";
import "./PaymentSuccessPage.scss";

const PaymentSuccessPage = () => {
    const { themeMode } = useContext(ThemeModeContext);
    const navigate = useNavigate();

    const onGoToHome = () => {
        navigate("/", { replace: true });
    };

    return (
        <Container maxWidth="xl">
            <Box className="payment-success-container">
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
                        You are now upgraded!
                    </Typography>
                    <Typography
                        variant="body1"
                        className="message"
                    >
                        Start enjoying all Yanki’s premium features.
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

export default PaymentSuccessPage;
