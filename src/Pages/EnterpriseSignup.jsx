import React, { useContext, useEffect, useState } from 'react'
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
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
import { useGoogleLogin } from '@react-oauth/google';
import LinkBehavior from "../Components/Helpers/LinkBehavior";
import HttpsOutlinedIcon from "@mui/icons-material/HttpsOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import LinkIcon from "@mui/icons-material/Link";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Grid, FormControl, Select, MenuItem, ListItemIcon, useMediaQuery } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import "./Style.scss"
// import Checkbox from "@mui/material/Checkbox";
// import FormControlLabel from "@mui/material/FormControlLabel";
import {
    emailRegex,
    passwordRegex,
    phoneRegex,
} from "../Utils/validations/validation";
import GoogleIcon from '@mui/icons-material/Google';

const styles = {
    inputField: {
        // backgroundColor: '#eaf5ff',
        // border: '1px solid #6fa8dd',
        borderRadius: '8px',
        marginBottom: '10px',
        // color: "#8bbae5",
        with: "100%"
    },
};

const linkStyle = {
    color: "#457bac",
    fontSize: "15px",
    textDecoration: "none",
    paddingRight: "20px",
    borderRight: "1px solid #457bac",
};

const EnterpriseSignup = () => {
    const { themeMode } = useContext(ThemeModeContext);
    const { activeTab } = useContext(Context);
    const [showPassword, setShowPassword] = useState(false);
    const [signinLoading, setSigninLoading] = useState(false);
    const [signinError, setSigninError] = useState(false);
    const [signinErrorMsg, setSigninErrorMsg] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [enterpriseCategories, setEnterpriseCategories] = useState([]);
    console.log("enterpriseCategories", enterpriseCategories);
    const recipientEmail = "hello@yanki.ai";
    const emailSubject = "Email subject";
    const emailBody = "Email body";
    const {
        control,
        handleSubmit,
        formState: { errors },
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
            // signTermsAndCondition: "",
        },
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchEnterpriseCategories = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_HOST}/api/yanki-ai/get-enterprises-categories`
                );

                console.log('API Response:', response.data);

                if (response.status === 200) {
                    setEnterpriseCategories(response.data);
                } else {
                    console.error("Failed to fetch enterprise categories");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchEnterpriseCategories();
    }, []);

    const onError = (data) => {
        console.log("error data: ", data);
    };

    const onSubmit = async (data) => {
        try {
            setSigninLoading(true);

            // Prepare the data to be sent in the request body
            const dataToSend = {
                email: data.Email,
                password: data.Password,
                fullName: data.UserName,
                phoneNumber: data.PhoneNumber,
                enterpriseName: data.EnterpriseName,
                contactPersonName: data.PointOfContact,
                website: data.Website,
                categoryId: selectedCategory,
                // isTermAndPrivacy: data.signTermsAndCondition
            };

            // Make the POST request
            const response = await axios.post(
                `${process.env.REACT_APP_API_HOST}/api/auth/register`,
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

    const onSuccess = async (codeResponse) => {
        try {
            setSigninLoading(true);
            const { access_token } = codeResponse;
            console.log("access_token", access_token);
            console.log("codeResponse", codeResponse);

            const response = await axios.post(
                `${process.env.REACT_APP_API_HOST}/api/auth/verify-google-access-token`,
                { access_token }
            );

            if (response.status === 200) {
                navigate("/login");
            } else {
                setSigninError(true);
                setSigninErrorMsg("Authentication failed.");
            }
        } catch (error) {
            console.error("Error:", error);
            setSigninError(true);
            setSigninErrorMsg("Something went wrong.");
        } finally {
            setSigninLoading(false);
        }
    };

    const login = useGoogleLogin({
        onSuccess,
    });

    const isLargeScreen = useMediaQuery("(min-width: 1024px)");


    return (
        <>
            <Container maxWidth="xl">
                <Box className="flex justify-center items-center min-h-70-screen">
                    <Box sx={{ maxWidth: isLargeScreen ? 620 : "100%" }}>
                        <Box className="w-full object-contain flex items-center justify-center marginY-28">
                            <Link
                                to="/auth"
                                className="w-full object-contain flex items-center justify-center"
                            >
                                <img
                                    src={"/auth-logo-light.svg"}
                                    alt="logo"
                                    style={{
                                        width: "100%",
                                        maxWidth: isLargeScreen ? "250px" : "200px",
                                        marginLeft: "auto",
                                        marginRight: "auto",
                                        display: "block",
                                    }}
                                />
                            </Link>
                        </Box>
                        <Typography component="h1"
                            className="text-center marginBottom-34"
                            sx={{ marginBottom: "15px", textAlign: "center", fontWeight: "600", color: "#72a9de", }}>Welcome! If you are a nonprofit or for profit organization, school, business or any kind of entity that offers products or services to the Orthodox Jewish community worldwide and you’d like to use Yanki as a platform to reach your target, please submit the following information to analyze your request, the acceptance process takes between 2-7 days. </Typography>
                        <Typography
                            component="h1"
                            variant="h5"
                            className="text-center marginBottom-34"
                            sx={{ marginBottom: "34px", textAlign: "center", fontWeight: "bold", color: "#72a9de", }}
                        >
                            Create your account
                        </Typography>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    control={control}
                                    name="UserName"
                                    rules={{
                                        required: "User Name is required.",
                                        minLength: {
                                            value: 3,
                                            message: "User Name should be at least 3 characters long.",
                                        },
                                        maxLength: {
                                            value: 50,
                                            message: "User Name should not exceed 50 characters.",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            className={activeTab === 1 ? 'EnterpriseInputFieldColor' : ''}
                                            {...field}
                                            sx={activeTab === 1 && { ...styles.inputField }}
                                            type="outlined"
                                            placeholder="User Name"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PersonOutlineIcon style={{ color: activeTab === 1 ? '#8bbae5' : 'defaultIconColor' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            fullWidth
                                            error={!!errors["UserName"]}
                                            helperText={errors["UserName"] ? errors["UserName"].message : ""}
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
                                            className={activeTab === 1 ? 'EnterpriseInputFieldColor' : ''}
                                            {...field}
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
                                            sx={activeTab === 1 && { ...styles.inputField }}
                                            error={!!errors["Password"]}
                                            helperText={errors["Password"] ? errors["Password"].message : ""}
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
                                            className={activeTab === 1 ? 'EnterpriseInputFieldColor' : ''}
                                            {...field}
                                            type="outlined"
                                            placeholder="Email"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <MailOutlineIcon style={{ color: activeTab === 1 ? '#8bbae5' : 'defaultIconColor' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            fullWidth
                                            sx={activeTab === 1 && { ...styles.inputField }}
                                            error={!!errors["Email"]}
                                            helperText={errors["Email"] ? errors["Email"].message : ""}
                                            disabled={signinLoading}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    control={control}
                                    name="PhoneNumber"
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Phone number is required.",
                                        },
                                        pattern: {
                                            value: phoneRegex,
                                            message: "Invalid phone number format.",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            className={activeTab === 1 ? 'EnterpriseInputFieldColor' : ''}
                                            {...field}
                                            type="outlined"
                                            placeholder="Phone Number"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PhoneIcon style={{ color: activeTab === 1 ? '#8bbae5' : 'defaultIconColor' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            fullWidth
                                            sx={activeTab === 1 && { ...styles.inputField }}
                                            error={!!errors["PhoneNumber"]}
                                            helperText={errors["PhoneNumber"] ? errors["PhoneNumber"].message : ""}
                                            disabled={signinLoading}
                                        />
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
                                            className={activeTab === 1 ? 'EnterpriseInputFieldColor' : ''}
                                            {...field}
                                            type="outlined"
                                            placeholder="Enterprise Name"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <BusinessIcon style={{ color: activeTab === 1 ? '#8bbae5' : 'defaultIconColor' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            fullWidth
                                            sx={activeTab === 1 && { ...styles.inputField }}
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
                                            className={activeTab === 1 ? 'EnterpriseInputFieldColor' : ''}
                                            {...field}
                                            type="outlined"
                                            placeholder="Enterprises person of contact"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <AccountCircleIcon style={{ color: activeTab === 1 ? '#8bbae5' : 'defaultIconColor' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            fullWidth
                                            sx={activeTab === 1 && { ...styles.inputField }}
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
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    control={control}
                                    name="Website"
                                    rules={{
                                        required: "Website URL is required.",
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            className={activeTab === 1 ? 'EnterpriseInputFieldColor' : ''}
                                            {...field}
                                            type="outlined"
                                            placeholder="Website"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LinkIcon style={{ color: activeTab === 1 ? '#8bbae5' : 'defaultIconColor' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            fullWidth
                                            sx={activeTab === 1 && { ...styles.inputField }}
                                            error={!!errors["Website"]}
                                            helperText={errors["Website"] ? errors["Website"].message : ""}
                                            disabled={signinLoading}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} className='EnterpriseError'>
                                <FormControl fullWidth>
                                    <Select
                                        value={selectedCategory}
                                        onChange={(event) => setSelectedCategory(event.target.value)}
                                        displayEmpty
                                        sx={{ marginBottom: "10px" }}
                                        className='EnterpriseCategorySelect'
                                    >
                                        <MenuItem value="">
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



                            </Grid>

                        </Grid>


                        {signinError && (
                            <Alert severity="error" sx={{ marginBottom: "14px" }}>
                                {signinErrorMsg}
                            </Alert>
                        )}
                        <Box sx={{ textAlign: "center", marginTop: "15px", color: !themeMode ? "#fff" : "#72a9de", }}>
                            <Typography>By signing up, I accept the Yanki <Link to="/terms-of-use" style={{ color:"#13538b", fontWeight: "600",}}>
                                Terms of Use
                            </Link> and acknowledge the <Link
                                to="/privacy-policy"
                                style={{color:"#13538b", fontWeight: "600",}}
                            >
                                Privacy Policy
                            </Link></Typography>
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
                        <Box sx={{ maxWidth: "350px", marginX: "auto", marginTop: "25px", }}>
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleSubmit(onSubmit, onError)}
                                disabled={signinLoading}
                            >
                                {signinLoading ? <CircularProgress size="0.875rem" /> : "Sign up"}
                            </Button>
                            <Divider sx={{ marginY: "28px" }}>or</Divider>
                            <Button
                                variant="outlined"
                                sx={{ marginBottom: "25px", fontSize: "16px", textTransform: "capitalize", color: "#72a9de", }}
                                fullWidth
                                disabled={signinLoading}
                                onClick={() => login()}
                            >
                                <GoogleIcon style={{ width: "18px", paddingBottom: "2px", }} /> &nbsp;Google
                            </Button>
                        </Box>
                        <Box className="text-center" sx={{ marginTop: "25px" }}>
                            <Typography sx={{ textAlign: "center", color: "#72a9de", }} variant="subtitle1" display="block" gutterBottom>
                                Already have an account?
                                <Link to="/login" component={LinkBehavior} underline="none">
                                    <span className="font-bold cursor-pointer" style={{ color: activeTab === "0" ? "#fff" : "#13538b" }}> Login</span>
                                </Link>
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: "center", marginY: isLargeScreen ? "20px" : "10px" }}>
                            <Link to="/terms-of-use" style={linkStyle}>
                                Terms of Use
                            </Link>
                            <Link
                                to="/privacy-policy"
                                style={{ ...linkStyle, marginRight: "10px", marginLeft: "10px" }}
                            >
                                Privacy Policy
                            </Link>
                            <Typography variant="caption">
                                <a style={{ ...linkStyle, borderRight: "none" }}
                                    href={`mailto:${recipientEmail}?subject=${emailSubject}&body=${emailBody}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    hello@yanki.ai
                                </a>
                            </Typography>
                        </Box>
                    </Box>
                </Box >
            </Container >
        </>
    )
}

export default EnterpriseSignup