import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { useForm, Controller } from "react-hook-form";
import Link from "@mui/material/Link";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { InputLabel, Snackbar } from "@mui/material";
import LinkBehavior from "../Components/Helpers/LinkBehavior";
import ReactPhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FormHelperText } from "@mui/material";
import "./Style.scss";
import axios from "axios";
import YankiLogo from "../Assets/images/yanki-logo2.png"
import { messages } from "../Utils/stringConstant/stringConstant";

const ChangePhoneNumber = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [isSubmitError, setIsSubmitError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState(null);

  useEffect(() => {
    const fetchCurrentPhoneNumber = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_HOST}/api/auth/current-phoneNumber`
        );

        if (response.status === 200) {
          setCurrentPhoneNumber(response.data.phoneNumber);
        }
      } catch (error) {
        setSnackbarMessage("Error fetching current phone number:", error);
        setSnackbarOpen(true);
      }
    };

    // Call the fetch function when the component mounts
    fetchCurrentPhoneNumber();
  }, []);

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      signInPhone: "",
      currentSignInPhone: currentPhoneNumber || "",
    },
  });

  useEffect(() => {
    setValue("signInPhone", "1", { shouldValidate: false });
    // setValue('currentSignInPhone', '1', { shouldValidate: false });
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_APP_API_HOST}/api/auth/change-phoneNumber`,
        {
          newPhoneNumber: data.signInPhone,
        }
      );
      if (response.status === 200) {
        setIsSubmitError(false);
        setErrorMsg("");
        setSnackbarMessage(response?.data?.message);
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (e) {
      setIsSubmitError(true);
      if (e?.response?.data?.message) {
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
          <Typography className="profile-logo text-center" onClick={() => navigate("/")}>
              <img
                src={YankiLogo}
                alt="logo"
                width={messages.imgSize200}
                height={messages.imgSize150}
              />
          </Typography>
            <Typography
              component="h1"
              variant="h5"
              className="text-center marginBottom-34"
            >
              Change Phone Number
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <InputLabel sx={{pb:1}}>Current Phone:</InputLabel>
              <Controller
                control={control}
                name="currentSignInPhone"
                render={({ field }) => (
                  <div className="currentSignInPhone-style">
                    <ReactPhoneInput
                      inputExtraProps={{
                        name: field.name,
                        onBlur: field.onBlur,
                      }}
                      value={
                        currentPhoneNumber ? currentPhoneNumber : field.value
                      }
                      preferredCountries={["us", "il", "gb", "ca", "mx"]}
                      placeholder="No current number; enter a new one."
                      onChange={(value, country, event) => {
                        field.onChange(value);
                      }}
                      onBlur={() => field.onBlur()}
                      error={!!errors["currentSignInPhone"]}
                      className="ReactPhoneInput-style"
                      style={{
                        border: errors["currentSignInPhone"]
                          ? "1px solid #ffc9c9"
                          : "1px solid rgb(114, 169, 222)",
                      }}
                      disabled={true}
                    />
                  </div>
                )}
              />
              <InputLabel sx={{pb:1}}>New Phone:</InputLabel>
              <Controller
                control={control}
                name="signInPhone"
                rules={{
                  required: {
                    value: true,
                    message: "Phone number is required.",
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
                      className="ReactPhoneInput-style"
                      error={!!errors["signInPhone"]}
                      style={{
                        border: errors["signInPhone"]
                          ? "1px solid #ffc9c9"
                          : "1px solid rgb(114, 169, 222)",
                      }}
                    />
                    {errors["signInPhone"] && (
                      <FormHelperText className="phone-number-error">
                        {errors["signInPhone"].message}
                      </FormHelperText>
                    )}
                  </div>
                )}
              />

              {isSubmitError && (
                <Alert severity="error" className="marginBottom-20">
                  {errorMsg}
                </Alert>
              )}

              <Button
                variant="contained"
                fullWidth
                className="marginBottom-20 bold"
                type="submit"
              >
                Update
              </Button>
            </form>
            <Link
              to="/"
              component={LinkBehavior}
              underline="none"
              variant="body1"
            >
              <div className="text-center cursor-pointer bold">Cancel</div>
            </Link>
          </Box>
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

export default ChangePhoneNumber;
