import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

import MailOutlineIcon from "@mui/icons-material/MailOutline";

import { useForm, Controller } from "react-hook-form";
import LinkBehavior from "../Components/Helpers/LinkBehavior";
import { emailRegex } from "./../Utils/validations/validation";
import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Context, ThemeModeContext } from "../App";
import { apiUrls, messages } from "../Utils/stringConstant/stringConstant";

const ForgotPasswordPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitError, setIsSubmitError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { activeTab } = useContext(Context);

  const { themeMode } = useContext(ThemeModeContext);

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      emailAddress: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post(
        apiUrls.forgotPassword(data.emailAddress, activeTab === 0 ? "User" : "Enterprise")
      );

      if (response.status === 200) {
        navigate("/password-email-sent");
        setIsSubmitting(false);
        setIsSubmitError(false);
        setErrorMsg("");
      }
    } catch (e) {
      setIsSubmitting(false);
      setIsSubmitError(true);
      if (e?.response?.data?.message) {
        setErrorMsg(e?.response?.data?.message);
      } else {
        setErrorMsg("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <>
      <Container maxWidth="xl">
        <Box className="flex justify-center items-center min-h-70-screen">
          <Box sx={{ maxWidth: "360px", width: { sm: "360px" } }}>
            <Box className="w-full object-contain flex items-center justify-center marginY-54">
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
            </Box>
            <Typography
              variant="h5"
              component="h1"
              className="text-center marginBottom-10"
            >
              Forgot password?
            </Typography>
            <Typography
              variant="subtitle2"
              className="text-center marginBottom-34"
            >
              No worries, we'll send you reset instructions.
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                control={control}
                name="emailAddress"
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
                    className="marginBottom-20"
                    error={!!errors["emailAddress"]}
                    helperText={
                      errors["emailAddress"]
                        ? errors["emailAddress"].message
                        : ""
                    }
                    disabled={isSubmitting}
                  />
                )}
              />

              {isSubmitError && (
                <Alert severity="error" className="marginBottom-20">
                  {errorMsg}
                </Alert>
              )}

              <Button
                variant="contained"
                type="submit"
                fullWidth
                className="marginBottom-20"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Box className="text-center">
                    <CircularProgress size="0.875rem" />
                  </Box>
                ) : (
                  "Reset password"
                )}
              </Button>
            </form>
            <Link
              to="/login"
              component={LinkBehavior}
              underline="none"
              variant="body1"
            >
              <div className="text-center">Back to login</div>
            </Link>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default ForgotPasswordPage;
