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

const HatzalahVideo = () => {
  const [showCRPVideos, setShowCRPVideos] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(null);
  const playerRefs = useRef([]);

  const handleCPRContentClick = (e) => {
    e.stopPropagation();
    setShowCRPVideos(true);
  };

  const handleAEDContentClick = (e) => {
    e.stopPropagation();
  }

  const handleChokingContentClick = (e) => {
    e.stopPropagation();
  }

  const handleAllergiesCRPContentClick = (e) => {
    e.stopPropagation();
  }

  const handleBleedingContentClick = (e) => {
    e.stopPropagation();
  }

  const vimeoVideoDetails = [
    {
      title: "road",
      link: "https://player.vimeo.com/video/920561618?h=be3ac1cc2a",
      embedLink:
        "<iframe src=https://player.vimeo.com/video/920561618?badge=0&autopause=0&player_id=0&app_id=288468 width=576 height=1024 frameborder=0 allow=autoplay; fullscreen; picture-in-picture; clipboard-write title=road></iframe>",
    },
  ];

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
      <Box onClick={(e) => e.stopPropagation()}>
        <Paper sx={{ p: 2 }}>
          <Box>
            <Typography
              onClick={handleCPRContentClick}
              className={`switch-button ${showCRPVideos ? "selected" : ""}`}
            >
              CPR
            </Typography>
            <Typography className="switch-button" onClick={handleAEDContentClick}>AED</Typography>
            <Typography className="switch-button" onClick={handleChokingContentClick}>Choking</Typography>
            <Typography className="switch-button" onClick={handleAllergiesCRPContentClick}>Allergies</Typography>
            <Typography className="switch-button" onClick={handleBleedingContentClick}>Bleeding</Typography>
          </Box>

          <Carousel responsive={responsive}>
            {showCRPVideos &&
              vimeoVideoDetails.map((item, index) => (
                <Paper key={item.title}>
                  <StyledCarouselItem
                    key={item.title}
                    className="youtube-box"
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
                          <div
                            style={{
                              maxWidth: "100%",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              "-webkit-line-clamp": 2,
                              "-webkit-box-orient": "vertical",
                              textAlign: "left",
                            }}
                          >
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
      </Box>
    </>
  );
};

export default HatzalahVideo;
