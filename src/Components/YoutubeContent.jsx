import React, { useState, useRef } from "react";
import { Typography, Tooltip, Paper } from "@mui/material";
import Box from "@mui/material/Box";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Vimeo from "@u-wave/react-vimeo";
import { styled } from "@mui/system";
import "./AnswerStyle.scss";

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

const YoutubeContent = ({ answer }) => {
  const [showYouTubeVideos, setShowYouTubeVideos] = useState(null); // Set an initial value for showYouTubeVideos
  const data = answer?.torahAnytimeLectures?.hits?.hits || [];
  const [currentlyPlayingMedia, setCurrentlyPlayingMedia] = useState(null);
  const fixedId = 23200;
  const [currentVideoIndex, setCurrentVideoIndex] = useState(null);
  const playerRefs = useRef([]);
  const isVideo = answer?.torahAnytimeLectures?.isVideo || false;

  const videoRefs = useRef({});
  const vimeoRefs = useRef({});

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

  const pauseCurrentlyPlayingMedia = () => {
    if (currentlyPlayingMedia) {
      if (currentlyPlayingMedia.type === "video") {
        const videoRef = videoRefs.current[currentlyPlayingMedia.itemId];
        if (videoRef && typeof videoRef.pause === "function") {
          videoRef.pause();
        }
      } else if (currentlyPlayingMedia.type === "vimeo") {
        vimeoRefs.current[currentlyPlayingMedia.itemId].player.pause();
      }
      setCurrentlyPlayingMedia(null);
    }
  };

  const handlePlayMedia = (mediaUrl, type, itemId) => {
    if (currentlyPlayingMedia && currentlyPlayingMedia.itemId === itemId) {
      pauseCurrentlyPlayingMedia();
    } else {
      pauseCurrentlyPlayingMedia();
      setCurrentlyPlayingMedia({ url: mediaUrl, type, itemId });
    }
  };

  const modifyVimeoVideoLinks = (links) => {
    return links.map((link) => {
      const videoIdMatch = link.match(/(\d+)/);
      if (videoIdMatch) {
        const videoId = videoIdMatch[0];
        return `https://player.vimeo.com/video/${videoId}`;
      }
      return "";
    });
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

  const handleExclusiveContentClick = (e) => {
    e.stopPropagation();
    setShowYouTubeVideos(true);
  };

  const handleTorahanytimeClick = (e) => {
    e.stopPropagation();
    setShowYouTubeVideos(false);
  };

  return (
    <Box onClick={(e) => e.stopPropagation()}>
      <Paper sx={{ p: 2 }}>
        {isVideo &&
          answer?.vimeoVideoDetails &&
          answer?.torahAnytimeLectures &&
          answer?.vimeoVideoDetails &&
          answer?.vimeoVideoDetails.length > 0 && (
            <Box className="youtube-container">
              <Typography className="marginBottom-10">
                We have found data on multiple sources. Please select a source
                to give you the most accurate result
              </Typography>
              <Typography
                onClick={handleExclusiveContentClick}
                className={`switch-button ${
                  showYouTubeVideos ? "selected" : ""
                }`}
              >
                Exclusive Content
              </Typography>
              <Typography
                onClick={handleTorahanytimeClick}
                className={`switch-button ${
                  showYouTubeVideos === false ? "selected" : ""
                }`}
              >
                TorahAnytime
              </Typography>
            </Box>
          )}

        <Carousel responsive={responsive}>
          {showYouTubeVideos ||
          (answer.vimeoVideoDetails && !answer?.torahAnytimeLectures.isSucess)
            ? answer?.vimeoVideoDetails.map((item, index) => (
                <Paper key={item.title}>
                  <StyledCarouselItem
                    key={item._id}
                    className="marginRight-5"
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
                          <div className="torahanytime-source-title">
                            {item.title}
                          </div>
                        </Tooltip>
                      </Typography>
                    </div>
                  </StyledCarouselItem>
                </Paper>
              ))
            : showYouTubeVideos === false &&
              data.length &&
              data?.map((item) =>
                isVideo &&
                (!item._source.vimeo_video_links ||
                  !item._source.vimeo_video_links.length) ? null : (
                  <StyledCarouselItem
                    key={item._id}
                    className="marginRight-5"
                  >
                    {showYouTubeVideos === false &&
                      isVideo &&
                      item._source.vimeo_video_links &&
                      item._source.vimeo_video_links?.length && (
                        <div key={item._id}>
                          {item?._id <= fixedId ? (
                            <Vimeo
                              id={item._id}
                              ref={(ref) => (vimeoRefs.current[item._id] = ref)}
                              video={
                                modifyVimeoVideoLinks(
                                  item._source.vimeo_video_links
                                )[0]
                              }
                              width="100%"
                              height="150px"
                              autoplay={false}
                              controls={true}
                              showByline={false}
                              showTitle={false}
                              showPortrait={false}
                              loop={false}
                              autopause={true}
                              // paused={false}
                              onPlay={() =>
                                handlePlayMedia(
                                  modifyVimeoVideoLinks(
                                    item._source.vimeo_video_links
                                  )[0],
                                  "vimeo",
                                  item._id
                                )
                              }
                            />
                          ) : (
                            <video
                              key={item._id}
                              ref={(ref) => (videoRefs.current[item._id] = ref)}
                              src={item._source.vimeo_video_links[0]}
                              controls
                              width="100%"
                              height="150px"
                              onPlay={() =>
                                handlePlayMedia(
                                  item._source.vimeo_video_links[0],
                                  "video",
                                  item._id
                                )
                              }
                            />
                          )}
                        </div>
                      )}
                    {
                      <div>
                        <Typography sx={{ pt: 2 }} variant="h6" component="div">
                          <Tooltip title={item._source.title}>
                            <div className="video-title">
                              {item._source.title}
                            </div>
                          </Tooltip>
                        </Typography>
                        <Typography className="torahanytime-source-speakerName">
                          Speaker: {item._source.speaker_name}
                        </Typography>
                      </div>
                    }
                  </StyledCarouselItem>
                )
              )}
        </Carousel>
      </Paper>
    </Box>
  );
};

export default YoutubeContent;
