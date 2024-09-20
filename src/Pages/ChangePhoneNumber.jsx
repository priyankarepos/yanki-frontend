import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { useForm, Controller } from "react-hook-form";
import Link from "@mui/material/Link";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress, InputLabel, Snackbar } from "@mui/material";
import LinkBehavior from "../Components/Helpers/LinkBehavior";
import ReactPhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FormHelperText } from "@mui/material";
import "./Style.scss";
import axios from "axios";
import YankiLogo from "../Assets/images/yanki-logo2.png"
import { apiUrls, messages } from "../Utils/stringConstant/stringConstant";
import { useTranslation } from 'react-i18next';
import { phoneRegex } from "../Utils/validations/validation";

const ChangePhoneNumber = () => {
  const { t } = useTranslation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isSubmitError, setIsSubmitError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCurrentPhoneNumber = async () => {
      try {
        const response = await axios.get(apiUrls.currentPhoneNumber);

        if (response.status === 200) {
          setCurrentPhoneNumber(response.data.phoneNumber);
        }
      } catch (error) {
        setSnackbarMessage(`${t('errorFetchingPhoneNumber')}`, error);
        setSnackbarOpen(true);
      }
    };
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
    setValue("signInPhone", "+1", { shouldValidate: false });
  }, [setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        apiUrls.changePhoneNumber,
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
          setIsLoading(false);
          navigate("/");
        }, 2000);
      }
    } catch (e) {
      setIsSubmitError(true);
      setIsLoading(false);
      if (e?.response?.data?.message) {
        setErrorMsg(e?.response?.data?.message);
      } else {
        setErrorMsg(`${t('somethingWentWrong')}`);
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
              {t('changePhoneNumberTxt')}
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <InputLabel sx={{ pb: 1 }}>Current Phone:</InputLabel>
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
                      placeholder={t('noCurrentNumberEnterNewOne')}
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
              <InputLabel sx={{ pb: 1 }}>{t('newPhone')}</InputLabel>
              <Controller
                control={control}
                name="signInPhone"
                rules={{
                  required: {
                    value: true,
                    message: `${t('phoneNumberRequired')}`,
                  },
                  pattern: {
                    value: phoneRegex,
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
                      placeholder={t('phoneNumber')}
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
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  t('updateButton')
                )}
              </Button>
            </form>
            <Link
              to="/"
              component={LinkBehavior}
              underline="none"
              variant="body1"
            >
              <div className="text-center cursor-pointer bold">{t('cancelButton')}</div>
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
