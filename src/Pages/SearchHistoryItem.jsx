import React, { useState } from "react";
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
import IsItKosher from "../Components/IsItKosher";
import EnterprisePdfAnswer from "../Components/EnterprisePdfAnswer";
import EventPublicationForm from "../Components/EventPublication/EventPublicationForm";
import SafetyChecker from "../Components/SafetyChecker/SafetyChecker";
import HatzalahGlobalAssist from "../Components/Hatzalah/HatzalahGlobalAssist";
import PersonalAssistant from "../Components/PersonalAssistant/PersonalAssistant";
import ReminderNotification from "../Components/ReminderNotification/ReminderNotification";
import HelpAgent from "../Components/HelpAgent/HelpAgent";

const SearchHistoryItem = ({ query, response }) => {
  const [direction, setDirection] = useState('ltr');
  const { activeTab } = React.useContext(Context);

  React.useEffect(() => {
    const containsHebrew = /[\u0590-\u05FF]/.test(query);
    const containsEnglish = /[a-zA-Z]/.test(query);
    let newDirection;

    if (containsEnglish && containsHebrew) {
      newDirection = "ltr";
    } else if (containsHebrew) {
      newDirection = "rtl";
    } else {
      newDirection = "ltr";
    }

    setDirection(newDirection);
  }, [query]);

  const isTorahAnswer = response?.isSucess && response?.torahAnytimeLectures?.hits?.hits?.length > 0;
  const isGovadenAnswer = response?.isSucess && response?.godavenPrayerDetails?.length;
  const isDataAvailable = response?.isItKosher?.isSuccess && response?.isItKosher?.products?.data.length > 0;
  const isHatzalah = response.isSucess && response.message && response?.globalAssist?.isSuccess;
  const isPersonalAssistant = (response.isSucess && response.message && response.isPersonalAssistant);
  const isHelpAgent = (response.contentResponse && response.isHelpAgent)
  return (
    <div className={`search-history-item ${isTorahAnswer || isGovadenAnswer ? 'with-response' : ''}`}>
      <Paper elevation={3} className="search-query" dir={direction}> 
        <Box className="search-query-container">
          <ChatBubbleOutlineIcon fontSize="small" className={`marginX-8 ${ activeTab === 0 ? "white-color" : "sky-blue-color" }`} />
          <Typography className={activeTab === 0 ? "white-color" : "sky-blue-color"} >{query}</Typography>
        </Box>
      </Paper>
      {isTorahAnswer && !response?.isExclusiveContent && (
        <Paper id="abcd" elevation={3} className="marginBottom-10">
          <div className="chat-bubble assistant-bubble">
            <TorahanytimeAnswer answer={response} />
          </div>
        </Paper>
      )}
      {isGovadenAnswer && (
        <Paper elevation={3} className="marginBottom-10">
          <div className="chat-bubble assistant-bubble">
            <GovadenAnswer answer={response} />
          </div>
        </Paper>
      )}

      {response?.isSucess && response?.contentResponse && !response.isHelpAgent && (response.enterprisePdfNames === null || (Array.isArray(response.enterprisePdfNames) && response.enterprisePdfNames.length === 0)) && (
        <Paper elevation={3} className="marginBottom-10">
          <div className="chat-bubble assistant-bubble">
            <SentenceAnswer answer={response} />
          </div>
        </Paper>
      )}

      {response?.isSucess && !response?.contentResponse && response?.message && !response?.globalAssist && !response?.globalAssist?.isSuccess && !response?.safetyChecker && !response?.isEvent && !response?.isPersonalAssistant && !response?.isViewReminder && (
          <Paper elevation={3} className="marginBottom-10">
            <div className="chat-bubble assistant-bubble">
              <DemoEnterpriseChat answer={response} />
            </div>
          </Paper>
        )}

      {response?.isSucess && response?.pdfNames && response?.pdfNames.length > 0 && (
        <Paper elevation={3} className="marginBottom-10">
          <div className="chat-bubble assistant-bubble">
            <PdfAnswers answer={response} />
          </div>
        </Paper>
      )}

      {response?.isSucess && response?.vimeoVideoDetails && response?.vimeoVideoDetails.length > 0 && response?.isExclusiveContent && (
        <Paper elevation={3} className="marginBottom-10">
          <div className="chat-bubble assistant-bubble">
            <YoutubeContent answer={response} />
          </div>
        </Paper>
      )}

      {response?.isSucess && response?.contentResponse && response?.enterprisePdfNames && response?.enterprisePdfNames.length > 0 && (
        <Paper elevation={3} className="marginBottom-10">
          <div className="chat-bubble assistant-bubble">
            <EnterprisePdfAnswer answer={response} />
          </div>
        </Paper>
      )}

      {response?.isSucess && response?.isEvent && response?.message && activeTab===0 &&  (
        <Paper elevation={3} className="marginBottom-10">
          <div className="chat-bubble assistant-bubble">
            <EventPublicationForm answer={response} />
          </div>
        </Paper>
      )}

      <Paper elevation={3} className="marginBottom-10">
        {response.isSucess === false && !response.isHelpAgent  && (response?.message || response?.contentResponse) && ( 
          <div className="response">
            <ErrorAnswer errorMsg={response} />
          </div>
        )}
      </Paper>

      {isDataAvailable && (
        <Paper elevation={3} className="marginBottom-10">
          <div className="chat-bubble assistant-bubble">
            <IsItKosher answer={response} />
          </div>
        </Paper>
      )}

      {response?.isSucess && response?.safetyChecker && (
        <Paper elevation={3} className="marginBottom-10">
          <div className="chat-bubble assistant-bubble">
            <SafetyChecker answer={response} />
          </div>
        </Paper>
      )}
      {isHatzalah && (
        <Paper elevation={3} className="marginBottom-10">
        <div>
          <HatzalahGlobalAssist answer={response} />
        </div>
        </Paper>
      )}
      {isPersonalAssistant && (
         <Paper elevation={3} className="marginBottom-10">
         <div className="chat-bubble assistant-bubble">
           <PersonalAssistant answer={response} />
          </div>
        </Paper>
      )}
      {response?.isSucess && response?.isViewReminder && response?.message && (
        <Paper elevation={3} className="marginBottom-10">
          <div className="chat-bubble assistant-bubble">
            <ReminderNotification answer={response} />
          </div>
        </Paper>
      )}
      {isHelpAgent && (
         <Paper elevation={3} className="marginBottom-10">
         <div className="chat-bubble assistant-bubble">
           <HelpAgent answer={response} />
          </div>
        </Paper>
      )}

    </div>
  );
};

export default SearchHistoryItem;
