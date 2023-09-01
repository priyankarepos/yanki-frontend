import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { ThemeModeContext } from "../App";

const ActiveAccountPage = () => {
  const [activating, setActivating] = useState(false);
  const [errorOnActive, setErrorOnActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const [activationDone, setActivationDone] = useState(false);

  const { themeMode } = useContext(ThemeModeContext);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const gotoLogin = () => {
    navigate("/login", { replace: true });
  };

  const runActivitingAccount = useCallback(async () => {
    try {
      setActivating(true);
      const queryParamsObj = Object.fromEntries([...searchParams]);
      const url = `${process.env.REACT_APP_API_HOST}/api/Auth/verify-email`;
      const configs = {
        method: "get",
        url,
        "Content-Type": "application/json",
      };
      configs.params = {
        userId: queryParamsObj.userId,
        token: queryParamsObj.token,
      };
      const response = await axios.request(configs);
      if (response.status === 200) {
        setActivating(false);
        setActivationDone(true);
        setErrorOnActive(false);
        setErrorMsg("");
      }
    } catch (e) {
      setActivating(false);
      setErrorOnActive(true);
      if (e.response.data) {
        setErrorMsg(e.response.data);
      } else {
        setErrorMsg("Something went wrong");
      }
    }
  }, [searchParams]);

  useEffect(() => {
    runActivitingAccount();
  }, [runActivitingAccount]);

  return (
    <>
      <Container maxWidth="xl">
        <Box className="flex justify-center items-center h-screen">
          <Box sx={{ maxWidth: "360px", width: { sm: "360px" } }}>
            <Box className="w-full object-contain flex items-center justify-center marginY-54">
              <img
                src={
                  themeMode === "dark"
                    ? "/auth-logo-dark.svg"
                    : "/auth-logo-light.svg"
                }
                alt="logo"
                style={{ width: "60%" }}
              />
            </Box>
            <Typography
              component="h1"
              variant="h5"
              sx={{ marginBottom: "34px" }}
              className="text-center marginBottom-34"
            >
              {activating
                ? "Activating your account"
                : activationDone
                ? "Account Activated"
                : "Account Activation Failed. Try Again."}
            </Typography>
            {activating && (
              <Box className="text-center">
                <CircularProgress />
              </Box>
            )}
            {errorOnActive && (
              <>
                <Alert severity="error" sx={{ mb: 2 }}>
                  {JSON.stringify(errorMsg)}
                </Alert>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={runActivitingAccount}
                >
                  Try Again
                </Button>
              </>
            )}
            {activationDone && (
              <Button variant="contained" fullWidth onClick={gotoLogin}>
                Go to Login
              </Button>
            )}
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default ActiveAccountPage;
