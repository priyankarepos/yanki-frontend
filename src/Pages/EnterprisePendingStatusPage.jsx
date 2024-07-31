import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ThemeModeContext } from "../App";
import "./PagesStyle.scss";

const EnterprisePendingStatusPage = () => {
  const { themeMode } = useContext(ThemeModeContext);

  const navigate = useNavigate();

  const onGoToHome = () => {
    navigate("/", { replace: true });
  };

  const yankiUser = window.localStorage.getItem(
    import.meta.env.VITE_APP_LOCALSTORAGE_TOKEN
  );

  let parsedUserObject;

  try {
    if (yankiUser) {
      parsedUserObject = JSON.parse(yankiUser);
    }
  } catch (e) {
    parsedUserObject = undefined;
  }

  const userStatus = parsedUserObject?.userObject?.status || "";

  return (
    <>
      <Container maxWidth="xl">
        <Box className="flex justify-center items-center min-h-screen">
          <Box sx={{ maxWidth: "800px", width: { sm: "800px" } }}>
            <Box className="w-full object-contain flex items-center justify-center marginBottom-110 ">
              <img
                src={
                  themeMode === "dark"
                    ? "/auth-logo-dark.svg"
                    : "/auth-logo-light.svg"
                }
                alt="logo"
                className="enterprise-yanki-logo-image"
              />
            </Box>
            {userStatus === "Pending" && (
              <Typography
                variant="h5"
                component="h1"
                className="enterprise-pending-message"
              >
                Your request to be authorized as a Yanki enterprise is being
                reviewed, expect an email shortly. In the meantime, you can use
                Yanki to explore its features with the same access
              </Typography>
            )}

            {userStatus === "Rejected" && (
              <Typography
                variant="h5"
                component="h1"
                className="enterprise-rejected-message"
              >
                Request not approved <br />
                Thank You
              </Typography>
            )}
            <Box className="enterprise-status">
              <Button variant="contained" onClick={onGoToHome}>
                Go to home
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default EnterprisePendingStatusPage;
