import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ThemeModeContext } from "../App";

const SigninSuccessPage = () => {
  const { themeMode } = useContext(ThemeModeContext);

  const navigate = useNavigate();

  const onLoginClick = () => {
    navigate("/login");
  };

  return (
    <>
      <Container maxWidth="xl">
        <Box className="flex justify-center items-center h-screen">
          <Box
            sx={{
              maxWidth: "394px",
              width: { sm: "394px" },
              textAlign: "center",
            }}
          >
            <img
              src={
                themeMode === "dark"
                  ? "/mail-sent-dark.svg"
                  : "/mail-sent-light.svg"
              }
              alt="logo"
              style={{
                maxWidth: "185px",
                marginLeft: "auto",
                marginRight: "auto",
                display: "block",
                marginBottom: "30px",
              }}
            />
            <Typography
              component="h1"
              variant="h5"
              sx={{ marginBottom: "16px" }}
            >
              Verify your email address
            </Typography>

            <Typography variant="body2" sx={{ marginBottom: "50px" }}>
              Your account has been successfully registered. To complete the
              process please cheek your email for a validation request.
            </Typography>

            <Button variant="contained" onClick={onLoginClick}>
              Back to log in
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default SigninSuccessPage;
