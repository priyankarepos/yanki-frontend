import {
  Paper,
  TextField,
  Typography,
  CircularProgress,
  FormHelperText,
  Snackbar,
  Box,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../SafetyChecker/SafetyChecker.scss";
import UserChatSession from "./UserChatSesion";
import "./PersonalAssistant.scss";
import {
  agentChatResponse,
  apiUrls,
} from "../../Utils/stringConstant/AgentChatResponse";
import { useTranslation } from "react-i18next";
import { messages } from "../../Utils/stringConstant/stringConstant";

const PersonalAssistant = ({
  answer,
  fetchRemainingMessage,
  clickableOff,
  remainingMsgData,
}) => {
  const { t } = useTranslation();
  const [content, setContent] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mailMessage, setMailMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [taskLimitReachedMessage, setTaskLimitReachedMessage] = useState("");

  const yankiUser = JSON.parse(
    window.localStorage.getItem(import.meta.env.VITE_APP_LOCALSTORAGE_TOKEN) ||
      "{}"
  );
  const userRoles = yankiUser?.userObject?.userRoles || "";

  const handlePersonalAssistant = async () => {
    try {
      if (remainingMsgData.totalTaskLeft === 0) {
        setTaskLimitReachedMessage(messages.taskLeftZero);
        setContent("");
        setTouched(false);
      } else {
        setLoading(true);
        const response = await axios.post(apiUrls.personalAssistantEmail, {
          content,
        });
        if (response.status === 200) {
          const sendMessage = await axios.post(`${apiUrls.sendMessage}`, {
            content,
            userType: agentChatResponse.user,
          });
          if (sendMessage.status === 200) {
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
      }
    } catch (error) {
      setSnackbarMessage(`${t('errorSendingPersonalAssistantEmail')}`, error);
      setSnackbarOpen(true);
    }
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const handleStartChat = () => {
    setIsChatStarted(!isChatStarted);
  };

  return (
    <React.Fragment>
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
          disabled={
            mailMessage !== "" ||
            taskLimitReachedMessage !== "" ||
            !answer?.isPersonalAssistant === true ||
            clickableOff
          }
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
        {mailMessage ? (
          <div>
            <Typography sx={{ mt: 2 }}>
              {t('personalAssistanceRequestReceived')}
              <span className={agentChatResponse.emailSentMessageClass}>
                {t('startingChat')}
              </span>
            </Typography>
            <Box className={agentChatResponse.startChatContainer}>
              <a
                href={agentChatResponse.jumpToUserChatComponetId}
                className={`${agentChatResponse.startChat} ${
                  userRoles === agentChatResponse.enterprise
                    ? agentChatResponse.customDisableLight
                    : ""
                }`}
                onClick={handleStartChat}
              >
                {t('startChat')}
              </a>
            </Box>
          </div>
        ) : (
          taskLimitReachedMessage && (
            <Typography sx={{ mt: 2 }}>{taskLimitReachedMessage}</Typography>
          )
        )}
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />

      {isChatStarted && (
        <Box
          id={agentChatResponse.jumpToUserChatComponet}
          className={agentChatResponse.userChatSession}
        >
          <UserChatSession />
        </Box>
      )}
    </React.Fragment>
  );
};

export default PersonalAssistant;
