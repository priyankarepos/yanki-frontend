import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ThemeModeContext } from "../App";

const TitlePage = () => {
  const { themeMode } = useContext(ThemeModeContext);

  const navigate = useNavigate();

  const onSigninClick = () => {
    navigate("/signin");
  };

  const onLoginClick = () => {
    navigate("/login");
  };

  return (
    <>
      <Container maxWidth="xl">
        <Box className="flex justify-center items-center min-h-70-screen">
          <Box sx={{ maxWidth: 520 }}>
            <img
              src={
                themeMode === "dark"
                  ? "/auth-logo-dark.svg"
                  : "/auth-logo-light.svg"
              }
              alt="logo"
              style={{
                width: "100%",
                maxWidth: "310px",
                marginLeft: "auto",
                marginRight: "auto",
                display: "block",
                marginBottom: "30px",
              }}
            />
            <Typography
              variant="body1"
              component="h1"
              sx={{ textAlign: "center", fontWeight: "bold" }}
            >
              Discover Jewish Wisdom: Delve into the depths of the Torah,
              glimpse into history, and embrace the rich tapestry of Jewish
              thought in every interaction.
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: { xs: "center", sm: "space-evenly" },
                alignItems: "center",
                marginY: { sm: "36px" },
              }}
            >
              <Button
                variant="outlined"
                sx={{ marginY: { xs: "10px" } }}
                onClick={onLoginClick}
              >
                Login
              </Button>
              <Button
                variant="outlined"
                sx={{ marginY: { xs: "10px" } }}
                onClick={onSigninClick}
              >
                Signin
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default TitlePage;
