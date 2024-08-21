import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Typography, Snackbar, Alert } from '@mui/material';
import './Style.scss';
import LinkBehavior from '../Components/Helpers/LinkBehavior';
import { Link, useNavigate } from 'react-router-dom';
import YankiLogo from '../Assets/images/yanki-logo2.png';
import CheckCircleIcon from '../Assets/images/Checkbox.svg';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { apiUrls } from '../Utils/stringConstant/stringConstant';

const ChangeLanguage = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const languages = [
        { code: 'en', lang: 'English', name: 'English' },
        { code: 'he', lang: 'עברית', name: 'Hebrew' },
        { code: 'es', lang: 'Español', name: 'Spanish' },
        { code: 'yi', lang: 'ייִדיש', name: 'Yiddish' },
    ];

    const [selectedLanguage, setSelectedLanguage] = useState(languages[0].code);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        const fetchUserLanguage = async () => {
            try {
                const response = await axios.get(apiUrls.getUserLanguage);
                const userLanguage = response.data.language;
                const matchedLanguage = languages.find(lang => lang.name.toLowerCase() === userLanguage.toLowerCase());
                if (matchedLanguage) {
                    setSelectedLanguage(matchedLanguage.code);
                }
            } catch (error) {
                setSnackbarMessage(t('errorFetchingLanguage'));
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
            await axios.put(apiUrls.updateUserLanguage, {
                language: selectedLang,
            });
            i18n.changeLanguage(selectedLanguage);
            setSnackbarMessage(t('languageChangedSuccess'));
            setSnackbarOpen(true);
            navigate('/');
        } catch (error) {
            setSnackbarMessage(t('errorUpdatingLanguage'));
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
