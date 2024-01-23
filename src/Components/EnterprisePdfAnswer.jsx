import React, { useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { pdfjs } from 'react-pdf';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { Box, Grid, Paper, Typography } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import "./AnswerStyle.scss";
import Tooltip from '@mui/material/Tooltip';

const PdfModal = ({ isOpen, onClose, pdfUrl, isPdf }) => {
    const [pdfLoadError, setPdfLoadError] = useState(false);

    const closeModal = () => {
        setPdfLoadError(false);
        onClose();
    };

    return (
        <Modal
            open={isOpen}
            onClose={closeModal}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <div className="pdf-modal" style={{ width: '90vw', height: '88vh', position: 'relative' }}>
                <IconButton
                    style={{ position: 'absolute', top: '20px', right: '8px', zIndex: 1, backgroundColor: "#6fa8dd" }}
                    onClick={closeModal}
                    aria-label="close"
                >
                    <CloseIcon style={{ color: "#fff" }} />
                </IconButton>
                {!pdfLoadError ? (
                    <>
                        {isPdf ? (
                            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}>
                                <Viewer fileUrl={pdfUrl} />
                            </Worker>
                        ) : (
                            <img
                                src={pdfUrl}
                                alt="PDF Document"
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                onError={() => setPdfLoadError(true)}
                            />
                        )}
                    </>
                ) : (
                    <div>Error loading content. Please try again.</div>
                )}
            </div>
        </Modal>
    );
};

const EnterprisePdfAnswer = ({ answer }) => {
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [showPdfGrid, setShowPdfGrid] = useState(false);

    const getShortPdfName = (pdfName) => pdfName ? pdfName.split('/').pop() : '';

    const handleSeePdfClick = () => {
        setShowPdfGrid(!showPdfGrid);
        setSelectedPdf(null);
    };


    const handleItemClick = (pdfUrl) => {
        setSelectedPdf(pdfUrl);
    };

    const closePdfModal = () => {
        setSelectedPdf(null);
    };

    return (
        <Paper sx={{
            p: 2,
        }}>
            <Box>
                <Typography variant="h6" component="div" style={{ fontSize: "16px", marginBottom: "12px", }}>
                    {answer?.contentResponse}
                </Typography>
            </Box>
            <Typography variant="h6" component="div" className="enterprise-pdf-icon" onClick={handleSeePdfClick}>
                <Tooltip title="Enterprise document" arrow>
                    <span className='cursor-pointer flex'><PictureAsPdfIcon /></span>
                </Tooltip>
            </Typography>
            {showPdfGrid && (
                <Grid container spacing={2} className='enterprise-pdf-btn'>
                    {answer?.enterprisePdfNames.map((pdfName, index) => (
                        <Grid item lg={4} md={6} sm={6} xs={12} key={index}>
                            <div
                                style={{
                                    backgroundColor: "rgb(47, 88, 125)",
                                    cursor: 'pointer',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                onClick={() => handleItemClick(pdfName)}
                            >
                                <Tooltip title={pdfName} arrow>
                                    <Typography style={{ fontSize: "16px", textAlign: "center", color: "#fff", }}>
                                        {getShortPdfName(pdfName)}
                                    </Typography>
                                </Tooltip>
                            </div>
                        </Grid>
                    ))}
                </Grid>
            )}
            <PdfModal isOpen={Boolean(selectedPdf)} onClose={closePdfModal} pdfUrl={selectedPdf} isPdf={selectedPdf?.toLowerCase().endsWith('.pdf')} />
        </Paper>
    );
};

export default EnterprisePdfAnswer;
