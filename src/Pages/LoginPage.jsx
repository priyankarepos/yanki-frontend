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

import MailOutlineIcon from "@mui/icons-material/MailOutline";
import HttpsOutlinedIcon from "@mui/icons-material/HttpsOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

import { useForm, Controller } from "react-hook-form";
import Link from "@mui/material/Link";
import { emailRegex, passwordRegex } from "../Utils/validations/validation";
import LinkBehavior from "../Components/Helpers/LinkBehavior";
import { useState } from "react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

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

  const onSubmit = (data) => {
    console.log("data: ", data);
  };

  return (
    <>
      <Container maxWidth="xl">
        <Box className="flex justify-center items-center h-screen">
          <Box sx={{ maxWidth: "360px", width: { sm: "360px" } }}>
            <Box className="w-full object-contain flex items-center justify-center marginY-54">
              <img src="/Group 14492.svg" alt="logo" />
            </Box>
            <Typography
              component="h1"
              variant="h5"
              sx={{ marginBottom: "34px" }}
              className="text-center marginBottom-34"
            >
              Welcome back!
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
                  sx={{ marginBottom: "10px" }}
                  error={!!errors["logInEmail"]}
                  helperText={
                    errors["logInEmail"] ? errors["logInEmail"].message : ""
                  }
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
                  sx={{ marginBottom: "10px" }}
                  error={!!errors["logInPassword"]}
                  helperText={
                    errors["logInPassword"]
                      ? errors["logInPassword"].message
                      : ""
                  }
                />
              )}
            />
            <Box className="flex justify-between items-center w-full">
              <FormControlLabel
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
              >
                Forgot Password?
              </Link>
              {/* <Typography
                variant="body2"
                gutterBottom
                className="cursor-pointer"
              >
                Forgot Password?
              </Typography> */}
            </Box>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit(onSubmit, onError)}
            >
              Login
            </Button>
            <Divider sx={{ marginY: "28px" }}>or</Divider>
            <Button variant="outlined" sx={{ marginBottom: "35px" }} fullWidth>
              Google button from its library
            </Button>
            <Box className="text-center">
              <Typography variant="subtitle1" display="block" gutterBottom>
                Don't have an account?{" "}
                <Link to="/signin" component={LinkBehavior} underline="none">
                  <span className="font-bold cursor-pointer">Signin</span>
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default LoginPage;
