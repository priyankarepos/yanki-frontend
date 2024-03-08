import { useState } from "react";
import { Box, Paper, TableContainer, Typography } from "@mui/material";
import "./HatzalahGlobalAssist.scss";
import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import { IconButton, Tooltip } from "@mui/material";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import CheckIcon from "@mui/icons-material/Check";

const HatzalahGlobalAssist = ({ answer }) => {
  const [showCheckIcon, setShowCheckIcon] = useState(false);

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

  const renderClickableContent = (text) => {
    const phoneRegex = /\b\d{10,}\b/g;

    let content = [];

    const cleanedText = text.replace(/(^-|^\.)+/gm, (match) =>
      match.replace(/[-.]/g, "")
    );

    cleanedText.split(/\s+/).forEach((word, index, array) => {
      if (word.match(phoneRegex)) {
        if (answer.globalAssist.phoneNumber) {
          content.push(
            <p
              key={index}
              className="tap-to-call-button"
              onClick={() => (window.location.href = `tel:${word}`)}
            >
              TAP TO CALL
            </p>
          );
        } else {
          content.push(
            <span
              key={index}
              className="phonenumber-link"
              onClick={() => (window.location.href = `tel:${word}`)}
            >
              {word}
            </span>
          );
        }
        if (index !== array.length - 1) {
          content.push(" ");
        }
      } else {
        const lastChar = word.slice(-1);
        const punctuation = [".", ",", "-"]; 
        const isLastCharPunctuation = punctuation.includes(lastChar);

        content.push(
          <span key={index}>
            {isLastCharPunctuation ? word.slice(0, -1) : word}{" "}
          </span>
        );
      }
    });

    return content;
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
      </Paper>
    </>
  );
};

export default HatzalahGlobalAssist;
