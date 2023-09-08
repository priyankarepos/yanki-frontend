import React, { useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Typography, Switch, FormControlLabel } from '@mui/material';
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { styled } from '@mui/system';

const StyledCarouselItem = styled('div')(({ theme }) => ({
    padding: theme.spacing(2),
    textAlign: 'center',
    background: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    '& iframe': {
        width: '100%',
        height: '200px',
        border: 0,
    },
}));

const TorahanytimeAnswer = () => {
    const [showAudioAndVideo, setShowAudioAndVideo] = useState(false);

    const data = {
        "isSucess": true,
        "message": null,
        "videoResult": null,
        "godavenPrayerDetails": null,
        "torahAnytimeLectureDtos": {
            "timed_out": false,
            "hits": {
                "hits": [
                    {
                        "_id": "99999",
                        "video": true,
                        "audio": false,
                        "audioAndVideo": false,
                        "_source": {
                            "title": "Video True",
                            "speaker_name": "R. Shay Tahan",
                            "language_name": "English",
                            "vimeo_video_links": "https://www.torahanytime.com/embed",
                            "audio_url": null
                        }
                    },
                    {
                        "_id": "99918",
                        "video": false,
                        "audio": true,
                        "audioAndVideo": false,
                        "_source": {
                            "title": "Audio True",
                            "speaker_name": "R. Shay Tahan",
                            "language_name": "English",
                            "vimeo_video_links": null,
                            "audio_url": "https://www.torahanytime.com/embed"
                        }
                    },
                    {
                        "_id": "99846",
                        "video": false,
                        "audio": false,
                        "audioAndVideo": true,
                        "_source": {
                            "title": "Audio And Video True",
                            "speaker_name": "R. Shay Tahan",
                            "language_name": "English",
                            "vimeo_video_links": "https://www.torahanytime.com/embed",
                            "audio_url": "https://www.torahanytime.com/embed"
                        }
                    },
                    {
                        "_id": "99997",
                        "video": true,
                        "audio": false,
                        "audioAndVideo": false,
                        "_source": {
                            "title": "Video True",
                            "speaker_name": "R. Shay Tahan",
                            "language_name": "English",
                            "vimeo_video_links": "https://www.torahanytime.com/embed",
                            "audio_url": null
                        }
                    },
                    {
                        "_id": "99998",
                        "video": true,
                        "audio": false,
                        "audioAndVideo": false,
                        "_source": {
                            "title": "Video True",
                            "speaker_name": "R. Shay Tahan",
                            "language_name": "English",
                            "vimeo_video_links": "https://www.torahanytime.com/embed",
                            "audio_url": null
                        }
                    },
                    {
                        "_id": "99847",
                        "video": false,
                        "audio": false,
                        "audioAndVideo": true,
                        "_source": {
                            "title": "Audio And Video True",
                            "speaker_name": "R. Shay Tahan",
                            "language_name": "English",
                            "vimeo_video_links": "https://www.torahanytime.com/embed",
                            "audio_url": "https://www.torahanytime.com/embed"
                        }
                    },
                ]
            }
        },
        "contentResponse": null
    };

    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 3
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };

    return (
        <Box>
            <Paper sx={{ p: 2 }}>
                <div>
                    <FormControlLabel
                        control={<Switch checked={showAudioAndVideo} onChange={() => setShowAudioAndVideo(!showAudioAndVideo)} />}
                        label="Show Audio and Video Together"
                    />
                </div>
                <Carousel responsive={responsive}>
                    {data.torahAnytimeLectureDtos?.hits?.hits.map((item) => (
                        <StyledCarouselItem key={item._id} className='youtube-box'>
                            <Typography variant="h6" component="div">{item._source.title}</Typography>
                            <Typography>Speaker: {item._source.speaker_name}</Typography>

                            {/* Check for video */}
                            {item.video && (
                                <iframe
                                    title={item._source.title}
                                    src={`${item._source.vimeo_video_links}?v=${item._id}`}
                                    frameBorder="0"
                                    allowFullScreen
                                ></iframe>
                            )}

                            {/* Check for audio */}
                            {item.audio && (
                                <iframe
                                    title={item._source.title}
                                    src={`${item._source.audio_url}?a=${item._id}`}
                                    frameBorder="0"
                                ></iframe>
                            )}

                            {/* Check for audio and video */}
                            {item.audioAndVideo && (
                                <div>
                                    {!showAudioAndVideo ? (
                                        <iframe
                                            title={item._source.title}
                                            src={`${item._source.vimeo_video_links}?v=${item._id}`}
                                            frameBorder="0"
                                        ></iframe>
                                    ) : (
                                        <iframe
                                            title={item._source.title}
                                            src={`${item._source.vimeo_video_links}?a=${item._id}`}
                                            frameBorder="0"
                                        ></iframe>
                                    )}
                                </div>
                            )}
                        </StyledCarouselItem>
                    ))}
                </Carousel>
            </Paper>
        </Box>
    );
};

export default TorahanytimeAnswer;

