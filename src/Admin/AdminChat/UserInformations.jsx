import { Box, Typography, useMediaQuery } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  agentChatResponse,
  apiUrls,
} from "../../Utils/stringConstant/AgentChatResponse";
import { useParams } from "react-router-dom";

const UserInformations = () => {
  const [userDetails, setUserDetails] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const isLargeScreen = useMediaQuery((theme) =>
    theme.breakpoints.down(agentChatResponse.largeScreen)
  );
  const { id } = useParams();

  useEffect(() => {
    const fetchDetails = async () => {
      const response = await axios.get(
        `${apiUrls.getUserGeneralInformation(id)}`
      );      
      setUserDetails(response.data);
      setIsLoading(true);
    };

    fetchDetails();
  }, [id]);

  return (
    <React.Fragment>
      {isLoading && (
        <Box
          className={` ${agentChatResponse.userGeneralInfoContainer} ${
            isLargeScreen
              ? agentChatResponse.userGeneralInfoChatClose
              : agentChatResponse.userGeneralInfoChatOpen
          } `}
        >
          {!userDetails ? (
            <Typography className={agentChatResponse.userDetailsNotFound}>
              {agentChatResponse.notAddDataAICustomization}
            </Typography>
          ) : (
            <React.Fragment>
              <Box className={agentChatResponse.userGeneralInfoHeader}>
                <Typography className={agentChatResponse.userGeneralInfoHeaderTitle}>
                  {agentChatResponse.generalInformation}
                </Typography>
              </Box>
              <Box className={agentChatResponse.userGeneralInfoContent}>
                <Box className={agentChatResponse.userGeneralDetailsContent}>
                  <Box className={agentChatResponse.userGeneralDetailsContainer}>
                    <Typography className={agentChatResponse.userGeneralDetailsQuestion}>
                      {agentChatResponse.orthodoxJudaism}
                    </Typography>
                    <Typography className={agentChatResponse.userGeneralDetailsAnswer}>
                      {userDetails.judaismBranch ?? agentChatResponse.valueNotProvided }
                    </Typography>
                  </Box>
                  <Box className={agentChatResponse.userGeneralDetailsContainer}>
                    <Typography className={agentChatResponse.userGeneralDetailsQuestion}>
                      {agentChatResponse.ageRange}
                    </Typography>
                    <Typography className={agentChatResponse.userGeneralDetailsAnswer}>
                      {userDetails.ageRange ?? agentChatResponse.valueNotProvided}
                    </Typography>
                  </Box>
                  <Box className={agentChatResponse.userGeneralDetailsContainer}>
                    <Typography className={agentChatResponse.userGeneralDetailsQuestion}>
                      {agentChatResponse.maritalStatus}
                    </Typography>
                    <Typography className={agentChatResponse.userGeneralDetailsAnswer}>
                      {userDetails.maritalStatus ?? agentChatResponse.valueNotProvided}
                    </Typography>
                  </Box>
                  <Box className={agentChatResponse.userGeneralDetailsContainer}>
                    <Typography className={agentChatResponse.userGeneralDetailsQuestion}>
                      {agentChatResponse.maritalStatus}
                    </Typography>
                    <Typography className={agentChatResponse.userGeneralDetailsAnswer}>
                      {userDetails.numberOfChildren ?? agentChatResponse.valueNotProvided}
                    </Typography>
                  </Box>
                  <Box className={agentChatResponse.userGeneralDetailsContainer}>
                    <Typography className={agentChatResponse.userGeneralDetailsQuestion}>
                      {agentChatResponse.location}
                    </Typography>
                    <Typography className={agentChatResponse.userGeneralDetailsAnswer}>
                      {userDetails.location ?? agentChatResponse.valueNotProvided}
                    </Typography>
                  </Box>
                  <Box className={agentChatResponse.userGeneralDetailsContainer}>
                    <Typography className={agentChatResponse.userGeneralDetailsQuestion}>
                      {agentChatResponse.levelOfReligiousObservance}
                    </Typography>
                    <Typography className={agentChatResponse.userGeneralDetailsAnswer}>
                      {userDetails.levelOfReligiousObservance ?? agentChatResponse.valueNotProvided}
                    </Typography>
                  </Box>
                  <Box className={agentChatResponse.userGeneralDetailsContainer}>
                    <Typography className={agentChatResponse.userGeneralDetailsQuestion}>
                      {agentChatResponse.religiousPractices}
                    </Typography>
                    <Typography className={agentChatResponse.userGeneralDetailsAnswer}>
                      {userDetails.religiousPractices.join(", ") ?? agentChatResponse.valueNotProvided} 
                    </Typography>
                  </Box>
                  <Box className={agentChatResponse.userGeneralDetailsContainer}>
                    <Typography className={agentChatResponse.userGeneralDetailsQuestion}>
                      {agentChatResponse.synagogueCommunity}
                    </Typography>
                    <Typography className={agentChatResponse.userGeneralDetailsAnswer}>
                      {userDetails.synagogueCommunity ?? agentChatResponse.valueNotProvided}
                    </Typography>
                  </Box>
                  <Box className={agentChatResponse.userGeneralDetailsContainer}>
                    <Typography className={agentChatResponse.userGeneralDetailsQuestion}>
                      {agentChatResponse.updatedWithCommunityEvents}
                    </Typography>
                    <Typography className={agentChatResponse.userGeneralDetailsAnswer}>
                      {userDetails.updatedWithCommunityEvents ?? agentChatResponse.valueNotProvided}
                    </Typography>
                  </Box>

                  <Box className={agentChatResponse.userGeneralDetailsContainer}>
                    <Typography className={agentChatResponse.userGeneralDetailsQuestion}>
                      {agentChatResponse.volunteerInterests}
                    </Typography>
                    <Typography className={agentChatResponse.userGeneralDetailsAnswer}>
                      {userDetails.volunteerInterests ? agentChatResponse.yes : agentChatResponse.no ?? agentChatResponse.valueNotProvided}
                    </Typography>
                  </Box>
                </Box>
                <Box className={agentChatResponse.userOtherInformationContainer}>
                  <Typography className={agentChatResponse.userOtherInformationTitle}>
                    {agentChatResponse.religiousNeedsAndChallenges}
                  </Typography>
                  <Box className={agentChatResponse.userOtherInformationContent}>
                    <Box className={agentChatResponse.userGeneralDetailsContainer}>
                      <Typography className={agentChatResponse.userGeneralDetailsQuestion}>
                        {agentChatResponse.religiousChallenges}
                      </Typography>
                      <Typography className={agentChatResponse.userGeneralDetailsAnswer}>
                        {userDetails.religiousChallenges ?? agentChatResponse.valueNotProvided}
                      </Typography>
                    </Box>

                    <Box className={agentChatResponse.userGeneralDetailsContainer}>
                      <Typography className={agentChatResponse.userGeneralDetailsQuestion}>
                        {agentChatResponse.toolForOvercomeChallenges}
                      </Typography>
                      <Typography className={agentChatResponse.userGeneralDetailsAnswer}>
                        {userDetails.toolForOvercomeChallenges ?? agentChatResponse.valueNotProvided}
                      </Typography>
                    </Box>

                    <Box className={agentChatResponse.userGeneralDetailsContainer}>
                      <Typography className={agentChatResponse.userGeneralDetailsQuestion}>
                        {agentChatResponse.ideaToEnhanceReligiousExperience}
                      </Typography>
                      <Typography className={agentChatResponse.userGeneralDetailsAnswer}>
                        {userDetails.ideaToEnhanceReligiousExperience ?? agentChatResponse.valueNotProvided}
                      </Typography>
                    </Box>

                    <Box className={agentChatResponse.userGeneralDetailsContainer}>
                      <Typography className={agentChatResponse.userGeneralDetailsQuestion}>
                        {agentChatResponse.religiousStudies}
                      </Typography>
                      <Typography className={agentChatResponse.userGeneralDetailsAnswer}>
                        {userDetails.religiousStudies ? agentChatResponse.yes : agentChatResponse.no ?? agentChatResponse.valueNotProvided}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </React.Fragment>
          )}
        </Box>
      )}
    </React.Fragment>
  );
};

export default UserInformations;
