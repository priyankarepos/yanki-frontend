import {
  Paper,
  TextField,
  Typography,
  CircularProgress,
  FormHelperText,
  Snackbar,
} from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import "../SafetyChecker/SafetyChecker.scss";
const HelpAgent = ({ answer, fetchRemainingMessage, remainingMsgData }) => {
  const [content, setContent] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mailMessage, setMailMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showMsg, setShowMsg] = useState(false);
  const yankiUser = JSON.parse(
    window.localStorage.getItem(import.meta.env.VITE_APP_LOCALSTORAGE_TOKEN) ||
    "{}"
  );
  const userRoles = yankiUser?.userObject?.userRoles || "";

  const handlePersonalAssistant = async () => {
    try {
      setLoading(true);
      const apiUrl = `${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/personal-assistant-email`;
      const response = await axios.post(apiUrl, { content });
      if (response.status === 200) {
        setMailMessage(response?.data?.message);
        setLoading(false);
        setContent("");
        setTouched(false);
        fetchRemainingMessage();
      } else {
        setSnackbarMessage("Failed to send personal assistant email");
        setSnackbarOpen(true);
        setLoading(false);
        setContent("");
      }
    } catch (error) {
      setShowMsg(true)
      setSnackbarMessage("Error sending personal assistant email:", error);
      setSnackbarOpen(true);
      setLoading(false);
      setContent("");
    }
  };

  const handleBlur = () => {
    setTouched(true);
  };

  return (
    <>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Help Agent
        </Typography>
        <Typography>{answer?.contentResponse}</Typography>
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
          disabled={mailMessage !== "" || !answer?.isHelpAgent === true}
        />
        <FormHelperText className="error-message">
          {touched && !content.trim() && "This field is required."}
        </FormHelperText>
        <Typography
          className={`${content.length === 0 ? "Custom-disabled-Button" : "Custom-Button"
            } ${userRoles === "Enterprise" ? "Custom-disable-light" : ""}`}
          onClick={content.length === 0 ? null : handlePersonalAssistant}
          sx={{
            mt: "8px",
            cursor:
              content.length === 0 ||
                loading ||
                mailMessage !== "" ||
                !answer?.isHelpAgent === true
                ? "text"
                : "pointer",
          }}
        >
          {loading ? (
            <CircularProgress size={24} className="dark-blur-color" />
          ) : (
            "Submit"
          )}
        </Typography>
        {mailMessage && (
          <Typography sx={{ mt: 2 }}>
            Your request has been received and is currently being reviewed by
            our YankiAl agents. Depending on your subscription you can expect to
            receive a response via the email address or SMS number registered
            with us
          </Typography>
        )}
        {showMsg && remainingMsgData?.totalTaskLeft === 0 && <Typography sx={{ mt: 2 }}>
          You have no task left. Please upgrade your plan to continue perform task
        </Typography>}
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </>
  );
};

export default HelpAgent;
