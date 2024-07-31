import { useState } from "react";
import { Box, Paper, TableContainer, Typography } from "@mui/material";
import "./HatzalahGlobalAssist.scss";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { IconButton, Tooltip } from "@mui/material";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import HatzalahDisclaimer from "./HatzalahDisclaimer";
import HatzalahVideo from "./HatzalahVideo";
import { useTranslation } from 'react-i18next';

const HatzalahGlobalAssist = ({ answer }) => {
  const { t } = useTranslation();
  const [showCheckIcon, setShowCheckIcon] = useState(false);
  const [open, setOpen] = useState(false);
  const [openVideo, setOpenVideo] = useState(true);
  const [openDailog, setOpenDailog] = useState(false);

  const handleCopyClick = () => {
    const address = `Address:${answer.globalAssist.fullAddress}`;
    const latitude = `Latitude:${answer.globalAssist.latitude}`;
    const longitude = `Longitude:${answer.globalAssist.longitude}`;
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${answer.globalAssist.latitude},${answer.globalAssist.longitude}`;
    navigator.clipboard.writeText(
      `${address}\n${latitude}\n${longitude}\n${googleMapsUrl}`
    );
    setShowCheckIcon(true);

    setTimeout(() => {
      setShowCheckIcon(false);
    }, 3000);
  };

  const renderClickableContent = (texts) => {
    const phoneRegex = /\b\d{3,}\b/g;
    let content = [];
    let allPhoneNumbers = [];

    if (answer.globalAssist.phoneNumber) {
      texts.forEach((text, textIndex) => {
        const cleanedText = text.replace(/(^-|^\.)+/gm, (match) =>
          match.replace(/[-.]/g, "")
        );

        cleanedText.split(/\s+/).forEach((word, index, array) => {
          if (word.match(phoneRegex)) {
            allPhoneNumbers.push(word);
          } else {
            const punctuation = [".", ",", "-"];
            let cleanedWord = word;
            let lastChar = "";

            if (punctuation.includes(word.slice(-1))) {
              lastChar = word.slice(-1);
              cleanedWord = word.slice(0, -1);
            }

            content.push(
              <span key={`${textIndex}-${index}`}>
                {cleanedWord}
                {lastChar}{" "}
              </span>
            );

            if (index !== array.length - 1) {
              content.push(" ");
            }
          }
        });
      });
    } else {
      const cleanedText = texts.replace(/(^-|^\.)+/gm, (match) =>
        match.replace(/[-.]/g, "")
      );

      cleanedText.split(/\s+/).forEach((word, index, array) => {
        if (word.match(phoneRegex)) {
          content.push(
            <span
              key={index}
              className="phonenumber-link"
              onClick={() => (window.location.href = `tel:${word}`)}
            >
              {word}
            </span>
          );
          if (index !== array.length - 1) {
            content.push(" ");
          }
        } else {
          const punctuation = [".", ",", "-"];
          let cleanedWord = word;
          let lastChar = "";
          if (punctuation.includes(word.slice(-1))) {
            lastChar = word.slice(-1);
            cleanedWord = word.slice(0, -1);
          }
          content.push(
            <span key={index}>
              {cleanedWord}
              {lastChar}{" "}
            </span>
          );
        }
      });
    }

    const handleClickOpen = () => {
      setOpenDailog(true);
    };

    const handleClose = () => {
      setOpenDailog(false);
    };

    const handleCall = (phoneNumber) => {
      window.location.href = `tel:${phoneNumber}`;
    };

    if (allPhoneNumbers.length > 0) {
      content.push(
        <div key="phone-buttons">
          {allPhoneNumbers.length === 1 ? (
            <p
              className="tap-to-call-button"
              onClick={() => handleCall(allPhoneNumbers[0])}
            >
              {t('tapToCall')}
            </p>
          ) : (
            <p className="tap-to-call-button" onClick={handleClickOpen}>
              {t('tapToCall')}
            </p>
          )}

          <Dialog open={openDailog} onClose={handleClose}>
            <DialogTitle>{t('selectNumberToCall')}</DialogTitle>
            <DialogContent>
              {allPhoneNumbers.map((phoneNumber, index) => (
                <p
                  key={index}
                  className="multiple-phone-number"
                  onClick={() => {
                    handleCall(phoneNumber);
                    handleClose();
                  }}
                >
                  {phoneNumber}
                </p>
              ))}
            </DialogContent>
            <DialogActions>
              <p className="multiple-cancel-container" onClick={handleClose}>
                {t('cancelButton')}
              </p>
            </DialogActions>
          </Dialog>
        </div>
      );
    }

    return content;
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Paper sx={{ p: 2 }}>
        {answer.globalAssist.fullAddress &&
          answer.globalAssist.latitude &&
          answer.globalAssist.longitude &&
          answer.globalAssist.phoneNumber ? (
          <div>
            <Box className="hatzala-info-box">
              <Typography component="div" variant="h6">
                {answer.globalAssist.message}
              </Typography>
            </Box>
            <TableContainer component={Paper} className="hatzala-table-wrapper">
              <Table className="table-responsive">
                <TableBody>
                  <TableRow>
                    <TableCell className="coordinates-label">
                      <strong>{t('location')}:</strong>
                    </TableCell>
                    <TableCell className="coordinates-value">
                      {answer.globalAssist.fullAddress}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="coordinates-label">
                      <strong>{t('latitude')}</strong>
                    </TableCell>
                    <TableCell className="coordinates-value">
                      {answer.globalAssist.latitude}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="coordinates-label">
                      <strong>{t('longitude')}</strong>
                    </TableCell>
                    <TableCell className="coordinates-value">
                      {answer.globalAssist.longitude}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="coordinates-button">
                      {renderClickableContent(answer.globalAssist.phoneNumber)}
                    </TableCell>
                    <TableCell className="copy-icon coordinates-button">
                      {showCheckIcon ? (
                        <Tooltip title="Copied">
                          <IconButton>
                            <CheckIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <IconButton onClick={handleCopyClick}>
                          <Tooltip title="Copy">
                            <FileCopyIcon />
                          </Tooltip>
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        ) : (
          <Box className="hatzala-error-box">
            <Typography component="div" variant="h6">
              {renderClickableContent(answer.globalAssist.message)}
            </Typography>
          </Box>
        )}
        {answer.firstAidVideos && (
          <Box className="hatzala-disclaimer-box">
            <Typography
              onClick={() => setOpenVideo(!openVideo)}
              className="hatzala-training"
            >
              {t('training')}
            </Typography>
            <Typography>|</Typography>
            <Typography
              variant="outlined"
              onClick={handleOpen}
              className="hatzala-disclaimer"
            >
              {t('disclaimer')}
            </Typography>
          </Box>
        )}
        {answer.firstAidVideos && openVideo && (
          <HatzalahVideo video={answer.firstAidVideos} />
        )}
      </Paper>

      <Dialog
        open={open}
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "#f0f0f0",
            minWidth: "70vw",
            height: "95vh",
            margin: "auto 25px",
          },
        }}
      >
        <DialogTitle variant="h6" className="hatzala-disclaimer-title">
          {t('emergencyInstructionalVideosDisclaimer')}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            className="hatzhala-modal-close-btn"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography className="hatzhala-model-color">
            <HatzalahDisclaimer />
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HatzalahGlobalAssist;
