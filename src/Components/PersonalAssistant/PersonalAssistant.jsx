import {
  Paper,
  TextField,
  Typography,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import "../SafetyChecker/SafetyChecker.scss";
const PersonalAssistant = ({ answer }) => {
  const [content, setContent] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mailMessage, setMailMessage] = useState("");

  const handlePersonalAssistant = async () => {
    try {
      setLoading(true);
      const apiUrl = `${process.env.REACT_APP_API_HOST}/api/yanki-ai/personal-assistant-email`;
      const response = await axios.post(apiUrl, { content });
      if (response.status === 200) {
        setMailMessage(response?.data?.message);
        setLoading(false);
        setContent("");
        setTouched(false);
      } else {
        console.log("Failed to send personal assistant email");
      }
    } catch (error) {
      console.error("Error sending personal assistant email:", error);
    }
  };

  const handleBlur = () => {
    setTouched(true);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Personal Assistant
      </Typography>
      <Typography>{answer?.message}</Typography>
      <TextField
        multiline
        rows={4}
        variant="outlined"
        fullWidth
        margin="normal"
        placeholder="Enter the content here"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={handleBlur}
        error={touched && !content.trim()}
        disabled={mailMessage !== "" || !answer?.isPersonalAssistant === true}
      />
      <FormHelperText className="error-message">
        {touched && !content.trim() && "This field is required."}
      </FormHelperText>
      <Typography
        className={`${
          content.length === 0 ? "Custom-disabled-Button" : "Custom-Button"
        }`}
        onClick={content.length === 0 ? null : handlePersonalAssistant}
        sx={{
          mt: "8px",
          cursor:
            content.length === 0 ||
            loading ||
            mailMessage !== "" ||
            !answer?.isPersonalAssistant === true
              ? "text"
              : "pointer",
        }}
      >
        {loading ? (
          <CircularProgress size={24} sx={{ color: "#1d4a72" }} />
        ) : (
          "Submit"
        )}
      </Typography>
      {mailMessage && (
        <Typography sx={{ mt: 2 }}>
          Your personal assistance request has been received and is currently
          being reviewed by our YankiAI agents. Depending on your subscription
          you can expect to receive a response via the email address or SMS
          number registered with us
        </Typography>
      )}
    </Paper>
  );
};

export default PersonalAssistant;
