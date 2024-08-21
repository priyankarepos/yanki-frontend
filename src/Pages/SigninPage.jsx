import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

import MailOutlineIcon from "@mui/icons-material/MailOutline";
import HttpsOutlinedIcon from "@mui/icons-material/HttpsOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import "./Style.scss";

import { useForm, Controller } from "react-hook-form";
import Link from "@mui/material/Link";
import {
  emailRegex,
  passwordRegex,
} from "../Utils/validations/validation";
import LinkBehavior from "../Components/Helpers/LinkBehavior";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { ThemeModeContext } from "../App";
import { useGoogleLogin } from "@react-oauth/google";
import GoogleIcon from "@mui/icons-material/Google";
import ReactPhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FormHelperText, Snackbar } from "@mui/material";
import { apiUrls, messages } from "../Utils/stringConstant/stringConstant";
import { useTranslation } from 'react-i18next';

const SigninPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [signinLoading, setSigninLoading] = useState(false);
  const [signinError, setSigninError] = useState(false);
  const [signinErrorMsg, setSigninErrorMsg] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { t, i18n } = useTranslation();
  const languages = [
    { code: 'en', lang: 'English', name: 'English' },
    { code: 'he', lang: 'עברית', name: 'Hebrew' },
    { code: 'es', lang: 'Español', name: 'Spanish' },
    { code: 'yi', lang: 'ייִדיש', name: 'Yiddish' },
];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
  };

  const recipientEmail = "hello@yanki.ai";
  const emailSubject = "Email subject";
  const emailBody = "Email body";

  const { themeMode } = useContext(ThemeModeContext);

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      signInName: "",
      signInEmail: "",
      signInPhone: "",
      signInPassword: "",
    },
  });

  useEffect(() => {
    setValue("signInPhone", "+44", { shouldValidate: false });
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      setSigninLoading(true);
      const dataToSend = {
        email: data.signInEmail,
        password: data.signInPassword,
        fullName: data.signInName,
        phoneNumber: data.signInPhone,
        userType: "User",
      };

      const response = await axios.post(apiUrls.registerUser, dataToSend);

      if (response.status === 200) {
        navigate("/signin-success");
      }
    } catch (e) {
      setSigninLoading(false);
      setSigninError(true);
      if (e?.response?.data?.message) {
        setSigninErrorMsg(e?.response?.data?.message);
      } else {
        setSigninErrorMsg(`${'somethingWentWrong'}`);
      }
    }
  };

  const onSuccess = async (codeResponse) => {
    try {
      setSigninLoading(true);
      const { access_token } = codeResponse;

      const response = await axios.post(apiUrls.verifyGoogleAccessToken, { access_token });

      if (response.status === 200) {
        navigate("/login");
      } else {
        setSigninError(true);
        setSigninErrorMsg(`${'authenticationFailed'}`);
      }
    } catch (error) {
      setSnackbarMessage("Error:", error);
      setSnackbarOpen(false);

      setSigninError(true);
      setSigninErrorMsg(`${'somethingWentWrong'}`);
    } finally {
      setSigninLoading(false);
    }
  };

  const login = useGoogleLogin({
    onSuccess,
  });

  return (
    <>
      <Container maxWidth="xl">
        <Box className="flex justify-center items-center min-h-70-screen">
          <Box
            sx={{ maxWidth: "360px", width: { sm: "360px" } }}
            className="user-signup"
          >
            <Box className="w-full object-contain flex items-center justify-center marginY-28">
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
                   width={messages.imgSize250}
                  height={messages.imgSize80}
                />
              </RouterLink>
            </Box>
            <Typography
              component="h1"
              variant="h5"
              className="text-center marginBottom-34"
            >
              Create your account
            </Typography>
            <Controller
              control={control}
              name="signInName"
              rules={{
                required: {
                  value: true,
                  message: `${t('fullNameRequired')}`,
                },
                minLength: {
                  value: 3,
                  message: `${t('fullNameMinLength')}`,
                },
                maxLength: {
                  value: 50,
                  message: `${t('fullNameMaxLength')}`,
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="outlined"
                  placeholder={t('fullName')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineIcon />
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                  className="marginBottom-10"
                  error={!!errors["signInName"]}
                  helperText={
                    errors["signInName"] ? errors["signInName"].message : ""
                  }
                  disabled={signinLoading}
                />
              )}
            />
            <Controller
              control={control}
              name="signInPhone"
              rules={{
                required: {
                  value: true,
                  message: `${t('phoneNumberRequired')}`,
                },
              }}
              render={({ field }) => (
                <div className="currentSignInPhone-style">
                  <ReactPhoneInput
                    inputExtraProps={{
                      name: field.name,
                      onBlur: field.onBlur,
                    }}
                    value={field.value}
                    preferredCountries={["us", "il", "gb", "ca", "mx"]}
                    placeholder="Phone number"
                    onChange={(value, country, event) => {
                      field.onChange(value);
                    }}
                    onBlur={() => field.onBlur()}
                    error={!!errors["signInPhone"]}
                    className="ReactPhoneInput-style"
                    style={{
                      border: errors["signInPhone"]
                        ? "1px solid #ffc9c9"
                        : "1px solid rgb(114, 169, 222)",
                    }}
                  />
                  {errors["signInPhone"] && (
                    <FormHelperText className="signinpage-phone-error">
                      {errors["signInPhone"].message}
                    </FormHelperText>
                  )}
                </div>
              )}
            />
            <Controller
              control={control}
              name="signInEmail"
              rules={{
                required: {
                  value: true,
                  message: `${t('emailRequired')}`,
                },
                pattern: {
                  value: emailRegex,
                  message: `${t('enterValidEmailAddress')}`,
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="outlined"
                  placeholder={t('emailAddress')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailOutlineIcon />
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                  className="marginBottom-10"
                  error={!!errors["signInEmail"]}
                  helperText={
                    errors["signInEmail"] ? errors["signInEmail"].message : ""
                  }
                  disabled={signinLoading}
                />
              )}
            />
            <Controller
              control={control}
              name="signInPassword"
              rules={{
                required: {
                  value: true,
                  message: `${t('passwordRequired')}`,
                },
                pattern: {
                  value: passwordRegex,
                  message:
                    `${t('passwordLength')}`,
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="outlined"
                  placeholder={t('password')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HttpsOutlinedIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOffOutlinedIcon />
                          ) : (
                            <VisibilityOutlinedIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                    type: showPassword ? "text" : "password",
                  }}
                  fullWidth
                  className="marginBottom-25"
                  error={!!errors["signInPassword"]}
                  helperText={
                    errors["signInPassword"]
                      ? errors["signInPassword"].message
                      : ""
                  }
                  disabled={signinLoading}
                />
              )}
            />
            {signinError && (
              <Alert severity="error" className="marginBottom-14">
                {signinErrorMsg}
              </Alert>
            )}
            <Box
              className="signinpage-text-container"
              sx={{
                color: !themeMode ? "#fff" : "#72a9de",
              }}
            >
              <Typography className="white-color">
              {t('acceptTerms')}{" "}
                <Link
                  to="/terms-of-use"
                  className="signinpage-terms"
                  component={LinkBehavior}
                >
                  {t('termsOfUse')}
                </Link>{" "}
                {t('acknowledge')}{" "}
                <Link
                  to="/privacy-policy"
                  className="signinpage-terms"
                  component={LinkBehavior}
                >
                  {t('privacyPolicy')}
                </Link>
              </Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit(onSubmit)}
              disabled={signinLoading}
            >
              {signinLoading ? <CircularProgress size="0.875rem" /> : `${t('signup')}`}
            </Button>
            <Divider className="marginY-28">{t('or')}</Divider>
            <Button
              variant="outlined"
              fullWidth
              disabled={signinLoading}
              onClick={() => login()}
              className="google-button"
            >
              <GoogleIcon className="googleIcon" />
              &nbsp;{t('google')}
            </Button>
            <Box className="text-center marginTop-25">
              <Typography variant="subtitle1" display="block" gutterBottom>
                {t('alreadyHaveAnAccount')}&nbsp;
                <Link to="/login" component={LinkBehavior} underline="none">
                  <span className="font-bold cursor-pointer">{t('login')}</span>
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box className="Home-Page-Language-Btn">
          {languages.map(({ code, lang }) => (
            <a
              key={code}
              onClick={() => changeLanguage(code)}
              variant="text"
              className="language-switcher-button"
            >
              {lang}
            </a>
          ))}
        </Box>
        <Box className="text-center marginY-10">
          <Link
            to="/terms-of-use"
            className="linkStyle"
            component={LinkBehavior}
          >
            {t('termsOfUse')}
          </Link>
          <Link
            to="/privacy-policy"
            className="linkStyle marginX-10"
            component={LinkBehavior}
          >
            {t('privacyPolicy')}
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

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
        />
      </Container>
    </>
  );
};

export default SigninPage;
