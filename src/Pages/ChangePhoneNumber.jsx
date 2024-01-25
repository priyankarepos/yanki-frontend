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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputLabel } from "@mui/material";
import LinkBehavior from "../Components/Helpers/LinkBehavior";

const ChangePhoneNumber = () => {
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitError, setIsSubmitError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const navigate = useNavigate();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            phoneNumber: "", // Add a new field for the phone number
        },
    });

    const onError = (data) => {
        console.log(data);
    };

    const onSubmit = async (data) => {
        console.log(data);
        try {
            setIsSubmitting(true);
            // Replace the following API call with your actual API endpoint for updating the phone number
            // const response = await axios.post(
            //     `${process.env.REACT_APP_API_HOST}/api/auth/change-phone-number`,
            //     {
            //         phoneNumber: data.phoneNumber,
            //     }
            // );

            // Simulating a successful response
            // if (response.status === 200) {
            setIsSubmitting(false);
            setIsSubmitError(false);
            setErrorMsg("");
            navigate("/change-phone-number-success");
            // }
        } catch (e) {
            setIsSubmitting(false);
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
                            <InputLabel>New Phone:</InputLabel>
                            <Controller
                                control={control}
                                name="phoneNumber" // Change the name to "phoneNumber"
                                rules={{
                                    required: {
                                        value: true,
                                        message: "Phone number is required.",
                                    },
                                    // You can add additional validation rules for the phone number
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type="outlined"
                                        placeholder="New phone number"
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
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                            type: showNewPassword ? "text" : "password",
                                        }}
                                        fullWidth
                                        sx={{ marginBottom: "10px" }}
                                        error={!!errors["phoneNumber"]}
                                        helperText={
                                            errors["phoneNumber"] ? errors["phoneNumber"].message : ""
                                        }
                                        disabled={isSubmitting}
                                    />
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
            </Container>
        </>
    );
};

export default ChangePhoneNumber;
