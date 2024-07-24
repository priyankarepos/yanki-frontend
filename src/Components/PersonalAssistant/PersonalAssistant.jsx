import {
  Paper,
  TextField,
  Typography,
  CircularProgress,
  FormHelperText,
  Snackbar,
  Box,
} from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import "../SafetyChecker/SafetyChecker.scss";
import UserChatSession from "./UserChatSesion";
import "./PersonalAssistant.scss";
import {
  agentChatResponse,
  apiUrls,
} from "../../Utils/stringConstant/AgentChatResponse";
import { startConnection, stopConnection } from "../../SignalR/signalRService";

const PersonalAssistant = ({ answer, fetchRemainingMessage }) => {
  const [content, setContent] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mailMessage, setMailMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isChatStarted, setIsChatStarted] = useState(false);
  const yankiUser = JSON.parse(
    window.localStorage.getItem(import.meta.env.VITE_API_LOCALSTORAGE_TOKEN) ||
      "{}"
  );
  const userRoles = yankiUser?.userObject?.userRoles || "";

  const handlePersonalAssistant = async () => {
    try {
      setLoading(true);
      const apiUrl = `${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/personal-assistant-email`;
      const response = await axios.post(apiUrl, { content });
      if (response.status === 200) {
        const sendMessage = await axios.post(`${apiUrls.sendMessage}`, {
          content,
        });
        if (sendMessage.status === 200) {
          await initializeConnection();
          setMailMessage(response?.data?.message);
          setLoading(false);
          setContent("");
          setTouched(false);
          fetchRemainingMessage();
        }
      } else {
        setSnackbarMessage("Failed to send personal assistant email");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("Error sending personal assistant email:", error);
      setSnackbarOpen(true);
    }
  };

  const initializeConnection = async () => {
    await startConnection();

    return () => {
      stopConnection();
    };
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const handleStartChat = () => {
    setIsChatStarted(!isChatStarted);
  };

  return (
    <>
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
          } ${userRoles === "Enterprise" ? "Custom-disable-light" : ""}`}
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
            <CircularProgress size={24} className="dark-blur-color" />
          ) : (
            "Submit"
          )}
        </Typography>
        {mailMessage && (
        <div>
          <Typography sx={{ mt: 2 }}>
            {agentChatResponse.emailSentMessage}
            <span className={agentChatResponse.emailSentMessageClass}>
              {agentChatResponse.agentAvailabe}
            </span>
          </Typography>
          <Box className={agentChatResponse.startChatContainer}>
            <Typography
              className={`${agentChatResponse.startChat} ${
                userRoles === agentChatResponse.enterprise ? agentChatResponse.customDisableLight : ""
              }`}
              onClick={handleStartChat}
            >
              {agentChatResponse.startingChat}
            </Typography>
          </Box>
        </div>
        )} 
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />

      {isChatStarted && (
        <Box className={agentChatResponse.userChatSession}>
          <UserChatSession />
        </Box>
      )}
    </>
  );
};

export default PersonalAssistant;
