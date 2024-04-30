import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import { ThemeModeContext } from "../App";
import { Link as RouterLink } from "react-router-dom";
import "./Style.scss";

const PasswordEmailSentpage = () => {
  const { themeMode } = useContext(ThemeModeContext);

  return (
    <>
      <Container maxWidth="xl">
        <Box className="flex justify-center items-center min-h-70-screen">
          <Box sx={{ maxWidth: "360px", width: { sm: "360px" } }}>
            <Box className="w-full object-contain flex items-center justify-center marginBottom-156">
              <RouterLink
                to="/auth"
                className="w-full object-contain flex items-center justify-center"
              >
                <img
                  src={
                    themeMode === "dark"
                      ? "/auth-logo-dark.svg"
                      : "/auth-logo-light.svg"
                  }
                  alt="logo"
                  className="yanki-logo-image"
                />
              </RouterLink>
            </Box>
            <img
              src={themeMode === "dark" ? "/tick-dark.svg" : "/tick-light.svg"}
              alt="logo"
              className="email-sent-logo"
            />
            <Typography variant="h5" className="marginBottom-10 text-center">
              Mail sent successfully
            </Typography>
            <Typography variant="subtitle2" className="text-center">
              Please follow instructions in email to reset password.
            </Typography>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default PasswordEmailSentpage;
