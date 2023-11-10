import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import { Context, ThemeModeContext } from "../App";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import partnershipLogoDarkOne from "../Assets/images/myZmanim-dark.png"
import partnershipLogoLightOne from "../Assets/images/myZmanim-light.png"
import useMediaQuery from "@mui/material/useMediaQuery";
import "./Style.scss"
    
const linkStyle = {
  color: "#457bac",
  fontSize: "15px",
  textDecoration: "none",
  paddingRight: "20px",
  borderRight: "1px solid #457bac",
};

const NewTitlePage = () => {
  const { themeMode } = useContext(ThemeModeContext);
  const { setActiveTab, activeTab } = useContext(Context);

  const navigate = useNavigate();

  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  const handleChangeTab = (event, newValue) => {
    sessionStorage.setItem('activeTab', newValue.toString());
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
  }

  const partnershipLogos = [
    { id: 1, imageSrcDark: partnershipLogoDarkOne, imageSrcLight: partnershipLogoLightOne, altText: "Partner 1" },
    { id: 2, imageSrc: "partner2.png", altText: "Partner 2" },
    { id: 3, imageSrc: "partner3.png", altText: "Partner 3" },
    { id: 4, imageSrc: "partner4.png", altText: "Partner 4" },
    { id: 5, imageSrc: "partner5.png", altText: "Partner 5" },
    { id: 6, imageSrc: "partner6.png", altText: "Partner 6" },
    { id: 7, imageSrc: "partner7.png", altText: "Partner 7" },
    { id: 8, imageSrc: "partner8.png", altText: "Partner 8" },
    // Add more partnership logos as needed
  ];

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
    },
  };


  return (
    <>
      <Container maxWidth="xl" sx={{backgroundColor : activeTab === 0 ? "#063762" : "#fff", paddingBottom: "15px",}}>
        <Box className="flex justify-center items-center min-h-70-screen">
          <Box sx={{ maxWidth: 520 }}>
            <img
              src={activeTab === 0 ? "/auth-logo-dark.svg" : "/auth-logo-light.svg"}
              alt="logo"
              style={{
                width: "100%",
                maxWidth: isLargeScreen ? "250px" : "200px",
                marginLeft: "auto",
                marginRight: "auto",
                display: "block",
                marginBottom: "30px",
                marginTop: "20px",
              }}
            />
            <Typography
              variant="body1"
              component="h1"
              sx={{ textAlign: "center", fontWeight: "bold", color: "#72a9de", }}
            >
              The internet by the Halacha,<br />
              A smart chatbot for all your Jewish lifestyle and community needs
            </Typography>
            <Box sx={{ marginTop: "30px" }}>
              <Tabs
                value={activeTab}
                onChange={handleChangeTab}
                indicatorColor="primary"
                textColor="primary"
                centered
                className="tabStyle"
              >
                <Tab label="User" sx={{ fontWeight: 'bold', color: activeTab === 0 ? "#72a9de" : '' , }} style={{color: "#72a9de",}} />
                <Tab label="Enterprise" sx={{ fontWeight: 'bold', color: activeTab === 1 ? "#72a9de" : '' , }} style={{color: "#72a9de",}} />
              </Tabs>
              {activeTab === 0 && (
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  maxWidth: "400px",
                  marginTop: "30px",
                  marginX: "auto"
                }}>
                  <Button
                    variant="outlined"
                    sx={{ marginY: { xs: "10px" } }}
                    onClick={onLoginClick}
                    style={{backgroundColor: "#13538b", color: "lightblue"}}
                  >
                    Login
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{ marginY: { xs: "10px" } }}
                    onClick={onSignupClick}
                    style={{backgroundColor: "#13538b", color: "lightblue"}}
                  >
                    Sign up
                  </Button>
                </Box>
              )}
              {activeTab === 1 && (
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  maxWidth: "400px",
                  marginTop: "30px",
                  marginX: "auto"
                }}>
                  <Button
                    variant="outlined"
                    sx={{ marginY: { xs: "10px" } }}
                    onClick={onLoginClick}
                    style={{backgroundColor: "#13538b", color: "lightblue", border:"1px solid lightblue",}}
                  >
                    Login
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{ marginY: { xs: "10px" } }}
                    onClick={onEnterpriseSignupClick}
                    style={{backgroundColor: "#13538b", color: "lightblue", border:"1px solid lightblue",}}
                  >
                    Enterprise Sign up
                  </Button>
                </Box>
              )}
            </Box>
            <Box sx={{ marginTop: "50px" }}>
              <Typography
                variant="body1"
                sx={{ textAlign: "center", marginBottom: "30px", color: !themeMode ? "#fff" : "#72a9de", }}
              >
                In Partnership With :
              </Typography>
              <Carousel
                responsive={responsive}
                swipeable={true}
                draggable={false}
                showDots={false}
                arrows={false}
                autoPlay={true}
                autoPlaySpeed={2000}
                infinite={true}
              >
                {partnershipLogos.map((partner) => (
                  <div key={partner.id}>
                    <img
                      src={
                        themeMode === "dark"
                          ? partner.imageSrcDark
                          : partner.imageSrcLight
                      }
                      alt={partner.altText}
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  </div>
                ))}
              </Carousel>
            </Box>
          </Box>
        </Box>
        <Box sx={{ textAlign: "center", marginY: "20px" }}>
          <Link to="/terms-of-use" style={linkStyle}>
            Terms of Use
          </Link>
          <Link to="/privacy-policy" style={{ ...linkStyle, marginRight: "20px", marginLeft: "20px", }}>
            Privacy Policy
          </Link>
          <Link to="/" style={{ ...linkStyle, borderRight: "none" }}>
            hello@yanki.ai
          </Link>
        </Box>
      </Container>
    </>
  );
};

export default NewTitlePage;
