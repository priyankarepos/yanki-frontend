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
        <Box className="flex justify-center items-center min-h-70-screen">
          <Box
            className="text-center"
            sx={{
              maxWidth: "394px",
              width: { sm: "394px" },
            }}
          >
            <img
              src={
                themeMode === "dark"
                  ? "/mail-sent-dark.svg"
                  : "/mail-sent-light.svg"
              }
              alt="logo"
              className="email-sent-logo"
            />
            <Typography
              component="h1"
              variant="h5"
              className="marginBottom-16"
            >
              Verify your email address
            </Typography>

            <Typography variant="body2" className="marginBottom-50">
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
