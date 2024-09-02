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
import { apiUrls } from "../../Utils/stringConstant/stringConstant";
import { useTranslation } from 'react-i18next';

const HelpAgent = ({ answer, fetchRemainingMessage, remainingMsgData, clickableOff }) => {
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
  const { t } = useTranslation();

  const handlePersonalAssistant = async () => {
    try {
      setLoading(true);
      const response = await axios.post(apiUrls.personalAssistantEmail, { content });
      if (response.status === 200) {
        setMailMessage(response?.data?.message);
        setLoading(false);
        setContent("");
        setTouched(false);
        fetchRemainingMessage();
      } else {
        setSnackbarMessage(`${t('failedToSendEmail')}`);
        setSnackbarOpen(true);
        setLoading(false);
        setContent("");
      }
    } catch (error) {
      setShowMsg(true)
      setSnackbarMessage(`${t('errorSendingEmail')}`, error);
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
          {t('helpAgent')}
        </Typography>
        <Typography>{answer?.contentResponse}</Typography>
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
          disabled={mailMessage !== "" || !answer?.isHelpAgent === true || clickableOff}
        />
        <FormHelperText className="error-message">
          {touched && !content.trim() && `${t('fieldRequired')}`}
        </FormHelperText>
        <Typography
          className={`${content.trim().length === 0 ? "Custom-disabled-Button" : "Custom-Button"
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
            `${t('submit')}`
          )}
        </Typography>
        {mailMessage && (
          <Typography sx={{ mt: 2 }}>
            {t('requestReceived')}
          </Typography>
        )}
        {showMsg && remainingMsgData?.totalTaskLeft === 0 && <Typography sx={{ mt: 2 }}>
          {t('noTaskLeft')}
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
