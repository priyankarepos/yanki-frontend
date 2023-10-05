import React, { useState, useRef } from 'react';
import { Typography, Switch, FormControlLabel, Tooltip } from '@mui/material';
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { styled } from '@mui/system';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Vimeo from '@u-wave/react-vimeo';

const StyledCarouselItem = styled('div')(({ theme }) => ({
    padding: theme.spacing(2),
    textAlign: 'center',
    background: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    marginTop: '10px',
    borderRadius: theme.shape.borderRadius,
    '& iframe': {
        width: '100%',
        height: '200px',
        border: 0,
    },
}));

const TorahanytimeAnswer = ({ answer }) => {
    const [showAudioAndVideo, setShowAudioAndVideo] = useState(false);
    const data = answer?.torahAnytimeLectures?.hits?.hits || [];
    const [currentlyPlayingMedia, setCurrentlyPlayingMedia] = useState(null);
    const fixedId = 23200;

    const isAudio = answer?.torahAnytimeLectures?.isAudio || false;
    const isVideo = answer?.torahAnytimeLectures?.isVideo || false;

    const audioRefs = useRef({});
    const videoRefs = useRef({});
    const vimeoRefs = useRef({});


    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 3,
            slidesToSlide: 3
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3,
            slidesToSlide: 3
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2,
            slidesToSlide: 2
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
        },
    };

    const pauseCurrentlyPlayingMedia = () => {
        if (currentlyPlayingMedia) {
          if (currentlyPlayingMedia.type === 'audio' && audioRefs.current[currentlyPlayingMedia.itemId]) {
            audioRefs.current[currentlyPlayingMedia.itemId].pause();
          } else if (currentlyPlayingMedia.type === 'video') {
            const videoRef = videoRefs.current[currentlyPlayingMedia.itemId];
            if (videoRef && typeof videoRef.pause === 'function') {
                videoRef.pause();
            }
          } else if (currentlyPlayingMedia.type === 'vimeo' ) {
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
            return '';
        });
    };

    return (
        <Box>
            <Paper sx={{ p: 2 }}>
                {isVideo && isAudio && (
                    <div>
                        <FormControlLabel
                            control={<Switch checked={showAudioAndVideo} onChange={() => setShowAudioAndVideo(!showAudioAndVideo)} />}
                            label={`Choose Your Experience: ${!showAudioAndVideo ? "Audio Available" : "Video Available"}`}
                        />
                    </div>
                )}
                <Carousel responsive={responsive}>
                    {data?.length && data?.map((item) => (
                        <StyledCarouselItem key={item._id} className="youtube-box">
                            {isVideo && !isAudio && (
                                <div key={item._id}>
                                    {item?._id <= fixedId ? (
                                        <Vimeo
                                            id={item._id}
                                            ref={ref => vimeoRefs.current[item._id] = ref}
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
                                            // paused={false}
                                            onPlay={() => handlePlayMedia(modifyVimeoVideoLinks(item._source.vimeo_video_links)[0], 'vimeo', item._id)}
                                        />
                                    ) : (
                                        <video
                                            key={item._id}
                                            ref={ref => videoRefs.current[item._id] = ref}
                                            src={item._source.vimeo_video_links[0]}
                                            controls
                                            width="100%"
                                            height="150px"
                                            onPlay={() => handlePlayMedia(item._source.vimeo_video_links[0], 'video', item._id)}
                                        />
                                    )}
                                </div>
                            )}
                            {isAudio && !isVideo && (
                                <audio
                                    ref={ref => audioRefs.current[item._id] = ref}
                                    src={item._source.audio_url}
                                    controls
                                    width="100%"
                                    height="30px"
                                    onPlay={() => handlePlayMedia(item._source.audio_url, 'audio', item._id)}
                                />
                            )}
                            {isAudio && isVideo && (
                                <div>
                                    {showAudioAndVideo ? (
                                        <audio
                                            ref={ref => audioRefs.current[item._id] = ref}
                                            src={item._source.audio_url}
                                            controls
                                            width="100%"
                                            height="30px"
                                            onPlay={() => handlePlayMedia(item._source.audio_url, 'audio', item._id)}
                                        />
                                    ) : (
                                        <Tooltip title="Click to switch to video">
                                            <div key={item._id}>
                                                {item?._id <= fixedId ? (
                                                    <Vimeo
                                                    id={item._id}
                                                    ref={ref => vimeoRefs.current[item._id] = ref}
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
                                                    // paused={false}
                                                    onPlay={() => handlePlayMedia(modifyVimeoVideoLinks(item._source.vimeo_video_links)[0], 'vimeo', item._id)}
                                                />
                                                ) : (
                                                    <video
                                                        ref={ref => videoRefs.current[item._id] = ref}
                                                        src={item._source.vimeo_video_links[0]}
                                                        controls
                                                        width="100%"
                                                        height="150px"
                                                        onPlay={() => handlePlayMedia(item._source.vimeo_video_links[0], 'video', item._id)}
                                                    />
                                                )}
                                            </div>
                                        </Tooltip>
                                    )}
                                </div>
                            )}

                            <Typography sx={{ pt: 2 }} variant="h6" component="div">
                                <Tooltip title={item._source.title}>
                                    <div
                                        style={{
                                            maxWidth: 300,
                                            maxHeight: '70px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            '-webkit-line-clamp': 2,
                                            '-webkit-box-orient': 'vertical',
                                            textAlign: 'left',
                                        }}
                                    >
                                        {item._source.title}
                                    </div>
                                </Tooltip>
                            </Typography>
                            <Typography style={{ textAlign: 'left' }}>
                                Speaker: {item._source.speaker_name}
                            </Typography>
                        </StyledCarouselItem>
                    ))}
                </Carousel>
            </Paper>
        </Box>
    );
};

export default TorahanytimeAnswer;
