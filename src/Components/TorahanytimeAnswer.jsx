import React, { useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Typography, Switch, FormControlLabel, Tooltip } from '@mui/material';
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { styled } from '@mui/system';

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
    const isAudio = answer?.torahAnytimeLectures?.isAudio || "";
    const isVideo = answer?.torahAnytimeLectures?.isVideo || "";

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
                    {data?.map((item) => (
                        <StyledCarouselItem key={item._id} className='youtube-box'>
                            {isVideo && !isAudio && (
                                <iframe
                                    title={item._source.title}
                                    src={`https://www.torahanytime.com/embed/?v=${item._id}`}
                                    frameBorder="0"
                                    allowFullScreen
                                ></iframe>
                            )}
                            {isAudio && !isVideo && (
                                <iframe
                                    title={item._source.title}
                                    src={`https://www.torahanytime.com/embed/?a=${item._id}`}
                                    frameBorder="0"
                                    allowFullScreen
                                ></iframe>
                            )}
                            {isAudio && isVideo && (
                                <div>
                                    {showAudioAndVideo ? (
                                        <iframe
                                            title={item._source.title}
                                            src={`https://www.torahanytime.com/embed/?a=${item._id}`}
                                            frameBorder="0"
                                            allowFullScreen
                                        ></iframe>
                                    ) : (
                                        <Tooltip title="Click to switch to video">
                                            <iframe
                                                title={item._source.title}
                                                src={`https://www.torahanytime.com/embed/?v=${item._id}`}
                                                frameBorder="0"
                                                allowFullScreen
                                            ></iframe>
                                        </Tooltip>
                                    )}
                                </div>
                            )}

                            <Typography sx={{ pt: 2 }} variant="h6" component="div">
                                <Tooltip title={item._source.title}>
                                    <div style={{
                                        maxWidth: 300,
                                        maxHeight: '70px', // Two lines of text
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        '-webkit-line-clamp': 2, // Limit to two lines
                                        '-webkit-box-orient': 'vertical',
                                        textAlign: 'left'
                                    }}>
                                        {item._source.title}
                                    </div>
                                </Tooltip>
                            </Typography>
                            <Typography style={{ textAlign: 'left' }}>Speaker: {item._source.speaker_name}</Typography>
                        </StyledCarouselItem>
                    ))}
                </Carousel>
            </Paper>
        </Box>
    );
};

export default TorahanytimeAnswer;


