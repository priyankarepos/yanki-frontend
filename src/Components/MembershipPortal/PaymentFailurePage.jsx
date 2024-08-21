import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { ThemeModeContext } from "../../App";
import "./PaymentFailurePage.scss"; 
import { useTranslation } from "react-i18next";

const PaymentFailurePage = () => {
    const { t } = useTranslation();
    const { themeMode } = useContext(ThemeModeContext);
    const navigate = useNavigate();

    const onGoToHome = () => {
        navigate("/", { replace: true });
    };

    return (
        <Container maxWidth="xl">
            <Box className="payment-failure-container">
                <Box className="payment-failure-box">
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
                        {t('paymentFailed')}
                    </Typography>
                    <Typography
                        variant="body1"
                        className="message"
                    >
                        {t('paymentErrorMessage')}
                    </Typography>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={onGoToHome}
                        className="button"
                    >
                        {t('goToHome')}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default PaymentFailurePage;
