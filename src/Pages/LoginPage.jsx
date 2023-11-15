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
import { emailRegex, passwordRegex } from "../Utils/validations/validation";
import LinkBehavior from "../Components/Helpers/LinkBehavior";
import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Context, ThemeModeContext } from "../App";
import { useGoogleLogin } from "@react-oauth/google";
import "./Style.scss";

// const styles = {
//   inputField: {
//     backgroundColor: '#eaf5ff',
//     border: '1px solid #6fa8dd',
//     borderRadius: '8px',
//     marginBottom: '16px',
//     color: "#8bbae5",
//     width: "100%"
//   },
// };

const linkStyle = {
  color: "#457bac",
  fontSize: "15px",
  textDecoration: "none",
  paddingRight: "20px",
  borderRight: "1px solid #457bac",
};

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [loginErrorMsg, setLoginErrorMsg] = useState(false);

  const { themeMode } = useContext(ThemeModeContext);
  const { activeTab } = useContext(Context);

  console.log("activeTab", activeTab);

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

  const onError = (data) => {
    console.log("error data: ", data);
  };
  
  const onSubmit = async (data) => {
    console.log("data", data);
    try {
      setLoginLoading(true);
      const dataToSend = {
        email: data.logInEmail,
        password: data.logInPassword,
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/api/auth/login`,
        dataToSend
      );

      if (response.status === 200) {
        // setLoginLoading(false);
        if (!data.logInRemeber) {
          window.sessionStorage.setItem(
            process.env.REACT_APP_SESSIONSTORAGE_REFRESH,
            JSON.stringify(true)
          );
        }
        window.localStorage.setItem(
          process.env.REACT_APP_LOCALSTORAGE_REMEMBER,
          JSON.stringify(data.logInRemeber)
        );
        window.localStorage.setItem(
          process.env.REACT_APP_LOCALSTORAGE_TOKEN,
          JSON.stringify(response.data.contentResponse)
        );
        navigate("/");
      }
    } catch (e) {
      setLoginLoading(false);
      setLoginError(true);
      if (e?.response?.data?.message) {
        setLoginErrorMsg(e?.response?.data?.message);
      } else {
        setLoginErrorMsg("Something went wrong");
      }
    }
  };

  const onSuccess = async (codeResponse) => {
    try {
      setLoginLoading(true);
      const { access_token } = codeResponse;
      console.log("access_token", access_token)
      console.log("codeResponse", codeResponse)
      const response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/api/auth/verify-google-access-token`,
        { access_token }
      );
      if (response.status === 200) {
        console.log("response", response.data.contentResponse);
        // setLoginLoading(false);
        window.localStorage.setItem(
          process.env.REACT_APP_LOCALSTORAGE_TOKEN,
          JSON.stringify(response.data.contentResponse)
        )
        navigate("/");
      } else {
        setLoginError(true);
        setLoginErrorMsg("Authentication failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      setLoginError(true);
      setLoginErrorMsg("Something went wrong.");
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
                  style={{
                    width: "60%",
                  }}
                />
              </RouterLink>
            </Box>
            <Typography
              component="h1"
              variant="h5"
              sx={{ marginBottom: "34px", textAlign: "center", fontWeight: "bold", color: "#72a9de", }}
              className="text-center marginBottom-34"
            >
              Login your account
            </Typography>
            <Controller
              control={control}
              name="logInEmail"
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
                sx={{marginBottom: "10px"}}
                  className={activeTab === 1 ? 'InputFieldColor' : ''}
                  {...field}
                  type="outlined"
                  placeholder="Email address"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailOutlineIcon style={{ color: activeTab === 1 ? '#8bbae5' : 'defaultIconColor' }} />
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
                  message: "Password is required",
                },
                pattern: {
                  value: passwordRegex,
                  message:
                    "Password must have length of atleast 8 characters. It must contain uppercase letter, lowercase letter, spcial character and digit.",
                },
              }}
              render={({ field }) => (
                <TextField
                  className={activeTab === 1 ? 'InputFieldColor' : ''}
                  sx={{marginBottom: "10px"}}
                  {...field}
                  style={{ color: activeTab === 1 ? '#8bbae5' : 'defaultIconColor' }}
                  type="outlined"
                  placeholder="Password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HttpsOutlinedIcon style={{ color: activeTab === 1 ? '#8bbae5' : 'defaultIconColor' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOffOutlinedIcon style={{ color: activeTab === 1 ? '#8bbae5' : 'defaultIconColor' }} />
                          ) : (
                            <VisibilityOutlinedIcon style={{ color: activeTab === 1 ? '#8bbae5' : 'defaultIconColor' }} />
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
            <Box className="flex justify-between items-center w-full">
              <FormControlLabel
                style={{ color: activeTab === 1 ? '#8bbae5' : 'defaultIconColor' }}
                control={
                  <Controller
                    control={control}
                    name="logInRemeber"
                    render={({ field }) => <Checkbox {...field} />}
                  />
                }
                label="Remember me"
              />
              <Link
                to="/forgot-password"
                component={LinkBehavior}
                underline="none"
                variant="body2"
                style={{ color: activeTab === 1 ? '#8bbae5' : 'defaultIconColor' }}
              >
                Forgot Password?
              </Link>
            </Box>

            {loginError && (
              <Alert severity="error" sx={{ marginBottom: "10px" }}>
                {loginErrorMsg}
              </Alert>
            )}

            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit(onSubmit, onError)}
              disabled={loginLoading}
            >
              {loginLoading ? <CircularProgress size="0.875rem" /> : "Login"}
            </Button>
            <Divider sx={{ marginY: "28px" }}>or</Divider>
            <Button onClick={() => login()} variant="outlined" sx={{ marginBottom: "35px" }} fullWidth>
              Login with google
            </Button>
            <Box className="text-center" sx={{ marginTop: "28px" }}>
              <Typography variant="subtitle1" display="block" gutterBottom style={{ color: activeTab === 1 ? '#8bbae5' : 'defaultIconColor' }}>
                Don't have an account?{" "}
                <Link to={activeTab === 1 ? "/enterprise-signup" : "/signup"} component={LinkBehavior} underline="none">
                  <span className="font-bold cursor-pointer" style={{ color: activeTab === 1 ? '#13538b' : 'defaultIconColor' }}>SignUp</span>
                </Link>
              </Typography>
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

export default LoginPage;
