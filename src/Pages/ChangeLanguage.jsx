import React, { useState } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import "./Style.scss"
import LinkBehavior from '../Components/Helpers/LinkBehavior';
import { Link, useNavigate } from 'react-router-dom';
import YankiLogo from "../Assets/images/yanki-logo2.png"
import CheckCircleIcon from "../Assets/images/Checkbox.svg"
import { messages } from '../Utils/stringConstant/stringConstant';

const languages = [
    { label: 'English', value: 'en' },
    { label: 'Hebrew', value: 'he' },
    { label: 'Yiddish', value: 'yi' },
    { label: 'Spanish', value: 'es' },
];

const ChangeLanguage = () => {
    const navigate = useNavigate();
    const [selectedLanguage, setSelectedLanguage] = useState(
        localStorage.getItem('userLanguage') || languages[0].value
    );

    const handleClick = (language) => {
        setSelectedLanguage(language.value);
        localStorage.setItem('userLanguage', language.value);
    };

    return (
        <>
            <Container maxWidth="xl">
                <Box className="flex justify-center items-center min-h-70-screen">
                    <Box className="change-language-box" sx={{ maxWidth: "360px", width: { sm: "360px" } }}>
                        <Typography className="profile-logo text-center minus-margin" onClick={() => navigate("/")}>
                            <img
                                src={YankiLogo}
                                width={messages.imgSize200}
                                height={messages.imgSize150}
                                alt="logo"
                            />
                        </Typography>
                        <Typography component="h1"
                            variant="h5"
                            className="text-center marginBottom-34">
                            Select Language
                        </Typography>
                        {languages.map((language) => (
                            <Button
                            className='bold'
                                variant="outlined"
                                key={language.value}
                                onClick={() => handleClick(language)}
                            >
                                {language.label} {selectedLanguage === language.value && <span><img src={CheckCircleIcon} alt='language' /></span>}
                            </Button>
                        ))}
                        <Button
                            variant="contained"
                            fullWidth
                            className="marginBottom-20 text-center bold"
                            type="submit"
                        >
                            <strong>Change Language</strong>
                        </Button>
                        <Link
                            to="/"
                            component={LinkBehavior}
                            underline="none"
                            variant="body1"
                        >
                            <div className="text-center cursor-pointer color-white">Cancel</div>
                        </Link>
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default ChangeLanguage;