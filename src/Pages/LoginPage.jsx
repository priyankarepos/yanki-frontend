import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";

import MailOutlineIcon from "@mui/icons-material/MailOutline";
import HttpsOutlinedIcon from "@mui/icons-material/HttpsOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

import { useForm, Controller } from "react-hook-form";
import { emailRegex } from "../Utils/validations/validation";
import LinkBehavior from "../Components/Helpers/LinkBehavior";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Context } from "../App";
import { useGoogleLogin } from "@react-oauth/google";
import "./Style.scss";
import GoogleIcon from "@mui/icons-material/Google";
import { Snackbar, useMediaQuery } from "@mui/material";
import { apiUrls, classNames, messages } from "../Utils/stringConstant/stringConstant";
import { startConnection } from "../SignalR/signalRService";
import { useTranslation } from 'react-i18next';
import { languages } from "../Utils/functions/uiFunctions";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [loginErrorMsg, setLoginErrorMsg] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const { activeTab } = useContext(Context);
  const { t, i18n } = useTranslation();

  const recipientEmail = "hello@yanki.ai";
  const emailSubject = "Email subject";
  const emailBody = "Email body";

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem(messages.i18nextLng, code);
  };

  const handleChangeLanguage = async () => {
    try {
      const response = await axios.get(apiUrls.getUserLanguage);
      const languageName = response.data.language;
      const languageObj = languages.find((lang) => lang.name === languageName);
      i18n.changeLanguage(languageObj.code);
      localStorage.setItem(messages.i18nextLng, languageObj.code);
    } catch (err) {
      setSnackbarMessage(err.message);
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    const storedLanguage = localStorage.getItem(messages.i18nextLng);
    if (storedLanguage) {
      i18n.changeLanguage(storedLanguage);
    }
  }, [i18n]);

  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      logInEmail: "",
      logInPassword: "",
      logInRemeber: false,
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoginLoading(true);
      const dataToSend = {
        email: data.logInEmail,
        password: data.logInPassword,
        userType: activeTab === 0 ? "User" : "Enterprise",
      };
      const response = await axios.post(apiUrls.login, dataToSend);

      if (response.status === 200) {
        if (!data.logInRemeber) {
          window.sessionStorage.setItem(
            import.meta.env.VITE_APP_SESSIONSTORAGE_REFRESH,
            JSON.stringify(true)
          );
        }
        window.localStorage.setItem(
          import.meta.env.VITE_APP_LOCALSTORAGE_REMEMBER,
          JSON.stringify(data.logInRemeber)
        );
        window.localStorage.setItem(
          import.meta.env.VITE_APP_LOCALSTORAGE_TOKEN,
          JSON.stringify(response.data.contentResponse)
        );
        if (activeTab === 0) {
          handleChangeLanguage();
        }
        startConnection();
        navigate("/");
      }
    } catch (e) {
      setLoginLoading(false);
      setLoginError(true);
      if (e?.response?.data?.message && activeTab === 0) {
        setLoginErrorMsg(e?.response?.data?.message);
      } else {
        if (
          e?.response?.data?.message ===
          `${t('emailNotRegistered')}` &&
          activeTab === 1
        ) {
          setLoginErrorMsg(
            <span>
              This email isn't registered. Please sign up to become a Yanki
              partner. Contact us at{" "}
              <Link href="mailto:hello@yanki.ai" color="inherit">
                hello@yanki.ai
              </Link>
            </span>
          );
        } else {
          setLoginErrorMsg(`${activeTab === 0 ? `${t('somethingWentWrong')}` : "Something went wrong"}`);
          setLoginErrorMsg(e?.response?.data?.message);
        }
      }
    }
  };

  const onSuccess = async (codeResponse) => {
    try {
      setLoginLoading(true);
      const { access_token } = codeResponse;
      const response = await axios.post(apiUrls.verifyGoogleAccessToken, { access_token });
      if (response.status === 200) {
        window.localStorage.setItem(
          import.meta.env.VITE_APP_LOCALSTORAGE_TOKEN,
          JSON.stringify(response.data.contentResponse)
        );
        if (activeTab === 0) {
          handleChangeLanguage();
        }
        startConnection();
        navigate("/");
      } else {
        setLoginError(true);
        setLoginErrorMsg(`${activeTab === 0 ? `${t('authenticationFailed')}` : "Authentication failed."}`);
      }
    } catch (error) {
      setLoginError(true);
      setLoginErrorMsg(`${activeTab === 0 ? `${t('somethingWentWrong')}` : "Something went wrong"}`);
    } finally {
      setLoginLoading(false);
    }
  };

  const login = useGoogleLogin({
    onSuccess,
  });

  return (
    <>
      <Container maxWidth="xl">
        <Box className="flex justify-center items-center min-h-70-screen">
          <Box sx={{ maxWidth: "360px", width: { sm: "360px" } }}>
            <Box className="w-full object-contain flex items-center justify-center marginY-28">
              <RouterLink
                to="/auth"
                className="w-full object-contain flex items-center justify-center"
              >
                <img
                  src={
                    activeTab === 0
                      ? "/auth-logo-dark.svg"
                      : "/auth-logo-light.svg"
                  }
                  alt="logo"
                  width={messages.imgSize250}
                  height={messages.imgSize80}
                />
              </RouterLink>
            </Box>
            <Typography
              component="h1"
              variant="h5"
              className="text-center marginBottom-34 login-page-title"
            >
              {activeTab === 0 ? `${t('loginToYourAccount')}` : messages.loginYourAccountTitle}
            </Typography>
            <Controller
              control={control}
              name="logInEmail"
              rules={{
                required: {
                  value: true,
                  message: `${activeTab === 0 ? `${t('emailRequired')}` : "Email address is required."}`,
                },
                pattern: {
                  value: emailRegex,
                  message: `${activeTab === 0 ? `${t('enterValidEmailAddress')}` : "Enter valid email address."}`,
                },
              }}
              render={({ field }) => (
                <TextField
                  className={`marginBottom-10 ${activeTab === 1 ? "InputFieldColor" : ""
                    }`}
                  {...field}
                  type="outlined"
                  placeholder={t('emailAddress')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailOutlineIcon
                          style={{
                            color:
                              activeTab === 1 ? "#8bbae5" : "defaultIconColor",
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                  error={!!errors["logInEmail"]}
                  helperText={
                    errors["logInEmail"] ? errors["logInEmail"].message : ""
                  }
                  disabled={loginLoading}
                />
              )}
            />
            <Controller
              control={control}
              name="logInPassword"
              rules={{
                required: {
                  value: true,
                  message: `${activeTab === 0 ? `${t('passwordRequired')}` : "Password is required"}`,
                },
              }}
              render={({ field }) => (
                <TextField
                  className={activeTab === 1 ? "InputFieldColor" : ""}
                  {...field}
                  style={{
                    color: activeTab === 1 ? "#8bbae5" : "defaultIconColor",
                  }}
                  type="outlined"
                  placeholder={activeTab === 0 ? `${t('password')}` : "Password"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HttpsOutlinedIcon
                          style={{
                            color:
                              activeTab === 1 ? "#8bbae5" : "defaultIconColor",
                          }}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOffOutlinedIcon
                              style={{
                                color:
                                  activeTab === 1
                                    ? "#8bbae5"
                                    : "defaultIconColor",
                              }}
                            />
                          ) : (
                            <VisibilityOutlinedIcon
                              style={{
                                color:
                                  activeTab === 1
                                    ? "#8bbae5"
                                    : "defaultIconColor",
                              }}
                            />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                    type: showPassword ? "text" : "password",
                  }}
                  fullWidth
                  error={!!errors["logInPassword"]}
                  helperText={
                    errors["logInPassword"]
                      ? errors["logInPassword"].message
                      : ""
                  }
                  disabled={loginLoading}
                />
              )}
            />
            <Box className="flex justify-between items-center w-full marginY-15">
              <FormControlLabel
                style={{
                  color: activeTab === 1 ? "#8bbae5" : "defaultIconColor",
                }}
                control={
                  <Controller
                    control={control}
                    name="logInRemeber"
                    render={({ field }) => <Checkbox {...field} />}
                  />
                }
                label={activeTab === 0 ? `${t('rememberMe')}` : "Remember me"}
              />
              <Link
                to="/forgot-password"
                component={LinkBehavior}
                underline="none"
                variant="body2"
                style={{
                  color: activeTab === 1 ? "#8bbae5" : "defaultIconColor",
                }}
              >
                {activeTab === 0 ? `${t('forgotPassword')}` : "Forgot Password?"}
              </Link>
            </Box>

            {loginError && (
              <Alert severity="error" className="marginBottom-10">
                {loginErrorMsg}
              </Alert>
            )}

            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit(onSubmit)}
              disabled={loginLoading}
              className="login-page-login-button"
            >
              {loginLoading ? <CircularProgress size="0.875rem" /> : `${activeTab === 0 ? `${t('login')}` : "Login"}`}
            </Button>
            <Divider className="marginY-28">{activeTab === 0 ? `${t('or')}` : "Or"}</Divider>
            {activeTab === 0 && (
              <Button
                onClick={() => login()}
                variant="outlined"
                className="google-button"
                fullWidth
              >
                <GoogleIcon className="googleIcon" />
                &nbsp;{activeTab === 0 ? `${t('google')}` : "Google"}
              </Button>
            )}
            <Box className="text-center marginTop-28">
              <Typography
                variant="subtitle1"
                display="block"
                gutterBottom
                style={{
                  color: activeTab === 1 ? "#8bbae5" : "defaultIconColor",
                }}
              >
                {activeTab === 0 ? `${t('dontHaveAnAccount')}` : "Don't have an account?"}{" "}
                <Link
                  to={activeTab === 1 ? "/enterprise-signup" : "/signup"}
                  component={LinkBehavior}
                  underline="none"
                >
                  <span
                    className="font-bold cursor-pointer"
                    style={{
                      color: activeTab === 1 ? "#13538b" : "defaultIconColor",
                    }}
                  >
                    {activeTab === 0 ? t('signup') : 'Signup'}
                  </span>
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
        {activeTab === 0 && <Box className={classNames.homePageLanguageBtn}>
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
          <Link
            to="/terms-of-use"
            className="linkStyle"
            component={LinkBehavior}
          >
            {activeTab === 0 ? `${t('termsOfUse')}` : "Terms of Use"}
          </Link>
          <Link
            to="/privacy-policy"
            className="linkStyle marginX-10"
            component={LinkBehavior}
          >
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </>
  );
};

export default LoginPage;
