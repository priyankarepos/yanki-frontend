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
import { Grid, FormControl, Select, MenuItem, ListItemIcon } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import "./Style.scss"
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

const styles = {
    inputField: {
        backgroundColor: '#eaf5ff',
        border: '1px solid #6fa8dd',
        borderRadius: '8px',
        marginBottom: '16px',
        color: "#8bbae5",
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
    const [isTermsAccepted, setTermsAccepted] = useState(false);
    const [enterpriseCategories, setEnterpriseCategories] = useState([]);
    console.log("enterpriseCategories", enterpriseCategories);
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
                isTermAndPrivacy: isTermsAccepted,
            };

            // Make the POST request
            const response = await axios.post(
                `${process.env.REACT_APP_API_HOST}/api/auth/register`,
                dataToSend
            );

            if (response.status === 200) {
                // Registration successful, navigate to the success page
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

    const handleTermsAcceptance = () => {
        setTermsAccepted(!isTermsAccepted);
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


    return (
        <>
            <Container maxWidth="xl">
                <Box className="flex justify-center items-center min-h-70-screen">
                    <Box sx={{ maxWidth: "700px", width: { sm: "700px" } }}>
                        <Box className="w-full object-contain flex items-center justify-center marginY-28">
                            <Link
                                to="/auth"
                                className="w-full object-contain flex items-center justify-center"
                            >
                                <img
                                    src={"/auth-logo-light.svg"}
                                    alt="logo"
                                    style={{ width: "35%" }}
                                />
                            </Link>
                        </Box>
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
                                        // Add validation rules for UserName field
                                    }}
                                    render={({ field }) => (
                                        <TextField
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
                                        // Add validation rules for Password field
                                    }}
                                    render={({ field }) => (
                                        <TextField
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
                                        // Add validation rules for Email field
                                    }}
                                    render={({ field }) => (
                                        <TextField
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
                                        // Add validation rules for PhoneNumber field
                                    }}
                                    render={({ field }) => (
                                        <TextField
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
                                        // Add validation rules for EnterpriseName field
                                    }}
                                    render={({ field }) => (
                                        <TextField
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
                                        // Add validation rules for PointOfContact field
                                    }}
                                    render={({ field }) => (
                                        <TextField
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
                                        // Add validation rules for Website field
                                    }}
                                    render={({ field }) => (
                                        <TextField
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
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <Select
                                        value={selectedCategory}
                                        onChange={(event) => setSelectedCategory(event.target.value)}
                                        displayEmpty
                                        sx={activeTab === 1 && { ...styles.inputField }}
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
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={isTermsAccepted}
                                        onChange={handleTermsAcceptance}
                                        color="primary"
                                    />
                                }
                                label="I accept the terms of use and privacy policy"
                            />
                        </Box>
                        <Box sx={{ maxWidth: "400px", marginX: "auto", marginTop: "25px", }}>
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
                                sx={{ marginBottom: "25px" }}
                                fullWidth
                                disabled={signinLoading}
                                onClick={() => login()}
                            >
                                Sign Up with Google
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
                        <Box sx={{ textAlign: "center", marginY: "20px" }}>
                            <Link to="/terms-of-use" style={linkStyle}>
                                Terms of Use
                            </Link>
                            <Link to="/privacy-policy" style={{ ...linkStyle, marginRight: "20px", marginLeft: "20px", }}>
                                Privacy Policy
                            </Link>
                            <Link to="/" style={{ ...linkStyle, borderRight: "none" }}>
                                hello@yanki.ai
                            </Link>
                        </Box>
                    </Box>
                </Box >
            </Container >
        </>
    )
}

export default EnterpriseSignup