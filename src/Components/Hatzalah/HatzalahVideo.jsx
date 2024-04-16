import React, { useState, useRef } from "react";
import { Paper, Typography, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import Carousel from "react-multi-carousel";
import Vimeo from "@u-wave/react-vimeo";
import { styled } from "@mui/system";
import "react-multi-carousel/lib/styles.css";

const StyledCarouselItem = styled("div")(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  background: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  marginTop: "10px",
  borderRadius: theme.shape.borderRadius,
  "& iframe": {
    width: "100%",
    height: "200px",
    border: 0,
  },
}));

const HatzalahVideo = ({ video }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(null);
  const [videoDetails, setVideoDetails] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const playerRefs = useRef([]);

  const handleCPRContentClick = (e) => {
    e.stopPropagation();
    setVideoDetails(null);
    setSelectedClass("CPR");
    setVideoDetails([
      {
        title: "Adult CPR",
        link: video["cprVideos"]["adultCpr"],
      },
      {
        title: "Baby CPR",
        link: video["cprVideos"]["babyCpr"],
      },
    ]);
  };

  const handleAEDContentClick = (e) => {
    e.stopPropagation();
    setVideoDetails(null);
    setSelectedClass("AED");
    setVideoDetails([
      {
        title: "AED",
        link: video["aedVideos"]["aedVideo"],
      },
    ]);
  };

  const handleChokingContentClick = (e) => {
    e.stopPropagation();
    setVideoDetails(null);
    setSelectedClass("Choking");
    setVideoDetails([
      {
        title: "Choking Adult",
        link: video["chokingVideos"]["chokingAdult"],
      },
      {
        title: "Choking Alone",
        link: video["chokingVideos"]["chokingAlone"],
      },
      {
        title: "Choking Baby",
        link: video["chokingVideos"]["chokingBaby"],
      },
    ]);
  };

  const handleAllergiesContentClick = (e) => {
    e.stopPropagation();
    setVideoDetails(null);
    setSelectedClass("Allergies");
    setVideoDetails([
      {
        title: "Allergies",
        link: video["allergieVideos"]["allergiesVideo"],
      },
    ]);
  };

  const handleBleedingContentClick = (e) => {
    e.stopPropagation();
    setVideoDetails(null);
    setSelectedClass("Bleeding");
    setVideoDetails([
      {
        title: "Bleeding",
        link: video["bleedingVideos"]["bleedingVideo"],
      },
    ]);
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 6000, min: 3000 },
      items: 3,
      slidesToSlide: 3,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const handleVideoPlay = (index) => {
    if (currentVideoIndex !== null && playerRefs.current[currentVideoIndex]) {
      const currentVideoPlayer = playerRefs.current[currentVideoIndex];
      if (currentVideoPlayer.pauseVideo) {
        currentVideoPlayer.pauseVideo();
      } else if (currentVideoPlayer.pause) {
        currentVideoPlayer.pause();
      }
    }
    setCurrentVideoIndex(index);
  };

  const onReady = (event, index) => {
    playerRefs.current[index] = event.target;
  };
  return (
    <>
      <Paper sx={{ p: 2 }} onClick={(e) => e.stopPropagation()}>
        <Box>
          <Typography
            onClick={handleCPRContentClick}
            className={`switch-button ${
              selectedClass === "CPR" ? "selected" : ""
            }`}
          >
            CPR
          </Typography>
          <Typography
            className={`switch-button ${
              selectedClass === "AED" ? "selected" : ""
            }`}
            onClick={handleAEDContentClick}
          >
            AED
          </Typography>
          <Typography
            className={`switch-button ${
              selectedClass === "Choking" ? "selected" : ""
            }`}
            onClick={handleChokingContentClick}
          >
            Choking
          </Typography>
          <Typography
            className={`switch-button ${
              selectedClass === "Allergies" ? "selected" : ""
            }`}
            onClick={handleAllergiesContentClick}
          >
            Allergies
          </Typography>
          <Typography
            className={`switch-button ${
              selectedClass === "Bleeding" ? "selected" : ""
            }`}
            onClick={handleBleedingContentClick}
          >
            Bleeding
          </Typography>
        </Box>

        <Carousel responsive={responsive}>
          {selectedClass != null &&
            videoDetails.map((item, index) => (
              <Paper key={item.title}>
                <StyledCarouselItem
                  key={item.title}
                  sx={{ marginRight: "5px" }}
                >
                  {item.link && (
                    <div>
                      <Vimeo
                        id={item.link.split("v=")[1]}
                        onReady={(event) => onReady(event, index)}
                        onPlay={() => handleVideoPlay(index)}
                        video={item.link}
                        width="100%"
                        height="150px"
                        autoplay={false}
                        controls={true}
                        showByline={false}
                        showTitle={false}
                        showPortrait={false}
                        loop={false}
                        autopause={true}
                      />
                    </div>
                  )}
                  <div>
                    <Typography variant="h6" component="div">
                      <Tooltip title={item.title}>
                        <div className="hatzala-video-title">
                          {item.title}
                        </div>
                      </Tooltip>
                    </Typography>
                  </div>
                </StyledCarouselItem>
              </Paper>
            ))}
        </Carousel>
      </Paper>
    </>
  );
};

export default HatzalahVideo;
