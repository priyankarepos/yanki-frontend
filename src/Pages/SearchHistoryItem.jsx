import React, { forwardRef, useState } from "react";
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
import InteractiveQuestionnaire from "../Components/InteractiveQuestionnaire/InteractiveQuestionnaire";

const SearchHistoryItem = forwardRef(
  ({ query, response, fetchRemainingMessage, remainingMsgData }, ref) => {
    const [direction, setDirection] = useState("ltr");
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

    const isTorahAnswer =
      response?.isSuccess &&
      response?.torahAnytimeLectures?.hits?.hits?.length > 0;
    const isGovadenAnswer =
      response?.isSuccess && response?.godavenPrayerDetails?.length;
    const isDataAvailable =
      response?.isItKosher?.isSuccess &&
      response?.isItKosher?.products?.data.length > 0;
    const isHatzalah =
      response.isSuccess &&
      response.message &&
      response?.globalAssist?.isSuccess;
    const isPersonalAssistant =
      response.isSuccess && response.message && response.isPersonalAssistant;
    const isHelpAgent = response.contentResponse && response.isHelpAgent;
    return (
      <div
        ref={ref}
        className={`search-history-item ${isTorahAnswer || isGovadenAnswer ? "with-response" : ""
          }`}
      >
        <Paper elevation={3} className="search-query" dir={direction}>
          <Box className="search-query-container">
            <ChatBubbleOutlineIcon
              fontSize="small"
              className={`marginX-8 ${activeTab === 0 ? "white-color" : "sky-blue-color"
                }`}
            />
            <Typography
              className={activeTab === 0 ? "white-color" : "sky-blue-color"}
            >
              {query}
            </Typography>
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

        {response?.isSuccess &&
          response?.contentResponse &&
          !response.isHelpAgent &&
          (response.enterprisePdfNames === null ||
            (Array.isArray(response.enterprisePdfNames) &&
              response.enterprisePdfNames.length === 0)) && (
            <Paper elevation={3} className="marginBottom-10">
              <div className="chat-bubble assistant-bubble">
                <SentenceAnswer
                  fetchRemainingMessage={fetchRemainingMessage}
                  answer={response}
                />
              </div>
            </Paper>
          )}

        {response?.isSuccess &&
          !response?.contentResponse &&
          response?.message &&
          !response?.globalAssist &&
          !response?.globalAssist?.isSuccess &&
          !response?.safetyChecker &&
          !response?.isEvent &&
          !response?.isPersonalAssistant &&
          !response?.isViewReminder && (
            <Paper elevation={3} className="marginBottom-10">
              <div className="chat-bubble assistant-bubble">
                <DemoEnterpriseChat
                  fetchRemainingMessage={fetchRemainingMessage}
                  answer={response}
                />
              </div>
            </Paper>
          )}

        {response?.isSuccess &&
          response?.pdfNames &&
          response?.pdfNames.length > 0 && (
            <Paper elevation={3} className="marginBottom-10">
              <div className="chat-bubble assistant-bubble">
                <PdfAnswers answer={response} />
              </div>
            </Paper>
          )}

        {response?.isSuccess &&
          response?.vimeoVideoDetails &&
          response?.vimeoVideoDetails.length > 0 &&
          response?.isExclusiveContent && (
            <Paper elevation={3} className="marginBottom-10">
              <div className="chat-bubble assistant-bubble">
                <YoutubeContent answer={response} />
              </div>
            </Paper>
          )}

        {response?.isSuccess &&
          response?.contentResponse &&
          response?.enterprisePdfNames &&
          response?.enterprisePdfNames.length > 0 && (
            <Paper elevation={3} className="marginBottom-10">
              <div className="chat-bubble assistant-bubble">
                <EnterprisePdfAnswer answer={response} />
              </div>
            </Paper>
          )}

        {response?.isSuccess &&
          response?.isEvent &&
          response?.message &&
          activeTab === 0 && (
            <Paper elevation={3} className="marginBottom-10">
              <div className="chat-bubble assistant-bubble">
                <EventPublicationForm answer={response} />
              </div>
            </Paper>
          )}

        <Paper elevation={3} className="marginBottom-10">
          {response.isSuccess === false &&
            !response.isHelpAgent &&
            (response?.message || response?.contentResponse) && (
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

        {response?.isSuccess && response?.safetyChecker && (
          <Paper elevation={3} className="marginBottom-10">
            <div className="chat-bubble assistant-bubble">
              <SafetyChecker
                fetchRemainingMessage={fetchRemainingMessage}
                answer={response}
              />
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
              <PersonalAssistant
                fetchRemainingMessage={fetchRemainingMessage}
                answer={response}
              />
            </div>
          </Paper>
        )}
        {response?.isSuccess &&
          response?.isViewReminder &&
          response?.message && (
            <Paper elevation={3} className="marginBottom-10">
              <div className="chat-bubble assistant-bubble">
                <ReminderNotification answer={response} />
              </div>
            </Paper>
          )}
        {isHelpAgent && (
          <Paper elevation={3} className="marginBottom-10">
            <div className="chat-bubble assistant-bubble">
              <HelpAgent
                fetchRemainingMessage={fetchRemainingMessage}
                answer={response}
                remainingMsgData={remainingMsgData}
              />
            </div>
          </Paper>
        )}
        {response?.isSuccess && response?.isLashonHara && (<Paper elevation={3} className="marginBottom-10">
          <div className="chat-bubble assistant-bubble">
            <InteractiveQuestionnaire />
          </div>
        </Paper>)}

      </div>
    );
  }
);

export default SearchHistoryItem;
