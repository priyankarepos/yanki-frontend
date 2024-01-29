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
import "./Style.scss"

import { useForm, Controller } from "react-hook-form";
import Link from "@mui/material/Link";
import {
  emailRegex,
  passwordRegex,
  phoneRegex,
} from "../Utils/validations/validation";
import LinkBehavior from "../Components/Helpers/LinkBehavior";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { ThemeModeContext } from "../App";
import { useGoogleLogin } from '@react-oauth/google';
import GoogleIcon from '@mui/icons-material/Google';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { FormHelperText } from "@mui/material";

const linkStyle = {
  color: "#457bac",
  fontSize: "15px",
  textDecoration: "none",
  paddingRight: "20px",
  borderRight: "1px solid #457bac",
};

const SigninPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [signinLoading, setSigninLoading] = useState(false);
  const [signinError, setSigninError] = useState(false);
  const [signinErrorMsg, setSigninErrorMsg] = useState("");

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
      // signTermsAndCondition: "",
    },
  });

  useEffect(() => {
    setValue('signInPhone', '+44', { shouldValidate: false });
  }, [setValue]);

  const onError = (data) => {
    console.log("error data: ", data);
  };

  const onSubmit = async (data) => {
    try {
      setSigninLoading(true);
      const dataToSend = {
        email: data.signInEmail,
        password: data.signInPassword,
        fullName: data.signInName,
        phoneNumber: data.signInPhone,
        // isTermAndPrivacy: data.signTermsAndCondition
        userType: "User"
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/api/auth/register`,
        dataToSend
      );

      if (response.status === 200) {
        navigate("/signin-success");
      }
    } catch (e) {
      setSigninLoading(false);
      setSigninError(true);
      if (e?.response?.data?.message) {
        setSigninErrorMsg(e?.response?.data?.message);
      } else {
        setSigninErrorMsg("Something went wrong");
      }
    }
  };

  /* 
    Box sizes for screen sizes. Maybe will use in future.
     md: "540px", lg: "720px", xl: "921px"
  */

  const onSuccess = async (codeResponse) => {
    try {
      setSigninLoading(true);
      const { access_token } = codeResponse;

      const response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/api/auth/verify-google-access-token`,
        { access_token }
      );

      if (response.status === 200) {
        navigate("/login");
      } else {
        setSigninError(true);
        setSigninErrorMsg("Authentication failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      setSigninError(true);
      setSigninErrorMsg("Something went wrong.");
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
          <Box sx={{ maxWidth: "360px", width: { sm: "360px" } }} className="user-signup">
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
                  style={{ width: "60%" }}
                />
              </RouterLink>
            </Box>
            <Typography
              component="h1"
              variant="h5"
              sx={{ marginBottom: "34px" }}
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
                  message: "Full name is required.",
                },
                minLength: {
                  value: 3,
                  message: "Full name should be at least 3 characters long.",
                },
                maxLength: {
                  value: 50,
                  message: "Full name should not exceed 50 characters.",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="outlined"
                  placeholder="Full name"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineIcon />
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                  sx={{ marginBottom: "10px" }}
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
                  message: "Phone number is required.",
                },
                pattern: {
                  value: phoneRegex,
                  message: "Enter valid phone number",
                },
              }}
              render={({ field }) => (
                <div style={{ marginBottom: '16px', position: 'relative' }}>
                  <ReactPhoneInput
                    inputExtraProps={{
                      name: field.name,
                      onBlur: field.onBlur,
                    }}
                    value={field.value}
                    preferredCountries={['us', 'il', 'gb', 'ca', 'mx']}
                    placeholder="Phone number"
                    onChange={(value, country, event) => {
                      field.onChange(value);
                    }}
                    onBlur={() => field.onBlur()}
                    error={!!errors["signInPhone"]}
                    style={{
                      border: errors["signInPhone"] ? '1px solid #ffc9c9' : '1px solid rgb(114, 169, 222)',
                      borderRadius: '8px',
                      marginBottom: '0px',
                      padding: '10px',
                      width: '100%',
                      outline: 'none',
                      height: '55px',
                      color: "#fff",
                    }}
                  />
                  {errors['signInPhone'] && (
                    <FormHelperText
                      style={{
                        color: '#ffc9c9',
                      }}
                    >
                      {errors['signInPhone'].message}
                    </FormHelperText>
                  )}
                </div>
              )}
            />
            {/* <Controller
              control={control}
              name="signInPhone"
              rules={{
                required: "Phone number is required.",
                validate: (value) => {
                  if (!value) return "Phone number is required.";
                  if (!phoneRegex.test(value))
                    return "Invalid phone number format.";
                  return true;
                },
              }}
              render={({ field }) => (
                <PhoneInput
                  {...field}
                  placeholder="Phone number"
                  disabled={signinLoading}
                  error={!!errors["signInPhone"]}
                />
              )}
            /> */}
            <Controller
              control={control}
              name="signInEmail"
              rules={{
                required: {
                  value: true,
                  message: "Email address is required.",
                },
                pattern: {
                  value: emailRegex,
                  message: "Enter valid email address.",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="outlined"
                  placeholder="Email address"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailOutlineIcon />
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                  sx={{ marginBottom: "10px" }}
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
                  message: "Password is required",
                },
                pattern: {
                  value: passwordRegex,
                  message:
                    "Password must have length of atleast 8 characters. It must contain uppercase letter, lowercase letter, special character and digit.",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="outlined"
                  placeholder="Password"
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
                  sx={{ marginBottom: "25px" }}
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
              <Alert severity="error" sx={{ marginBottom: "14px" }}>
                {signinErrorMsg}
              </Alert>
            )}
            <Box sx={{ textAlign: "left", marginTop: "0px", marginBottom: "25px", color: !themeMode ? "#fff" : "#72a9de", }}>
              {/* <Controller
                control={control}
                name="signTermsAndCondition"
                rules={{ required: "You must accept the terms and conditions." }}
                render={({ field }) => (
                  <>
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...field}
                          color="primary"
                        />
                      }
                      label="I accept the terms and conditions"
                    />
                    {errors.signTermsAndCondition && (
                      <Typography variant="body2" color="error">
                        {errors.signTermsAndCondition.message}
                      </Typography>
                    )}
                  </>
                )}
              /> */}
              <Typography style={{ color: "#fff" }}>By signing up, I accept the Yanki <Link to="/terms-of-use" style={{ color: "#fff", fontWeight: "600", }} component={LinkBehavior}>
                Terms of Use
              </Link> and acknowledge the <Link
                to="/privacy-policy"
                style={{ color: "#fff", fontWeight: "600", }} component={LinkBehavior}
              >
                  Privacy Policy
                </Link></Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit(onSubmit, onError)}
              disabled={signinLoading}
            >
              {signinLoading ? <CircularProgress size="0.875rem" /> : "Sign up"}
            </Button>
            <Divider sx={{ marginY: "28px" }}>or</Divider>
            <Button
              variant="outlined"
              fullWidth
              disabled={signinLoading}
              onClick={() => login()}
              sx={{ marginBottom: "25px", fontSize: "16px", textTransform: "capitalize", color: "#72a9de", }}
            >
              <GoogleIcon style={{ width: "18px", paddingBottom: "2px", }} /> &nbsp;Google
            </Button>
            <Box className="text-center" sx={{ marginTop: "25px" }}>
              <Typography variant="subtitle1" display="block" gutterBottom>
                Already have an account?&nbsp;
                <Link to="/login" component={LinkBehavior} underline="none">
                  <span className="font-bold cursor-pointer">Login</span>
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ textAlign: "center", marginY: "10px" }}>
          <Link to="/terms-of-use" style={linkStyle} component={LinkBehavior}>
            Terms of Use
          </Link>
          <Link
            to="/privacy-policy"
            style={{ ...linkStyle, marginRight: "10px", marginLeft: "10px" }}
            component={LinkBehavior}
          >
            Privacy Policy
          </Link>
          <Typography variant="caption">
            <a style={{ ...linkStyle, borderRight: "none" }}
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

export default SigninPage;
