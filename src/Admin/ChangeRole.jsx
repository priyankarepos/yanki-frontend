import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { useForm, Controller } from "react-hook-form";
import { emailRegex } from "../Utils/validations/validation";
import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { ThemeModeContext } from "../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangeRole = () => {
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [loginErrorMsg, setLoginErrorMsg] = useState(false);

  const { themeMode } = useContext(ThemeModeContext);

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      logInEmail: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoginLoading(true);
      const dataToSend = {
        email: data.logInEmail,
      };
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/change-role`,
        dataToSend
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (e) {
      setLoginLoading(false);
      setLoginError(true);
      if (e?.response?.data?.message) {
        setLoginErrorMsg(e?.response?.data?.message);
        toast.error(e?.response?.data?.message);
      } else {
        setLoginErrorMsg("Something went wrong");
      }
    }
  };

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
                    themeMode === "dark"
                      ? "/auth-logo-dark.svg"
                      : "/auth-logo-light.svg"
                  }
                  alt="logo"
                  className="yanki-logo-image"
                />
              </RouterLink>
            </Box>
            <Typography
              component="h1"
              variant="h5"
              className="text-center marginBottom-34"
            >
              Create Admin
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
                  className="marginBottom-10"
                  error={!!errors["logInEmail"]}
                  helperText={
                    errors["logInEmail"] ? errors["logInEmail"].message : ""
                  }
                  disabled={loginLoading}
                />
              )}
            />
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
              className="marginTop-30"
            >
              {loginLoading ? (
                <CircularProgress size="0.875rem" />
              ) : (
                "Create Admin"
              )}
            </Button>
          </Box>
        </Box>
      </Container>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
    </>
  );
};

export default ChangeRole;
