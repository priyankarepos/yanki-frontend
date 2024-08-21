import React from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";

import HttpsOutlinedIcon from "@mui/icons-material/HttpsOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

import { useForm, Controller } from "react-hook-form";
import Link from "@mui/material/Link";
import { passwordRegex } from "../Utils/validations/validation";
import { passwordPatterErrorMessage } from "../Utils/messages/commonMessages";
import LinkBehavior from "../Components/Helpers/LinkBehavior";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import YankiLogo from "../Assets/images/yanki-logo2.png"
import "./Style.scss";
import { apiUrls, messages } from "../Utils/stringConstant/stringConstant";
import { useTranslation } from 'react-i18next';

const ChangePasswordPage = () => {
  const { t } = useTranslation();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitError, setIsSubmitError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const watchNewPassword = watch("newPassword");

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post(
        apiUrls.changePassword,
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          confirmNewPassword: data.confirmPassword,
        }
      );

      if (response.status === 200) {
        setIsSubmitting(false);
        setIsSubmitError(false);
        setErrorMsg("");
        window.localStorage.removeItem(
          import.meta.env.VITE_APP_LOCALSTORAGE_TOKEN
        );
        window.localStorage.removeItem(
          import.meta.env.VITE_APP_LOCALSTORAGE_REMEMBER
        );
        navigate("/change-password-success");
      }
    } catch (e) {
      setIsSubmitting(false);
      setIsSubmitError(true);
      if (e?.response?.data?.message) {
        setErrorMsg(e?.response?.data?.message);
      } else {
        setErrorMsg(t('somethingWentWrong'));
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
              {t('changePassword')}
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                control={control}
                name="currentPassword"
                rules={{
                  required: {
                    value: true,
                    message: `${t('currentPasswordRequired')}`,
                  },
                  pattern: {
                    value: passwordRegex,
                    message: passwordPatterErrorMessage,
                  },
                  validate: {
                    passwordMatch: (value) =>
                      value !== watchNewPassword ||
                      `${t('currentPasswordMustNotEqualNewPassword')}`,
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="outlined"
                    placeholder={t('currentPassword')}
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
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                            edge="end"
                          >
                            {showCurrentPassword ? (
                              <VisibilityOffOutlinedIcon />
                            ) : (
                              <VisibilityOutlinedIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                      type: showCurrentPassword ? "text" : "password",
                    }}
                    fullWidth
                    className="marginBottom-20"
                    error={!!errors["currentPassword"]}
                    helperText={
                      errors["currentPassword"]
                        ? errors["currentPassword"].message
                        : ""
                    }
                    disabled={isSubmitting}
                  />
                )}
              />

              <Controller
                control={control}
                name="newPassword"
                rules={{
                  required: {
                    value: true,
                    message: `${t('newPasswordRequired')}`,
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
                    placeholder={t('newPassword')}
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
                    className="marginBottom-20"
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
                    message: `${t('confirmPasswordRequired')}`,
                  },
                  pattern: {
                    value: passwordRegex,
                    message: passwordPatterErrorMessage,
                  },
                  validate: {
                    passwordMatch: (value) =>
                      value === watchNewPassword ||
                      `${t('confirmPasswordMustMatchNewPassword')}`,
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="outlined"
                    placeholder={t('confirmPassword')}
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
                    className="marginBottom-20"
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
                {t('confirm')}
              </Button>
            </form>
            <Link
              to="/"
              component={LinkBehavior}
              underline="none"
              variant="body1"
            >
              <div className="text-center cursor-pointer bold">{t('cancelReminder')}</div>
            </Link>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default ChangePasswordPage;
