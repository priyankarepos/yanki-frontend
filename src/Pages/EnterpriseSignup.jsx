import React, { useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { useNavigate, Link } from "react-router-dom";
import { Context, ThemeModeContext } from "../App";
import axios from "axios";

import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { useForm, Controller } from "react-hook-form";
import LinkBehavior from "../Components/Helpers/LinkBehavior";
import HttpsOutlinedIcon from "@mui/icons-material/HttpsOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import BusinessIcon from "@mui/icons-material/Business";
import LinkIcon from "@mui/icons-material/Link";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  Grid,
  FormControl,
  Select,
  MenuItem,
  ListItemIcon,
  useMediaQuery,
  FormHelperText,
} from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import "./Style.scss";
import {
  emailRegex,
  passwordRegex,
} from "../Utils/validations/validation";
import ReactPhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./PagesStyle.scss";

const EnterpriseSignup = () => {
  const { themeMode } = useContext(ThemeModeContext);
  const { activeTab } = useContext(Context);
  const [showPassword, setShowPassword] = useState(false);
  const [signinLoading, setSigninLoading] = useState(false);
  const [signinError, setSigninError] = useState(false);
  const [signinErrorMsg, setSigninErrorMsg] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [enterpriseCategories, setEnterpriseCategories] = useState([]);
  const recipientEmail = "hello@yanki.ai";
  const emailSubject = "Email subject";
  const emailBody = "Email body";
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      EnterpriseName: "",
      EnterpriseCategory: "",
      PointOfContact: "",
      Website: "",
      UserName: "",
      PhoneNumber: "",
      Email: "",
      Password: "",
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    setValue("signInPhone", "+44", { shouldValidate: false });
  }, [setValue]);

  useEffect(() => {
    const fetchEnterpriseCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/get-enterprises-categories`
        );
        if (response.status === 200) {
          setEnterpriseCategories(response.data);
        } else {
          toast.error("Failed to fetch enterprise categories");
        }
      } catch (error) {
        toast.error("Error:", error);
      }
    };

    fetchEnterpriseCategories();
  }, []);

  const onSubmit = async (data) => {
    try {
      setSigninLoading(true);

      // Prepare the data to be sent in the request body
      const dataToSend = {
        email: data.Email,
        password: data.Password,
        fullName: data.UserName,
        phoneNumber: data.signInPhone,
        enterpriseName: data.EnterpriseName,
        contactPersonName: data.PointOfContact,
        website: data.Website ? data.Website : null,
        categoryId: selectedCategory,
        userType: "Enterprise",
      };

      // Make the POST request
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_HOST}/api/auth/register`,
        dataToSend
      );

      if (response.status === 200) {
        navigate("/signin-success");
      }
    } catch (error) {
      // Handle errors
      setSigninLoading(false);
      setSigninError(true);
      if (error?.response?.data?.message) {
        setSigninErrorMsg(error?.response?.data?.message);
      } else {
        setSigninErrorMsg("Something went wrong");
      }
    }
  };

  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  return (
    <>
      <Container maxWidth="xl">
        <Box className="flex justify-center items-center min-h-70-screen">
          <Box sx={{ maxWidth: isLargeScreen ? 620 : "100%" }}>
            <Box className="object-contain flex items-center justify-center marginY-28">
              <Link
                to="/auth"
                className="w-full object-contain flex items-center justify-center"
              >
                <img
                  src={"/auth-logo-light.svg"}
                  alt="logo"
                  className="yanki-logo"
                  style={{
                    maxWidth: isLargeScreen ? "250px" : "200px",
                  }}
                />
              </Link>
            </Box>
            <Typography
              component="h1"
              className="text-center marginBottom-34 enterprise-signup-message"
            >
              Welcome! If you are a nonprofit or for profit organization,
              school, business or any kind of entity that offers products or
              services to the Orthodox Jewish community worldwide and you’d like
              to use Yanki as a platform to reach your target, please submit the
              following information to analyze your request, the acceptance
              process takes between 2-7 days.{" "}
            </Typography>
            <Typography
              component="h1"
              variant="h5"
              className="text-center marginBottom-34 enterprise-signup-message"
            >
              Create your account
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <Controller
                  control={control}
                  name="UserName"
                  rules={{
                    required: "Enterprise owner's name is required.",
                    minLength: {
                      value: 3,
                      message:
                        "Enterprise owner's name should be at least 3 characters long.",
                    },
                    maxLength: {
                      value: 50,
                      message:
                        "Enterprise owner's name should not exceed 50 characters.",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      className={
                        activeTab === 1
                          ? "EnterpriseInputFieldColor inputField"
                          : ""
                      }
                      {...field}
                      type="outlined"
                      placeholder="Enterprise owner's name"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlineIcon
                              style={{
                                color:
                                  activeTab === 1
                                    ? "#8bbae5"
                                    : "defaultIconColor",
                              }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      fullWidth
                      error={!!errors["UserName"]}
                      helperText={
                        errors["UserName"] ? errors["UserName"].message : ""
                      }
                      disabled={signinLoading}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  control={control}
                  name="Password"
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
                      className={
                        activeTab === 1
                          ? "EnterpriseInputFieldColor inputField"
                          : ""
                      }
                      {...field}
                      type="outlined"
                      placeholder="Password"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <HttpsOutlinedIcon
                              style={{
                                color:
                                  activeTab === 1
                                    ? "#8bbae5"
                                    : "defaultIconColor",
                              }}
                            />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOffOutlinedIcon
                                  style={{
                                    color:
                                      activeTab === 1
                                        ? "#8bbae5"
                                        : "defaultIconColor",
                                  }}
                                />
                              ) : (
                                <VisibilityOutlinedIcon
                                  style={{
                                    color:
                                      activeTab === 1
                                        ? "#8bbae5"
                                        : "defaultIconColor",
                                  }}
                                />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                        type: showPassword ? "text" : "password",
                      }}
                      fullWidth
                      error={!!errors["Password"]}
                      helperText={
                        errors["Password"] ? errors["Password"].message : ""
                      }
                      disabled={signinLoading}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  control={control}
                  name="Email"
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
                      className={
                        activeTab === 1
                          ? "EnterpriseInputFieldColor inputField"
                          : ""
                      }
                      {...field}
                      type="outlined"
                      placeholder="Email"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MailOutlineIcon
                              style={{
                                color:
                                  activeTab === 1
                                    ? "#8bbae5"
                                    : "defaultIconColor",
                              }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      fullWidth
                      error={!!errors["Email"]}
                      helperText={
                        errors["Email"] ? errors["Email"].message : ""
                      }
                      disabled={signinLoading}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} className="phonenumber">
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
                        error={!!errors["signInPhone"]}
                        className="ReactPhoneInput-style"
                        style={{
                          border: errors["signInPhone"]
                            ? "1px solid red"
                            : "1px solid rgb(114, 169, 222)",
                        }}
                      />
                      {errors["signInPhone"] && (
                        <FormHelperText className="enterprise-phone-error">
                          {errors["signInPhone"].message}
                        </FormHelperText>
                      )}
                    </div>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  control={control}
                  name="EnterpriseName"
                  rules={{
                    required: "Enterprise Name is required.",
                  }}
                  render={({ field }) => (
                    <TextField
                      className={
                        activeTab === 1 ? "EnterpriseInputFieldColor inputField" : ""
                      }
                      {...field}
                      type="outlined"
                      placeholder="Enterprise Name"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BusinessIcon
                              style={{
                                color:
                                  activeTab === 1
                                    ? "#8bbae5"
                                    : "defaultIconColor",
                              }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      fullWidth
                      error={!!errors["EnterpriseName"]}
                      helperText={
                        errors["EnterpriseName"]
                          ? errors["EnterpriseName"].message
                          : ""
                      }
                      disabled={signinLoading}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  control={control}
                  name="PointOfContact"
                  rules={{
                    required: "Enterprise person of contact name is required.",
                  }}
                  render={({ field }) => (
                    <TextField
                      className={
                        activeTab === 1
                          ? "EnterpriseInputFieldColor inputField"
                          : ""
                      }
                      {...field}
                      type="outlined"
                      placeholder="Enterprises person of contact"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccountCircleIcon
                              style={{
                                color:
                                  activeTab === 1
                                    ? "#8bbae5"
                                    : "defaultIconColor",
                              }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      fullWidth
                      error={!!errors["PointOfContact"]}
                      helperText={
                        errors["PointOfContact"]
                          ? errors["PointOfContact"].message
                          : ""
                      }
                      disabled={signinLoading}
                    />
                  )}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                style={{ paddingTop: isSubmitted ? "0px" : "16px" }}
              >
                <Controller
                  control={control}
                  name="Website"
                  render={({ field }) => (
                    <TextField
                      className={
                        activeTab === 1
                          ? "EnterpriseInputFieldColor inputField"
                          : ""
                      }
                      {...field}
                      type="outlined"
                      placeholder="Website"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LinkIcon
                              style={{
                                color:
                                  activeTab === 1
                                    ? "#8bbae5"
                                    : "defaultIconColor",
                              }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      fullWidth
                      disabled={signinLoading}
                    />
                  )}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                className={`${
                  !selectedCategory
                    ? "EnterpriseErrorBorder"
                    : "EnterpriseError"
                } ${isSubmitted && "marginBottom-16"}`}
              >
                <FormControl fullWidth>
                  <Select
                    value={selectedCategory}
                    onChange={(event) =>
                      setSelectedCategory(event.target.value)
                    }
                    displayEmpty
                    className="EnterpriseCategorySelect marginBottom-10"
                  >
                    <MenuItem value="" disabled>
                      <ListItemIcon>
                        <CategoryIcon />
                      </ListItemIcon>
                      Select an Enterprise Category
                    </MenuItem>
                    {enterpriseCategories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        <ListItemIcon>
                          <CategoryIcon />
                        </ListItemIcon>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {!selectedCategory && isSubmitted && (
                  <FormHelperText className="enterprise-category-error">
                    Please select an enterprise category.
                  </FormHelperText>
                )}
              </Grid>
            </Grid>

            {signinError && (
              <Alert severity="error marginBottom-14">{signinErrorMsg}</Alert>
            )}
            <Box
              sx={{
                textAlign: "center",
                marginTop: "15px",
                color: !themeMode ? "#fff" : "#72a9de",
              }}
            >
              <Typography>
                By signing up, I accept the Yanki{" "}
                <Link className="enterprice-footer" to="/terms-of-use">
                  Terms of Use
                </Link>{" "}
                and acknowledge the{" "}
                <Link to="/privacy-policy" className="enterprice-footer">
                  Privacy Policy
                </Link>
              </Typography>
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
            </Box>
            <Box className="enterprise-signup-button-container" >
              <Button
                variant="contained"
                fullWidth
                onClick={handleSubmit(onSubmit)}
                disabled={signinLoading}
              >
                {signinLoading ? (
                  <CircularProgress size="0.875rem" />
                ) : (
                  "Sign up"
                )}
              </Button>
              {/* <Divider sx={{ marginY: "28px" }}>or</Divider> */}
              {/* <Button
                                variant="outlined"
                                sx={{ marginBottom: "25px", fontSize: "16px", textTransform: "capitalize", color: "#72a9de", }}
                                fullWidth
                                disabled={signinLoading}
                                onClick={() => login()}
                            >
                                <GoogleIcon style={{ width: "18px", paddingBottom: "2px", }} /> &nbsp;Google
                            </Button> */}
            </Box>
            <Box className="text-center marginTop-25">
              <Typography className="text-center enterprise-already-account"
                variant="subtitle1"
                display="block"
                gutterBottom
              >
                Already have an account?
                <Link to="/login" component={LinkBehavior} underline="none">
                  <span
                    className="font-bold cursor-pointer"
                    style={{ color: activeTab === "0" ? "#fff" : "#13538b" }}
                  >
                    {" "}
                    Login
                  </span>
                </Link>
              </Typography>
            </Box>
            <Box className="text-center"
              sx={{
                marginY: isLargeScreen ? "20px" : "10px",
              }}
            >
              <Link to="/terms-of-use" className="linkStyle">
                Terms of Use
              </Link>
              <Link
                className="linkStyle linkStyle-center-space"
                to="/privacy-policy"
              >
                Privacy Policy
              </Link>
              <Typography variant="caption">
                <a
                  href={`mailto:${recipientEmail}?subject=${emailSubject}&body=${emailBody}`}
                  target="_blank"
                  rel="noreferrer"
                  className="linkStyle new-title-email"
                >
                  hello@yanki.ai
                </a>
              </Typography>
            </Box>
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

export default EnterpriseSignup;
