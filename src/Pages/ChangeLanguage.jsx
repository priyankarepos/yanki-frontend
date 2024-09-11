import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Typography, Snackbar, CircularProgress  } from '@mui/material';
import './Style.scss';
import LinkBehavior from '../Components/Helpers/LinkBehavior';
import { Link, useNavigate } from 'react-router-dom';
import YankiLogo from '../Assets/images/yanki-logo2.png';
import CheckCircleIcon from '../Assets/images/Checkbox.svg';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { apiUrls, classNames, messages } from '../Utils/stringConstant/stringConstant';
import { languages } from '../Utils/functions/uiFunctions';

const ChangeLanguage = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const [selectedLanguage, setSelectedLanguage] = useState(languages[0].code);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchUserLanguage = async () => {
            try {
                const response = await axios.get(apiUrls.getUserLanguage);
                const userLanguage = response.data.language;
                const matchedLanguage = languages.find(lang => lang.name.toLowerCase() === userLanguage.toLowerCase());
                if (matchedLanguage) {
                    setSelectedLanguage(matchedLanguage.code);
                }
                localStorage.setItem('i18nextLng', matchedLanguage.code);
            } catch (error) {
                setSnackbarMessage(t('errorFetchingLanguage'));
                setSnackbarOpen(true);
            } finally {
                setLoading(false); 
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
            localStorage.setItem(messages.i18nextLng, selectedLanguage);
            setSnackbarMessage(t('languageChangedSuccess'));
            setSnackbarOpen(true);
            navigate('/');
        } catch (error) {
            setSnackbarMessage(t('errorUpdatingLanguage'));
            setSnackbarOpen(true);
        }
    };

    return (
        <Container>
            <Box className={classNames.flexCenter}>
                <Box className={classNames.changeLanguageBox}>
                    <Typography className={`${classNames.profileLogo} ${classNames.textCenter} ${classNames.minusMargin}`} onClick={() => navigate('/')}>
                        <img src={YankiLogo} className={classNames.profileYankiLogo} alt={classNames.language} />
                    </Typography>
                    {loading ? ( 
                        <Box className={classNames.loaderContainer}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <h2 className={`${classNames.marginBottom34} ${classNames.textCenter}`}>
                                {t('selectLanguage')}
                            </h2>
                            {languages.map((language) => (
                                <Button
                                    className={classNames.bold}
                                    variant={messages.outlined}
                                    key={language.code}
                                    disableRipple 
                                    onClick={() => handleLanguageSelect(language)}
                                >
                                    {language.lang}{' '}
                                    {selectedLanguage === language.code && (
                                        <span>
                                            <img src={CheckCircleIcon} alt={classNames.language} />
                                        </span>
                                    )}
                                </Button>
                            ))}
                            <Button
                                variant={messages.buttonContainedVarient}
                                fullWidth
                                className={`${classNames.marginBottom20} ${classNames.textCenter} ${classNames.bold}`}
                                type={classNames.submit}
                                onClick={handleChangeLanguage}
                            >
                                <strong>{t('changeLanguage')}</strong>
                            </Button>
                            <Link to="/" component={LinkBehavior} underline="none" variant="body1">
                                <div className= {`${classNames.colorWhite} ${classNames.textCenter} ${classNames.cursorPointer}`}>{t('cancelButton')}</div>
                            </Link>
                        </>
                    )}
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
