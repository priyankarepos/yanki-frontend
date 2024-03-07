import { Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import "./HatzalahGlobalAssist.scss";

const HatzalahGlobalAssist = ({ answer }) => {
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
              Tap To call
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
        // Add a space after the phone number, except for the last word
        if (index !== array.length - 1) {
          content.push(" ");
        }
      } else {
        const lastChar = word.slice(-1);
        const punctuation = [".", ",", "-"]; // Add more punctuation characters if needed
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
      <Box>
        <Paper elevation={3} className="container">
          {answer.globalAssist.fullAddress &&
          answer.globalAssist.latitude &&
          answer.globalAssist.longitude &&
          answer.globalAssist.phoneNumber ? (
            <>
              <Typography
                component="div"
                variant="h6"
                className="container-heading"
              >
                {answer.globalAssist.message}
              </Typography>
              <Typography
                component="div"
                variant="body1"
                className="coordinates-text"
              >
                <strong>Location: </strong> {answer.globalAssist.fullAddress}
              </Typography>
              <Typography component="div" className="coordinates-container">
                <Typography component="p" className="coordinates-text">
                  <strong>LAT :</strong> {answer.globalAssist.latitude}
                </Typography>
                <Typography component="p" className="coordinates-text">
                  <strong>LON :</strong> {answer.globalAssist.longitude}
                </Typography>
              </Typography>
              <Typography component="div" variant="body1">
                {renderClickableContent(answer.globalAssist.phoneNumber)}
              </Typography>
            </>
          ) : (
            <Typography component="div" variant="h6">
              {renderClickableContent(answer.globalAssist.message)}
            </Typography>
          )}
        </Paper>
      </Box>
    </>
  );
};

export default HatzalahGlobalAssist;
