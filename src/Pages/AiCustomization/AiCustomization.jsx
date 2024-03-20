import React, { useState, useEffect } from "react";
import { Box, Container, Button, Typography, InputLabel, Snackbar, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AiCustomization.scss";

const AiCustomization = () => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [customizeMessage, setCustomizeMessage] = useState('');
    const navigate = useNavigate();
    const { control, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        mode: "onChange",
        defaultValues: {
            questionPrompt: customizeMessage,
        },
    });

    useEffect(() => {
        const fetchCurrentPhoneNumber = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_HOST}/api/CustomPrompt/get-custom-prompt`
                );

                if (response.status === 200) {
                    setCustomizeMessage(response.data.message);
                    setValue("questionPrompt", response.data.customPrompt); // Set the value of questionPrompt
                }
            } catch (error) {
                console.error("Error fetching current phone number:", error);
            }
        };
        fetchCurrentPhoneNumber();
    }, [setValue]);

    const onSubmit = async (data) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_HOST}/api/CustomPrompt/add-custom-prompt`, `"${data.questionPrompt}"`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log("=========", response.data);
            setSnackbarMessage("Custom prompt added successfully");
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_HOST}/api/CustomPrompt/delete-custom-prompt`);

            if (response.status === 200) {
                setSnackbarMessage("Prompt deleted successfully");
                setSnackbarOpen(true);
                setValue("questionPrompt", "");
            } else {
                console.error('Failed to delete prompt');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleUpdate = async () => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_HOST}/api/CustomPrompt/update-custom-prompt`, `"${getValues('questionPrompt')}"`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                setSnackbarMessage("Prompt updated successfully");
                setSnackbarOpen(true);
            } else {
                console.error('Failed to update prompt');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const isTextareaEmpty = !getValues('questionPrompt');

    return (
        <Container maxWidth="md">
            <Box my={4}>
                <Typography variant="h4" align="center" className="Ai-Heading">
                    AI Customization
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <InputLabel>How would you like Yanki to respond?</InputLabel>
                    <Controller
                        control={control}
                        name="questionPrompt"
                        rules={{ required: "This field is required." }}
                        render={({ field }) => (
                            <TextField
                                className="Ai-TextField"
                                {...field}
                                fullWidth
                                variant="outlined"
                                placeholder="Enter here..."
                                error={!!errors["questionPrompt"]}
                                helperText={errors["questionPrompt"]?.message}
                                multiline
                                minRows={4}
                            />
                        )}
                    />
                    <Box display="flex" justifyContent="center" mt={4}>
                        <Button onClick={handleUpdate} variant="contained" color="primary" sx={{ marginRight: 2 }} disabled={isTextareaEmpty}>
                            Update
                        </Button>
                        <Button onClick={handleDelete} variant="contained" color="error" sx={{ marginRight: 2 }} disabled={isTextareaEmpty}>
                            Delete
                        </Button>
                        <Button variant="contained" sx={{ marginRight: 2 }} onClick={() => navigate("/")}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="primary" type="submit">
                            Save
                        </Button>
                    </Box>
                </form>
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </Container>
    );
};

export default AiCustomization;
