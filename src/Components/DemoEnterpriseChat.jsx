import {
  Box,
  Typography,
  List,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Snackbar,
  Tooltip,
} from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import "./AnswerStyle.scss";
import { apiUrls, messages } from "../Utils/stringConstant/stringConstant";
import { useTranslation } from "react-i18next";
import PdfModal from "./PdfModal";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const DemoEnterpriseChat = ({
  answer,
  fetchRemainingMessage,
  clickableOff,
}) => {
  const { t } = useTranslation();
  const [selectedEnterprise, setSelectedEnterprise] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedEnterpriseMessage, setSelectedEnterpriseMessage] =
    useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [showPdfGrid, setShowPdfGrid] = useState(false);

  const handleSendEmail = async (enterprise) => {
    try {
      const requestData = {
        enterpriseName: enterprise?.enterpriseName,
        enterpriseEmail: enterprise?.enterpriseEmail,
        departmentName: enterprise?.departmentName,
        departmentEmail: enterprise?.departmentEmail,
      };

      const response = await axios.post(
        apiUrls.sendMailToEnterprise,
        requestData
      );
      if (response.status === 200) {
        const message = `${t("messageSent")}`;
        setChatMessages([...chatMessages, message]);
        setSelectedEnterpriseMessage(response.data.message);
        fetchRemainingMessage();
      } else if (response.data && response.data.isSuccess === false) {
        setSelectedEnterpriseMessage(`${t("invalidEmail")}`);
      }
    } catch (error) {
      setSnackbarMessage(`${t("errorSendingEmailEnterprise")}`, error);
      setSnackbarOpen(true);
    }
  };

  const emailSubject = "Email subject";
  const emailBody = "Email body";

  const handleOpenEmailClient = () => {
    const emailToUse =
      answer?.enterpriseSelections?.departmentEmail ||
      answer?.enterpriseSelections?.enterpriseEmail;
    const mailtoLink = `mailto:${emailToUse}?subject=${emailSubject}&body=${emailBody}`;
    window.location.href = mailtoLink;
  };

  const handleCall = (phoneNumber) => {
    if (phoneNumber && phoneNumber.trim() !== "") {
      window.location.href = `tel:${phoneNumber}`;
    } else {
            setSnackbarMessage(`${t('invalidPhoneNumber')}`, phoneNumber);
      setSnackbarOpen(true);
    }
  };

  const handleSeePdfClick = () => {
    setShowPdfGrid(!showPdfGrid);
    setSelectedPdf(null);
  };

  const handleItemClick = (pdfUrl) => {
    setSelectedPdf(pdfUrl);
  };

  const closePdfModal = () => {
    setSelectedPdf(null);
  };

  const getShortPdfName = (pdfName) => pdfName ? pdfName.split('/').pop() : '';

  return (
    <>
      <Box className="demo-enterprise-wrapper">
        <Paper elevation={3}>
          <div>
            <List className="demo-enterprise-List">
              <Typography className="demo-enterprise-Typography">
                {answer.message}
              </Typography>
            </List>
          </div>
          <List>
            <Grid container spacing={2}>
              {answer.enterpriseSelections &&
                answer?.enterpriseSelections.map((enterprise, index) => (
                  <Grid item xs={12} sm={6} md={6} key={enterprise.id || index}>
                    <Box className="enterprise-info-box">
                      <div>
                        {enterprise.enterpriseName && (
                          <div>
                            {t('enterpriseName')} {enterprise.enterpriseName}
                          </div>
                        )}
                        {enterprise.enterpriseEmail && (
                          <div>
                            Enterprise Email:{" "}
                            <span
                              className="email-click"
                              onClick={handleOpenEmailClient}
                            >
                              {enterprise.enterpriseEmail}
                            </span>
                          </div>
                        )}
                        {enterprise.enterpriseAddress && (
                          <div>
                            {t('enterpriseAddress')}{" "}
                            {enterprise.enterpriseAddress}
                          </div>
                        )}
                        {enterprise.enterprisePhoneNumber && (
                          <div>
                            {t('enterprisePhone')}{" "}
                            <span
                              className="email-click"
                              onClick={() =>
                                handleCall(enterprise.enterprisePhoneNumber)
                              }
                            >
                              {enterprise.enterprisePhoneNumber}
                            </span>
                          </div>
                        )}
                        {enterprise.departmentName && (
                          <div>
                            {t('departmentName')} {enterprise.departmentName}
                          </div>
                        )}
                        {enterprise.departmentEmail && (
                          <div>
                            {t('departmentEmail')}{" "}
                            <span
                              className="email-click"
                              onClick={handleOpenEmailClient}
                            >
                              {enterprise.departmentEmail}
                            </span>
                          </div>
                        )}
                        {enterprise.departmentHeadName && (
                          <div>
                            {t('departmentHeadName')}{" "}
                            {enterprise.departmentHeadName}
                          </div>
                        )}
                        {answer?.isMail === true ||
                        selectedEnterpriseMessage !== "" ? (
                          <Button
                            className="enterprise-info-button"
                            onClick={() => {
                              setSelectedEnterprise(enterprise.enterpriseName);
                              handleSendEmail(enterprise);
                            }}
                            disabled={
                              !answer?.isMail === true ||
                              selectedEnterpriseMessage !== "" ||
                              clickableOff
                            }
                          >
                            {messages.clickSendMessageToEnterprise}
                          </Button>
                        ) : null}
                      </div>
                    </Box>
                  </Grid>
                ))}
            </Grid>
          </List>
          {answer.enterpriseSelections &&
            answer.enterpriseSelections.length >= 1 && (
              <Typography className="demo-enterprise-Typography enterprise-prompt-msg">
                {t('connectPrompt')}
              </Typography>
            )}
          {selectedEnterprise && (
            <Typography className="send-email-message">
              {selectedEnterpriseMessage === "" ? (
                <CircularProgress size={24} />
              ) : (
                selectedEnterpriseMessage
              )}
            </Typography>
          )}
          {answer.enterprisePdfNames && (
            <React.Fragment>
              <Typography
                variant="h6"
                component="div"
                className="enterprise-pdf-icon"
                onClick={handleSeePdfClick}
              >
                <Tooltip title="Enterprise document" arrow>
                  <span className="cursor-pointer flex">
                    <PictureAsPdfIcon />
                  </span>
                </Tooltip>
              </Typography>
              {showPdfGrid && (
                <Grid container spacing={2} className="enterprise-pdf-btn">
                  {answer?.enterprisePdfNames.map((pdfName, index) => (
                    <Grid item lg={4} md={6} sm={6} xs={12} key={index}>
                      <div
                        className="enterprise-pdf-thumbnail"
                        onClick={() => handleItemClick(pdfName)}
                      >
                        <Tooltip title={pdfName} arrow>
                          <Typography className="enterprise-pdf-name">
                            {getShortPdfName(pdfName)}
                          </Typography>
                        </Tooltip>
                      </div>
                    </Grid>
                  ))}
                </Grid>
              )}
            </React.Fragment>
          )}
        </Paper>
        <PdfModal
          isOpen={Boolean(selectedPdf)}
          onClose={closePdfModal}
          pdfUrl={selectedPdf}
          isPdf={selectedPdf?.toLowerCase().endsWith(".pdf")}
        />
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </>
  );
};

export default DemoEnterpriseChat;
