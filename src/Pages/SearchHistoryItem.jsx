import React from "react";
import TorahanytimeAnswer from "../Components/TorahanytimeAnswer";
import GovadenAnswer from "../Components/GovadenAnswer";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import SentenceAnswer from "../Components/SentenceAnswer";
import ErrorAnswer from "../Components/ErrorAnswer";
import DemoEnterpriseChat from "../Components/DemoEnterpriseChat";
import { Context } from "../App";
import PdfAnswers from "../Components/PdfAnswers";
import YoutubeContent from "../Components/YoutubeContent";
// import YoutubeContent from "../Components/YoutubeContent";

const SearchHistoryItem = ({ query, response, errorMsg, searchQuery, handleChatClick }) => {

  console.log("response", response);

  const { activeTab } = React.useContext(Context);

  const isTorahAnswer = response?.isSucess && response?.torahAnytimeLectures?.hits?.hits?.length;
  const isGovadenAnswer = response?.isSucess && response?.godavenPrayerDetails?.length;

  return (
    <div className={`search-history-item ${isTorahAnswer || isGovadenAnswer ? 'with-response' : ''}`}>
      <Paper elevation={3} style={{ marginBottom: "10px", backgroundColor: "#1d4a72" }}>
        <div style={{ padding: "10px" }}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <ChatBubbleOutlineIcon fontSize="small" style={{ marginRight: '8px', color: activeTab === 0 ? "#fff" : "#8bbae5", }} />
            <Typography style={{ fontSize: "16px", color: activeTab === 0 ? "#fff" : "#8bbae5", }}>{query}</Typography>
          </Box>
        </div>
      </Paper>
      {isTorahAnswer && !response?.isExclusiveContent &&   (
        <Paper id="abcd" elevation={3} style={{ marginBottom: "10px", backgroundColor: "#012e55" }}>
          <div className="chat-bubble assistant-bubble">
            <TorahanytimeAnswer answer={response} />
          </div>
        </Paper>
      )}
      {isGovadenAnswer && (
        <Paper elevation={3} style={{ marginBottom: "10px", backgroundColor: "#012e55" }}>
          <div className="chat-bubble assistant-bubble">
            <GovadenAnswer answer={response} />
          </div>
        </Paper>
      )}

      {response?.isSucess && response?.contentResponse && (
        <Paper elevation={3} style={{ marginBottom: "10px", backgroundColor: "#012e55" }}>
          <div className="chat-bubble assistant-bubble">
            <SentenceAnswer answer={response} />
          </div>
        </Paper>
      )}

      {response?.isSucess && !response?.contentResponse && response?.message
        && (
          <Paper elevation={3} style={{ marginBottom: "10px", backgroundColor: "#012e55" }}>
            <div className="chat-bubble assistant-bubble">
              <DemoEnterpriseChat answer={response} />
            </div>
          </Paper>
        )}

      {response?.isSucess && response?.pdfNames && response?.pdfNames.length > 0 && (
        <Paper elevation={3} style={{ marginBottom: "10px", backgroundColor: "#012e55" }}>
          <div className="chat-bubble assistant-bubble">
            <PdfAnswers answer={response} />
          </div>
        </Paper>
      )}

      {response?.isSucess && response?.videoResult && response?.videoResult.length > 0 && response?.isExclusiveContent && (
        <Paper elevation={3} style={{ marginBottom: "10px", backgroundColor: "#012e55" }}>
          <div className="chat-bubble assistant-bubble">
            <YoutubeContent answer={response} />
          </div>
        </Paper>
      )}

      <Paper elevation={3} style={{ marginBottom: "10px", backgroundColor: "#012e55" }}>
        {response.isSucess === false && (
          <div className="response">
            <ErrorAnswer errorMsg={response.message} />
          </div>
        )}
      </Paper>

    </div>
  );
};

export default SearchHistoryItem;
