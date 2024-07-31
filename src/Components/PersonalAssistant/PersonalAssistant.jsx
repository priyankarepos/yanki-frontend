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
import { useTranslation } from 'react-i18next';

const PersonalAssistant = ({ answer, fetchRemainingMessage, clickableOff }) => {
  const { t } = useTranslation();
  const [content, setContent] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mailMessage, setMailMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isChatStarted, setIsChatStarted] = useState(false);
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
        setSnackbarMessage(`${t('errorSendingPersonalAssistantEmail')}`);
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage(`${t('errorSendingPersonalAssistantEmail')}`, error);
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
          {t('personalAssistant')}
        </Typography>
        <Typography>{answer?.message}</Typography>
        <TextField
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          margin="normal"
          placeholder={t('enterContentHere')}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleBlur}
          error={touched && !content.trim()}
          disabled={mailMessage !== "" || !answer?.isPersonalAssistant === true || clickableOff}
        />
        <FormHelperText className="error-message">
          {touched && !content.trim() && `${t('fieldRequired')}`}
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
            `${t('submit')}`
          )}
        </Typography>
        {mailMessage && (
        <div>
          <Typography sx={{ mt: 2 }}>
          {t('personalAssistanceRequestReceived')}
            <span className={agentChatResponse.emailSentMessageClass}>
            {t('startingChat')}
            </span>
          </Typography>
          <Box className={agentChatResponse.startChatContainer}>
            <Typography
              className={`${agentChatResponse.startChat} ${
                userRoles === agentChatResponse.enterprise ? agentChatResponse.customDisableLight : ""
              }`}
              onClick={handleStartChat}
            >
              {t('startChat')}
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
