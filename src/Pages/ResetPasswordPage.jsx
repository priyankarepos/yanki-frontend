import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

import HttpsOutlinedIcon from "@mui/icons-material/HttpsOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

import { useForm, Controller } from "react-hook-form";
import { passwordRegex } from "../Utils/validations/validation";
import { passwordPatterErrorMessage } from "../Utils/messages/commonMessages";
import { useContext, useState } from "react";
import axios from "axios";
import {
  useNavigate,
  useSearchParams,
  Link as RouterLink,
} from "react-router-dom";
import { ThemeModeContext } from "../App";

const ResetPasswordPage = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitError, setIsSubmitError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { themeMode } = useContext(ThemeModeContext);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const watchNewPassword = watch("newPassword");

  const onError = (data) => {
    console.log("on error data: ", data);
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(false);
      const queryParamsObj = Object.fromEntries([...searchParams]);
      const dataToSend = {
        password: data.newPassword,
        confirmPassword: data.confirmPassword,
        email: queryParamsObj.email,
        token: queryParamsObj.token.split(":")[0],
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/api/auth/reset-password`,
        dataToSend
      );

      if (response.status === 200) {
        setIsSubmitting(false);
        setIsSubmitError(false);
        setErrorMsg("");
        navigate("/reset-password-success");
      }
    } catch (e) {
      setIsSubmitting(false);
      setIsSubmitError(true);
      if (e?.response?.data?.InvalidToken) {
        setErrorMsg(
          "Link and Token is now invalid. Please go to forgot password page and fill email again for new link."
        );
      } else if (e?.response?.data?.message) {
        setErrorMsg(e?.response?.data?.message);
      } else {
        setErrorMsg("Something went wrong");
      }
    }
  };

  return (
    <>
      <Container maxWidth="xl">
        <Box className="flex justify-center items-center min-h-70-screen">
          <Box sx={{ maxWidth: "360px", width: { sm: "360px" } }}>
            <Box
              className="w-full object-contain flex items-center justify-center"
              sx={{ marginBottom: "132px" }}
            >
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
              variant="h5"
              component="h1"
              sx={{ marginBottom: "54px", textAlign: "center" }}
            >
              Reset password
            </Typography>
            <form onSubmit={handleSubmit(onSubmit, onError)}>
              <Controller
                control={control}
                name="newPassword"
                rules={{
                  required: {
                    value: true,
                    message: "New password is required.",
                  },
                  pattern: {
                    value: passwordRegex,
                    message: passwordPatterErrorMessage,
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="outlined"
                    placeholder="New password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <HttpsOutlinedIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            edge="end"
                          >
                            {showNewPassword ? (
                              <VisibilityOffOutlinedIcon />
                            ) : (
                              <VisibilityOutlinedIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                      type: showNewPassword ? "text" : "password",
                    }}
                    fullWidth
                    sx={{ marginBottom: "10px" }}
                    error={!!errors["newPassword"]}
                    helperText={
                      errors["newPassword"] ? errors["newPassword"].message : ""
                    }
                    disabled={isSubmitting}
                  />
                )}
              />
              <Controller
                control={control}
                name="confirmPassword"
                rules={{
                  required: {
                    value: true,
                    message: "Confirm password is required.",
                  },
                  pattern: {
                    value: passwordRegex,
                    message: passwordPatterErrorMessage,
                  },
                  validate: {
                    passwordMatch: (value) =>
                      value === watchNewPassword ||
                      "Confirm password must match with new password.",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="outlined"
                    placeholder="Confirms password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <HttpsOutlinedIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <VisibilityOffOutlinedIcon />
                            ) : (
                              <VisibilityOutlinedIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                      type: showConfirmPassword ? "text" : "password",
                    }}
                    fullWidth
                    sx={{ marginBottom: "20px" }}
                    error={!!errors["confirmPassword"]}
                    helperText={
                      errors["confirmPassword"]
                        ? errors["confirmPassword"].message
                        : ""
                    }
                    disabled={isSubmitting}
                  />
                )}
              />
              {isSubmitError && (
                <Alert severity="error" sx={{ marginBottom: "20px" }}>
                  {errorMsg}
                </Alert>
              )}
              <Button variant="contained" type="submit" fullWidth>
                {isSubmitting ? (
                  <CircularProgress size="0.875rem" />
                ) : (
                  "Confirm"
                )}
              </Button>
            </form>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default ResetPasswordPage;