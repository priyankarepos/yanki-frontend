import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import { Context, ThemeModeContext } from "../App";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import "react-multi-carousel/lib/styles.css";
import partnershipLogoLightOne from "../Assets/images/partnet-logo4.png";
import partnershipLogoLightTwo from "../Assets/images/partnet-logo1.png";
import partnershipLogoLightThree from "../Assets/images/partnet-logo2.png";
import partnershipLogoLightFour from "../Assets/images/isItKosher.png";
import partnershipLogoLightFive from "../Assets/images/partnet-logo5.png";
import partnershipLogoLightSix from "../Assets/images/partnet-logo6.png";
import partnershipLogoLightSeven from "../Assets/images/partnet-logo7.png";
import partnershipLogoLightEight from "../Assets/images/partnet-logo8.png";
import partnershipLogoLightNine from "../Assets/images/partnet-logo9.png";
import partnershipLogoLightTen from "../Assets/images/partnet-logo10.png";
import useMediaQuery from "@mui/material/useMediaQuery";
import "./Style.scss";
import { classNames, messages } from "../Utils/stringConstant/stringConstant";
import { useTranslation } from 'react-i18next';

const NewTitlePage = () => {
  const { themeMode } = useContext(ThemeModeContext);
  const { setActiveTab, activeTab } = useContext(Context);
  const { t, i18n } = useTranslation();

  const languages = [
    { code: 'en', lang: 'English'},
    { code: 'he', lang: 'עברית'},
    { code: 'es', lang: 'Español'},
    { code: 'yi', lang: 'ייִדיש'},
  ];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
  };

  const recipientEmail = "hello@yanki.ai";
  const emailSubject = "Email subject";
  const emailBody = "Email body";

  const navigate = useNavigate();

  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  const handleChangeTab = (event, newValue) => {
    localStorage.setItem(messages.activeTab, newValue.toString());
    setActiveTab(newValue);
  };

  const onSignupClick = () => {
    navigate("/signup");
  };

  const onLoginClick = () => {
    navigate("/login");
  };

  const onEnterpriseSignupClick = () => {
    navigate("/enterprise-signup");
  };

  const partnershipLogos = [
    { id: 1, imageSrc: partnershipLogoLightOne, altText: "Partner" },
    { id: 2, imageSrc: partnershipLogoLightTwo, altText: "Partner" },
    { id: 3, imageSrc: partnershipLogoLightThree, altText: "Partner" },
    { id: 4, imageSrc: partnershipLogoLightFour, altText: "Partner" },
    { id: 5, imageSrc: partnershipLogoLightFive, altText: "Partner" },
    { id: 6, imageSrc: partnershipLogoLightSix, altText: "Partner" },
    { id: 7, imageSrc: partnershipLogoLightSeven, altText: "Partner" },
    { id: 8, imageSrc: partnershipLogoLightEight, altText: "Partner" },
    { id: 9, imageSrc: partnershipLogoLightNine, altText: "Partner" },
    { id: 10, imageSrc: partnershipLogoLightTen, altText: "Partner" },
    // Add more partnership logos as needed
  ];

  return (
    <>
      <Container maxWidth="xl">
        <Box className="flex justify-center items-center min-h-70-screen">
          <Box className="new-title-container">
            <img
              src={
                activeTab === 0 ? "/auth-logo-dark.svg" : "/auth-logo-light.svg"
              }
              alt="logo"
              className="new-title-yanki-logo"
              width={messages.imgSize250}
              height={messages.imgSize80}
            />
            {activeTab === 0 ? <Typography
              variant="body1"
              component="h1"
              className="new-title-heading"
            >
              {t('mainTagline')}
              <br />
              {t('findData')}
            </Typography> : <Typography
              variant="body1"
              component="h1"
              className="new-title-heading"
            >
              AI to do Mitzvos easier than ever
              <br />
              Find useful data and have your AI-powered personal Jewish
              assistant
            </Typography>}
            <Box sx={{ marginTop: isLargeScreen ? "30px" : "20px" }}>
              <Tabs
                value={activeTab}
                onChange={handleChangeTab}
                indicatorColor="primary"
                textColor="primary"
                centered
                className="tabStyle"
              >
                <Tab label={activeTab === 0 ? t('user') : 'User'} className="new-title-tab" />
                <Tab label={activeTab === 0 ? t('enterprise') : 'Enterprise'} className="new-title-tab" />
              </Tabs>
              {activeTab === 0 && (
                <Box className="new-title-active-tab-container">
                  <Button
                    variant="outlined"
                    sx={{ marginY: { xs: "10px" } }}
                    onClick={onLoginClick}
                    className="new-title-dark-theme"
                  >
                    {t('login')}
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{ marginY: { xs: "10px" } }}
                    onClick={onSignupClick}
                    className="new-title-dark-theme"
                  >
                    {t('signup')}
                  </Button>
                </Box>
              )}
              {activeTab === 1 && (
                <Box className="new-title-active-tab-container">
                  <Button
                    variant="outlined"
                    sx={{ marginY: { xs: "10px" } }}
                    onClick={onLoginClick}
                    className="new-title-light-theme"
                  >
                    Login
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{ marginY: { xs: "10px" } }}
                    onClick={onEnterpriseSignupClick}
                    className="new-title-light-theme"
                  >
                    Sign up
                  </Button>
                </Box>
              )}
            </Box>
            <Box sx={{ marginTop: isLargeScreen ? "50px" : "30px" }}>
              <Typography
                variant="body1"
                className="new-title-partnership"
                sx={{
                  color: !themeMode ? "#fff" : "#72a9de",
                  fontSize: isLargeScreen ? "1rem" : "0.9rem",
                }}
              >
                {activeTab === 0 ? t('inPartnershipWith') : 'In Partnership With :'}
              </Typography>
              <Box className="partnership-logos-container">
                {partnershipLogos.map((partner) => (
                  <img
                    key={partner.id}
                    src={partner.imageSrc}
                    alt={partner.altText}
                    className="margin-10"
                    width={messages.imgSize70}
                    height={messages.imgSize70}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
        {activeTab===0 &&<Box className={classNames.homePageLanguageBtn}>
          {languages.map(({ code, lang }) => (
            <a
              key={code}
              onClick={() => changeLanguage(code)}
              variant={messages.text}
              className={`${classNames.languageSwitcherButton} ${
                i18n.language === code ? classNames.activeLanguage : ""
              }`}
            >
              {lang}
            </a>
          ))}
        </Box>}
        <Box
          className="text-center"
          sx={{ marginY: isLargeScreen ? "20px" : "10px" }}
        >
          <Link to="/terms-of-use" className="linkStyle">
          {activeTab===0 ? `${t('termsOfUse')}` : "Terms of Use"}
          </Link>
          <Link to="/privacy-policy" className="linkStyle marginX-10">
            {activeTab === 0 ? t('privacyPolicy') : "Privacy Policy"}
          </Link>
          <Typography variant="caption">
            <a
              className="linkStyle new-title-email"
              href={`mailto:${recipientEmail}?subject=${emailSubject}&body=${emailBody}`}
              target="_blank"
              rel="noreferrer"
            >
              hello@yanki.ai
            </a>
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default NewTitlePage;
