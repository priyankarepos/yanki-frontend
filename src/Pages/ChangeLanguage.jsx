import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Typography, Snackbar, Alert } from '@mui/material';
import './Style.scss';
import LinkBehavior from '../Components/Helpers/LinkBehavior';
import { Link, useNavigate } from 'react-router-dom';
import YankiLogo from '../Assets/images/yanki-logo2.png';
import CheckCircleIcon from '../Assets/images/Checkbox.svg';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const ChangeLanguage = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const languages = [
        { code: 'en', lang: t('englishText'), name: 'English' },
        { code: 'he', lang: t('hebrewText'), name: 'Hebrew' },
        { code: 'es', lang: t('spanishText'), name: 'Spanish' },
        { code: 'yi', lang: t('yiddishText'), name: 'Yiddish' },
    ];

    const [selectedLanguage, setSelectedLanguage] = useState(languages[0].code);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        const fetchUserLanguage = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_API_HOST}/api/language-selection/get-user-language`);
                const userLanguage = response.data.language;
                const matchedLanguage = languages.find(lang => lang.name.toLowerCase() === userLanguage.toLowerCase());
                if (matchedLanguage) {
                    setSelectedLanguage(matchedLanguage.code);
                }
            } catch (error) {
                setSnackbarMessage(t('errorFetchingLanguage'));
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        };

        fetchUserLanguage();
    }, []);

    const handleLanguageSelect = (language) => {
        setSelectedLanguage(language.code);
    };

    const handleChangeLanguage = async () => {
        const selectedLang = languages.find(lang => lang.code === selectedLanguage).name;

        try {
            await axios.put(`${import.meta.env.VITE_APP_API_HOST}/api/language-selection/update-user-language`, {
                language: selectedLang,
            });
            i18n.changeLanguage(selectedLanguage);
            localStorage.setItem('userLanguage', selectedLanguage);
            setSnackbarMessage(t('languageChangedSuccess'));
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            navigate('/');
        } catch (error) {
            setSnackbarMessage(t('errorUpdatingLanguage'));
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    return (
        <Container maxWidth="xl">
            <Box className="flex justify-center items-center min-h-70-screen">
                <Box className="change-language-box" sx={{ maxWidth: '360px', width: { sm: '360px' } }}>
                    <Typography className="profile-logo text-center minus-margin" onClick={() => navigate('/')}>
                        <img src={YankiLogo} className="profile-yanki-logo" alt="logo" />
                    </Typography>
                    <Typography component="h1" variant="h5" className="text-center marginBottom-34">
                        {t('selectLanguage')}
                    </Typography>
                    {languages.map((language) => (
                        <Button
                            className="bold"
                            variant="outlined"
                            key={language.code}
                            onClick={() => handleLanguageSelect(language)}
                        >
                            {language.lang}{' '}
                            {selectedLanguage === language.code && (
                                <span>
                                    <img src={CheckCircleIcon} alt="language" />
                                </span>
                            )}
                        </Button>
                    ))}
                    <Button
                        variant="contained"
                        fullWidth
                        className="marginBottom-20 text-center bold"
                        type="submit"
                        onClick={handleChangeLanguage}
                    >
                        <strong>{t('changeLanguage')}</strong>
                    </Button>
                    <Link to="/" component={LinkBehavior} underline="none" variant="body1">
                        <div className="text-center cursor-pointer color-white">{t('cancelButton')}</div>
                    </Link>
                </Box>
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </Container>
    );
};

export default ChangeLanguage;
