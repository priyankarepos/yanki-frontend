import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { ThemeModeContext } from "../../App";
import "./PaymentSuccessPage.scss";
import { useTranslation } from "react-i18next";

const SubscriptionCreatedPage = () => {
    const { t } = useTranslation();
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
                        {t('welcomeToYanki')}
                    </Typography>
                    <Typography
                        variant="body1"
                        className="message"
                    >
                        {t('accountCreated')}
                    </Typography>
                    <Typography
                        variant="body1"
                        className="subscribe-model-question"
                    >
                        {t('whatsNext')}
                    </Typography>
                    <Typography
                        variant="body1"
                        className="subscribe-model-ans"
                    >
                        {t('aiQuestionnaire')}
                    </Typography>
                    <Typography
                        variant="body1"
                        className="subscribe-model-question"
                    >
                        {t('startAICustomization')}
                    </Typography>
                    <Typography className="subscribe-link">
                        <span onClick={onClickAICustomization}>
                        {t('aiCustomization')}
                        </span>
                    </Typography>
                    <Typography
                        variant="body1"
                        className="subscribe-model-question"
                    >
                        {t('notNowContinueHome')}
                    </Typography>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={onGoToHome}
                        className="button"
                    >
                        {t('continueToHome')}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default SubscriptionCreatedPage;
