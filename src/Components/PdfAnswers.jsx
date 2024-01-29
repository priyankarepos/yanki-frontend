import React, { useEffect, useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { pdfjs } from 'react-pdf';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import '@react-pdf-viewer/core/lib/styles/index.css'; // Import styles for PDF viewer
import { Grid, Paper, Typography, useMediaQuery } from '@mui/material';
import { Button } from '@mui/base';
import "./AnswerStyle.scss"
import { Box } from '@mui/system';

const PdfAnswers = ({ answer }) => {
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [pdfLoadError, setPdfLoadError] = useState(false);
    const [visiblePdfCount, setVisiblePdfCount] = useState(2);

    const pdfNames = answer?.pdfNames || [];
    console.log("pdfNames", pdfNames);
    const s3BaseUrl = "https://jewishprayer-text-pdf.s3.amazonaws.com/";

    const openPdfModal = (pdfName) => {
        const cleanPdfName = pdfName.replace(/%27/g, '');
        const pdfUrl = `${s3BaseUrl}${cleanPdfName}`;
        setSelectedPdf(pdfUrl);
        setPdfLoadError(false);
    };

    const closePdfModal = () => {
        setSelectedPdf(null);
    };

    const isLargeScreen = useMediaQuery("(min-width: 600px)");

    const renderPdfModal = () => {
        return (
            <Modal
                open={Boolean(selectedPdf)}
                onClose={closePdfModal}
                aria-labelledby="pdf-modal-title"
                aria-describedby="pdf-modal-description"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div className="pdf-modal" style={{ width: '90vw', height: '88vh', position: 'relative' }}>
                    <IconButton
                        style={{ position: 'absolute', top: !isLargeScreen ? '40px' : '20px', right: '8px', zIndex: 1, backgroundColor: "#6fa8dd", }}
                        onClick={closePdfModal}
                        aria-label="close"
                    >
                        <CloseIcon style={{ color: "#fff" }} />
                    </IconButton>
                    {pdfLoadError ? (
                        <div>Error loading PDF. Please try again.</div>
                    ) : (
                        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}>
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

    useEffect(() => {
        setVisiblePdfCount(2);
    }, [answer]);

    return (
        <Paper sx={{
            p: 2,
        }}>
            <Grid
                container
                spacing={2}
            >
                {pdfNames.slice(0, visiblePdfCount).map((pdfName, index) => (

                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <div
                        className='pdf-box'
                            key={index}
                            onClick={() => openPdfModal(pdfName)}
                        >
                            <img
                                src={`https://jewishprayer-text-pdf.s3.amazonaws.com/${pdfName.replace('.pdf', '.jpg')}`}
                                alt={`${pdfName.replace('.pdf', '')} thumbnail`}
                            />
                            <Typography style={{ fontSize: "16px", textAlign: "center", color: "#fff", marginTop: "10px", }}> {pdfName}</Typography>
                        </div>
                    </Grid>
                ))}
            </Grid>
            <Box className='button-style'>
                {pdfNames.length > visiblePdfCount && (
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={handleLoadMore}
                    >
                        Load More
                    </Button>
                )}
            </Box>
            {renderPdfModal()}
        </Paper>
    );
};

export default PdfAnswers;
