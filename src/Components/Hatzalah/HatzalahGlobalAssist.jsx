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
} from "@mui/material";
import { IconButton, Tooltip } from "@mui/material";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import HatzalahDisclaimer from "./HatzalahDisclaimer";
import HatzalahVideo from "./HatzalahVideo";

const HatzalahGlobalAssist = ({ answer }) => {
  const [showCheckIcon, setShowCheckIcon] = useState(false);
  const [open, setOpen] = useState(false);
  const [openVideo, setOpenVideo] = useState(true);

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

    // Create an array to hold all phone numbers found across all texts
    let allPhoneNumbers = [];

    // Process each text
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

    // If there are phone numbers, create a single "TAP TO CALL" button
    if (allPhoneNumbers.length > 0) {
      content.push(
        <div>
          <p
            key= "phone-button"
            className="tap-to-call-button"
            onClick={() =>
              allPhoneNumbers.map((phoneNumber) => {
                window.location.href = `tel:${phoneNumber}`;
              })
            }
          >
            TAP TO CALL
          </p>
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
          <>
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
                      <strong>Location:</strong>
                    </TableCell>
                    <TableCell className="coordinates-value">
                      {answer.globalAssist.fullAddress}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="coordinates-label">
                      <strong>Latitude:</strong>
                    </TableCell>
                    <TableCell className="coordinates-value">
                      {answer.globalAssist.latitude}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="coordinates-label">
                      <strong>Longitude:</strong>
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
          </>
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
              Training
            </Typography>
            <Typography>|</Typography>
            <Typography
              variant="outlined"
              onClick={handleOpen}
              className="hatzala-disclaimer"
            >
              Disclaimer
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
          Emergency Instructional Videos Disclaimer
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
