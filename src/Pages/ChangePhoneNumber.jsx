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
import { phoneRegex } from "../Utils/validations/validation";
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { FormHelperText } from "@mui/material";
import "./Style.scss"
import axios from "axios";

const ChangePhoneNumber = () => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [isSubmitError, setIsSubmitError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [currentPhoneNumber, setCurrentPhoneNumber] = useState(null);

    console.log("currentPhoneNumber", currentPhoneNumber);

    useEffect(() => {
        const fetchCurrentPhoneNumber = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_HOST}/api/auth/current-phoneNumber`
                );

                if (response.status === 200) {
                    setCurrentPhoneNumber(response.data.phoneNumber);
                }
            } catch (error) {
                console.error("Error fetching current phone number:", error);
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

    const onError = (data) => {
        console.log(data);
    };

    useEffect(() => {
        setValue('signInPhone', '44', { shouldValidate: false });
        setValue('currentSignInPhone', '44', { shouldValidate: false });
    }, [setValue]);

    const onSubmit = async (data) => {
        console.log(data);
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API_HOST}/api/auth/change-phoneNumber`,
                {
                    newPhoneNumber: data.signInPhone,
                }
            );
            if (response.status === 200) {
                setIsSubmitError(false);
                setErrorMsg("");
                setSnackbarMessage(response?.data?.message)
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
                        <Typography
                            component="h1"
                            variant="h5"
                            sx={{ marginBottom: "34px" }}
                            className="text-center marginBottom-34"
                        >
                            Change Phone Number
                        </Typography>
                        <form onSubmit={handleSubmit(onSubmit, onError)}>
                            <InputLabel>Current Phone:</InputLabel>
                            <Controller
                                control={control}
                                name="currentSignInPhone"
                                rules={currentPhoneNumber ? {
                                    required: {
                                        value: true,
                                        message: "Phone number is required.",
                                    },
                                    pattern: {
                                        value: phoneRegex,
                                        message: "Enter valid phone number",
                                    },
                                } : {}}
                                render={({ field }) => (
                                    <div style={{ marginBottom: '16px', position: 'relative' }}>
                                        <ReactPhoneInput
                                            inputExtraProps={{
                                                name: field.name,
                                                onBlur: field.onBlur,
                                            }}
                                            value={currentPhoneNumber ? currentPhoneNumber : field.value}
                                            preferredCountries={['us', 'il', 'gb', 'ca', 'mx']}
                                            placeholder="Phone number"
                                            onChange={(value, country, event) => {
                                                field.onChange(value);
                                            }}
                                            onBlur={() => field.onBlur()}
                                            error={!!errors["currentSignInPhone"]}
                                            style={{
                                                border: errors["currentSignInPhone"] ? '1px solid #ffc9c9' : '1px solid rgb(114, 169, 222)',
                                                borderRadius: '8px',
                                                marginBottom: '0px',
                                                padding: '10px',
                                                width: '100%',
                                                outline: 'none',
                                                height: '55px',
                                                color: "#fff",
                                            }}
                                        />
                                        {errors['currentSignInPhone'] && (
                                            <FormHelperText
                                                style={{
                                                    color: '#ffc9c9',
                                                }}
                                            >
                                                {errors['currentSignInPhone'].message}
                                            </FormHelperText>
                                        )}
                                        {!currentPhoneNumber && <sub style={{color:"#8d8d8d"}}>Current number not found; please provide a new number.</sub>}
                                    </div>
                                )}
                            />
                            <InputLabel>New Phone:</InputLabel>
                            <Controller
                                control={control}
                                name="signInPhone"
                                rules={{
                                    required: {
                                        value: true,
                                        message: "Phone number is required.",
                                    },
                                    pattern: {
                                        value: phoneRegex,
                                        message: "Enter valid phone number",
                                    },
                                }}
                                render={({ field }) => (
                                    <div style={{ marginBottom: '16px', position: 'relative' }}>
                                        <ReactPhoneInput
                                            inputExtraProps={{
                                                name: field.name,
                                                onBlur: field.onBlur,
                                            }}
                                            value={field.value}
                                            preferredCountries={['us', 'il', 'gb', 'ca', 'mx']}
                                            placeholder="Phone number"
                                            onChange={(value, country, event) => {
                                                field.onChange(value);
                                            }}
                                            onBlur={() => field.onBlur()}
                                            error={!!errors["signInPhone"]}
                                            style={{
                                                border: errors["signInPhone"] ? '1px solid #ffc9c9' : '1px solid rgb(114, 169, 222)',
                                                borderRadius: '8px',
                                                marginBottom: '0px',
                                                padding: '10px',
                                                width: '100%',
                                                outline: 'none',
                                                height: '55px',
                                                color: "#fff",
                                            }}
                                        />
                                        {errors['signInPhone'] && (
                                            <FormHelperText
                                                style={{
                                                    color: '#ffc9c9',
                                                }}
                                            >
                                                {errors['signInPhone'].message}
                                            </FormHelperText>
                                        )}
                                    </div>
                                )}
                            />

                            {isSubmitError && (
                                <Alert severity="error" sx={{ marginBottom: "20px" }}>
                                    {errorMsg}
                                </Alert>
                            )}

                            <Button
                                variant="contained"
                                fullWidth
                                sx={{ marginBottom: "21px" }}
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
                            <div className="text-center cursor-pointer">Cancel</div>
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
