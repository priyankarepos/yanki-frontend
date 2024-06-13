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
import partnershipLogoLightFour from "../Assets/images/partnet-logo3.png";
import partnershipLogoLightFive from "../Assets/images/partnet-logo5.png";
import useMediaQuery from "@mui/material/useMediaQuery";
import "./Style.scss";

const NewTitlePage = () => {
  const { themeMode } = useContext(ThemeModeContext);
  const { setActiveTab, activeTab } = useContext(Context);

  const recipientEmail = "hello@yanki.ai";
  const emailSubject = "Email subject";
  const emailBody = "Email body";

  const navigate = useNavigate();

  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  const handleChangeTab = (event, newValue) => {
    sessionStorage.setItem("activeTab", newValue.toString());
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
    { id: 1, imageSrc: partnershipLogoLightOne, altText: "Partner 1" },
    { id: 2, imageSrc: partnershipLogoLightTwo, altText: "Partner 2" },
    { id: 3, imageSrc: partnershipLogoLightThree, altText: "Partner 3" },
    { id: 4, imageSrc: partnershipLogoLightFour, altText: "Partner 4" },
    { id: 4, imageSrc: partnershipLogoLightFive, altText: "Partner 5" },
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
              style={{
                maxWidth: isLargeScreen ? "250px" : "200px",
              }}
            />
            <Typography
              variant="body1"
              component="h1"
              className="new-title-heading"
            >
              AI to do Mitzvos easier than ever
              <br />
              Find useful data and have your AI-powered personal Jewish
              assistant
            </Typography>
            <Box sx={{ marginTop: isLargeScreen ? "30px" : "20px" }}>
              <Tabs
                value={activeTab}
                onChange={handleChangeTab}
                indicatorColor="primary"
                textColor="primary"
                centered
                className="tabStyle"
              >
                <Tab label="User" className="new-title-tab" />
                <Tab label="Enterprise" className="new-title-tab" />
              </Tabs>
              {activeTab === 0 && (
                <Box className="new-title-active-tab-container">
                  <Button
                    variant="outlined"
                    sx={{ marginY: { xs: "10px" } }}
                    onClick={onLoginClick}
                    className="new-title-dark-theme"
                  >
                    Login
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{ marginY: { xs: "10px" } }}
                    onClick={onSignupClick}
                    className="new-title-dark-theme"
                  >
                    Sign up
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
                In Partnership With :
              </Typography>
              <Box className="partnership-logos-container">
                {partnershipLogos.map((partner) => (
                  <img
                    key={partner.id}
                    src={partner.imageSrc}
                    alt={partner.altText}
                    className="margin-15"
                    style={{
                      maxWidth: isLargeScreen ? "150px" : "120px",
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          className="text-center"
          sx={{ marginY: isLargeScreen ? "20px" : "10px" }}
        >
          <Link to="/terms-of-use" className="linkStyle">
            Terms of Use
          </Link>
          <Link to="/privacy-policy" className="linkStyle marginX-10">
            Privacy Policy
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
