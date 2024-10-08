import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { pdfjs } from 'react-pdf';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { Grid, Paper, Typography, useMediaQuery, CircularProgress } from '@mui/material';
import { Button } from '@mui/base';
import "./AnswerStyle.scss";
import { Box } from '@mui/system';
import { useTranslation } from "react-i18next";
import { classNames, messages } from '../Utils/stringConstant/stringConstant';
import { agentChatResponse } from '../Utils/stringConstant/AgentChatResponse';

const PdfAnswers = ({ answer }) => {
    const { t } = useTranslation();
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [pdfLoadError, setPdfLoadError] = useState(false);
    const [visiblePdfCount, setVisiblePdfCount] = useState(2);
    const [thumbnailUrls, setThumbnailUrls] = useState([]);
    const [loadingThumbnails, setLoadingThumbnails] = useState([]);

    const pdfNames = useMemo(() => answer?.pdfNames || [], [answer?.pdfNames]);
    const s3BaseUrl = import.meta.env.VITE_APP_S3_BASE_URL;

    const isLargeScreenOne = useMediaQuery((theme) => theme.breakpoints.up(agentChatResponse.largeScreen));
    const isMediumScreen = useMediaQuery((theme) => theme.breakpoints.between(agentChatResponse.mediumScreen, agentChatResponse.largeScreen));
    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.between(agentChatResponse.smallScreen, agentChatResponse.mediumScreen));

    useEffect(() => {
        if (isLargeScreenOne) {
            setVisiblePdfCount(3);
        } else if (isMediumScreen) {
            setVisiblePdfCount(3);
        } else if (isSmallScreen) {
            setVisiblePdfCount(2);
        }
    }, [isLargeScreenOne, isMediumScreen, isSmallScreen, pdfNames])

    const openPdfModal = (pdfName) => {
        const cleanPdfName = pdfName.replace(/%27/g, '');
        const pdfUrl = `${s3BaseUrl}${cleanPdfName}`;
        setSelectedPdf(pdfUrl);
        setPdfLoadError(false);
    };

    const closePdfModal = () => {
        setSelectedPdf(null);
    };

    const isLargeScreen = useMediaQuery(messages.isLargeScreen);

    const renderPdfModal = () => {
        return (
            <Modal
                open={Boolean(selectedPdf)}
                onClose={closePdfModal}
                aria-labelledby="pdf-modal-title"
                aria-describedby="pdf-modal-description"
                className='enterprise-pdfAnswer-modal'
            >
                <div className="pdf-modal">
                    <IconButton
                        style={{ position: 'absolute', top: !isLargeScreen ? '40px' : '20px' }}
                        onClick={closePdfModal}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    {pdfLoadError ? (
                        <div>{t('errorLoadingPDF')}</div>
                    ) : (
                        <Worker workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`}>
                            <Viewer fileUrl={selectedPdf} />
                        </Worker>
                    )}
                </div>
            </Modal>
        );
    };

    const handleLoadMore = () => {
        setVisiblePdfCount((prevCount) => prevCount + 2);
    };

    const generateThumbnail = useCallback(async (pdfName) => {
        const pdfUrl = `${s3BaseUrl}${pdfName}`;
        try {
            const pdf = await pdfjs.getDocument(pdfUrl).promise;
            const page = await pdf.getPage(1);
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            const viewport = page.getViewport({ scale: 1.0 });
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const renderContext = { canvasContext: context, viewport: viewport };
            await page.render(renderContext).promise;
            const thumbnailUrl = canvas.toDataURL();
            return thumbnailUrl;
        } catch (error) {
            return null;
        }
    }, [s3BaseUrl]);

    useEffect(() => {
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

        const loadThumbnails = async () => {
            const newThumbnails = await Promise.all(
                pdfNames.slice(thumbnailUrls.length, visiblePdfCount).map(async (pdfName, index) => {
                    setLoadingThumbnails((prev) => {
                        const updatedLoading = [...prev];
                        updatedLoading[thumbnailUrls.length + index] = true;
                        return updatedLoading;
                    });

                    const thumbnailUrl = await generateThumbnail(pdfName);

                    setLoadingThumbnails((prev) => {
                        const updatedLoading = [...prev];
                        updatedLoading[thumbnailUrls.length + index] = false;
                        return updatedLoading;
                    });

                    return thumbnailUrl;
                })
            );

            setThumbnailUrls((prev) => [...prev, ...newThumbnails]);
        };

        if (pdfNames.length > thumbnailUrls.length) {
            setLoadingThumbnails(new Array(pdfNames.length).fill(false));
            loadThumbnails();
        }
    }, [pdfNames, visiblePdfCount, generateThumbnail, thumbnailUrls.length]);

    return (
        <Paper sx={{ p: 2 }}>
            <Grid container spacing={2}>
                {pdfNames.slice(0, visiblePdfCount).map((pdfName, index) => (
                    <Grid item lg={4} md={6} sm={6} xs={12} key={index}>
                        <div
                            className='pdf-box'
                            onClick={() => openPdfModal(pdfName)}
                        >
                            {loadingThumbnails[index] ? (
                                <Box className={classNames.pdfLoaderContainer}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <img
                                    src={thumbnailUrls[index]}
                                    alt={`${pdfName.replace('.pdf', '')} thumbnail`}
                                />
                            )}
                            <Typography className='enterprise-pdf-name marginTop-10'> {pdfName}</Typography>
                        </div>
                    </Grid>
                ))}
            </Grid>
            {pdfNames.length > visiblePdfCount && (
                <Button
                    className={classNames.pdfButtonStyle}
                    variant="contained"
                    fullWidth
                    onClick={handleLoadMore}
                >
                    {t('loadMore')}
                </Button>
            )}
            {renderPdfModal()}
        </Paper>
    );
};

export default PdfAnswers;
