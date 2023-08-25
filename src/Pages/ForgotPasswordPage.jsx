import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";

import MailOutlineIcon from "@mui/icons-material/MailOutline";

import { useForm, Controller } from "react-hook-form";
import LinkBehavior from "../Components/Helpers/LinkBehavior";
import { emailRegex } from "./../Utils/validations/validation";

const ForgotPasswordPage = () => {
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

  const onError = (data) => {
    console.log("error data: ", data);
  };

  const onSubmit = (data) => {
    console.log("submit data: ", data);
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
              variant="h5"
              component="h1"
              sx={{ marginBottom: "10px", textAlign: "center" }}
            >
              Forgot password?
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{ marginBottom: "34px", textAlign: "center" }}
            >
              No worries, we'll send you reset instructions.
            </Typography>
            <form onSubmit={handleSubmit(onSubmit, onError)}>
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
                    sx={{ marginBottom: "20px" }}
                    error={!!errors["emailAddress"]}
                    helperText={
                      errors["emailAddress"]
                        ? errors["emailAddress"].message
                        : ""
                    }
                  />
                )}
              />
              <Button
                variant="contained"
                type="submit"
                fullWidth
                sx={{ marginBottom: "21px" }}
              >
                Reset password
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
