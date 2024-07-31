import React, { useState, useRef } from "react";
import { Typography, Switch, FormControlLabel, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/system";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Vimeo from "@u-wave/react-vimeo";
import { useTranslation } from 'react-i18next';

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

const TorahanytimeAnswer = ({ answer }) => {
  const { t } = useTranslation();
  const [showAudioAndVideo, setShowAudioAndVideo] = useState(false);
  const rawData = answer?.torahAnytimeLectures?.hits?.hits || [];
  const validData = rawData.filter(item => item._source.vimeo_video_links !== null);
  const data = validData; 
  const [currentlyPlayingMedia, setCurrentlyPlayingMedia] = useState(null);
  const fixedId = 23200;

  const isAudio = answer?.torahAnytimeLectures?.isAudio || false;
  const isVideo = answer?.torahAnytimeLectures?.isVideo || false;
  const isVimeoVideoLink = data.map(item => item._source.vimeo_video_links)
  const isAudioLink = data.map(item => item._source.audio_url)
  const hasValidVimeoLinks = Array.isArray(isVimeoVideoLink) && isVimeoVideoLink.some(linkArray => Array.isArray(linkArray) && linkArray.length > 0);

  const audioRefs = useRef({});
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
      if (
        currentlyPlayingMedia.type === "audio" &&
        audioRefs.current[currentlyPlayingMedia.itemId]
      ) {
        audioRefs.current[currentlyPlayingMedia.itemId].pause();
      } else if (currentlyPlayingMedia.type === "video") {
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

  const isDirectVideoLink = (link) => {
    const pattern = /https:\/\/dl\.torahanytime\.com\/.*\.MPG\.mp4$/;
    return pattern.test(link);
  };

  const modifyVimeoVideoLinks = (links) => {
    return links.map((link) => {
      if (isDirectVideoLink(link)) {
        return link;
      }
      const videoIdMatch = link.match(/(\d+)/);
      if (videoIdMatch) {
        const videoId = videoIdMatch[0];
        return `https://player.vimeo.com/video/${videoId}`;
      }
      return "";
    });
  };

  const [switchDisabled, setSwitchDisabled] = useState(false);

  return (
    <Box onClick={(e) => e.stopPropagation()}>
      <Paper sx={{ p: 2 }}>
        {isAudio && isVideo && hasValidVimeoLinks && isAudioLink?.length > 0 && (
          <div>
            <FormControlLabel
              control={
                <Switch
                  checked={showAudioAndVideo}
                  onChange={() => {
                    setSwitchDisabled(true);
                    setShowAudioAndVideo(!showAudioAndVideo);
                    setTimeout(() => {
                      setSwitchDisabled(false);
                    }, 500); // Adjust the delay as needed
                  }}
                  disabled={switchDisabled}
                />
              }
              label={`${t('chooseYourExperience')} ${!showAudioAndVideo ? `${t('audioAvailable')}` : `${t('videoAvailable')}`}`}
            />
          </div>
        )}

        <Carousel responsive={responsive}>
          {data?.length > 0 &&
            data.map((item) => (
              <StyledCarouselItem key={item._id} className="marginRight-5">
                {/* Check for Video Only */}
                {isVideo && !isAudio && item._source.vimeo_video_links && item._source.vimeo_video_links.length > 0 && (
                  <div key={item._id}>
                    {item._id <= fixedId ? (
                      isDirectVideoLink(item._source.vimeo_video_links[0]) ? (
                        <video
                          key={item._id}
                          ref={(ref) => (videoRefs.current[item._id] = ref)}
                          src={item._source.vimeo_video_links[0]}
                          controls
                          width="100%"
                          height="150px"
                          onPlay={() => handlePlayMedia(item._source.vimeo_video_links[0], "video", item._id)}
                        />
                      ) : (
                        <Vimeo
                          id={item._id}
                          ref={(ref) => (vimeoRefs.current[item._id] = ref)}
                          video={modifyVimeoVideoLinks(item._source.vimeo_video_links)[0]}
                          width="100%"
                          height="150px"
                          autoplay={false}
                          controls={true}
                          showByline={false}
                          showTitle={false}
                          showPortrait={false}
                          loop={false}
                          autopause={true}
                          onPlay={() => handlePlayMedia(modifyVimeoVideoLinks(item._source.vimeo_video_links)[0], "vimeo", item._id)}
                        />
                      )
                    ) : (
                      <video
                        key={item._id}
                        ref={(ref) => (videoRefs.current[item._id] = ref)}
                        src={item._source.vimeo_video_links[0]}
                        controls
                        width="100%"
                        height="150px"
                        onPlay={() => handlePlayMedia(item._source.vimeo_video_links[0], "video", item._id)}
                      />
                    )}
                  </div>
                )}

                {/* Check for Audio Only */}
                {isAudio && !isVideo && item._source.audio_url && (
                  <audio
                    ref={(ref) => (audioRefs.current[item._id] = ref)}
                    src={item._source.audio_url}
                    controls
                    width="100%"
                    height="30px"
                    onPlay={() => handlePlayMedia(item._source.audio_url, "audio", item._id)}
                  />
                )}

                {/* Check for Both Audio and Video */}
                {isAudio && isVideo && item._source.vimeo_video_links && item._source.vimeo_video_links.length > 0 && (
                  <div>
                    {showAudioAndVideo ? (
                      <audio
                        ref={(ref) => (audioRefs.current[item._id] = ref)}
                        src={item._source.audio_url}
                        controls
                        style={{
                          width: "100%",
                          "@media (max-width: 600px)": {
                            width: "220px !important",
                          },
                        }}
                        onPlay={() => handlePlayMedia(item._source.audio_url, "audio", item._id)}
                      />
                    ) : (
                      <Tooltip title="Click to switch to video">
                        <div key={item._id}>
                          {item._id <= fixedId ? (
                            isDirectVideoLink(item._source.vimeo_video_links[0]) ? (
                              <video
                                key={item._id}
                                ref={(ref) => (videoRefs.current[item._id] = ref)}
                                src={item._source.vimeo_video_links[0]}
                                controls
                                width="100%"
                                height="150px"
                                onPlay={() => handlePlayMedia(item._source.vimeo_video_links[0], "video", item._id)}
                              />
                            ) : (
                              <Vimeo
                                id={item._id}
                                ref={(ref) => (vimeoRefs.current[item._id] = ref)}
                                video={modifyVimeoVideoLinks(item._source.vimeo_video_links)[0]}
                                width="100%"
                                height="150px"
                                autoplay={false}
                                controls={true}
                                showByline={false}
                                showTitle={false}
                                showPortrait={false}
                                loop={false}
                                autopause={true}
                                onPlay={() => handlePlayMedia(modifyVimeoVideoLinks(item._source.vimeo_video_links)[0], "vimeo", item._id)}
                              />
                            )
                          ) : (
                            <video
                              key={item._id}
                              ref={(ref) => (videoRefs.current[item._id] = ref)}
                              src={item._source.vimeo_video_links[0]}
                              controls
                              width="100%"
                              height="150px"
                              onPlay={() => handlePlayMedia(item._source.vimeo_video_links[0], "video", item._id)}
                            />
                          )}
                        </div>
                      </Tooltip>
                    )}
                  </div>
                )}

                {/* Default Audio Player */}
                {isAudio && isVideo && !hasValidVimeoLinks && item._source.audio_url && (
                  <audio
                    ref={(ref) => (audioRefs.current[item._id] = ref)}
                    src={item._source.audio_url}
                    controls
                    style={{
                      width: "100%",
                      "@media (max-width: 600px)": {
                        width: "220px !important",
                      },
                    }}
                    onPlay={() => handlePlayMedia(item._source.audio_url, "audio", item._id)}
                  />
                )}

                <div>
                  <Typography sx={{ pt: 2 }} variant="h6" component="div">
                    <Tooltip title={item._source.title}>
                      <div className="torahanytime-source-title">
                        {item._source.title}
                      </div>
                    </Tooltip>
                  </Typography>
                  <Typography className="torahanytime-source-speakerName">
                    Speaker: {item._source.speaker_name}
                  </Typography>
                </div>
              </StyledCarouselItem>
            ))}
        </Carousel>
      </Paper>
    </Box>
  );
};

export default TorahanytimeAnswer;
