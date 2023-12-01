import React, { useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { pdfjs } from 'react-pdf';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import '@react-pdf-viewer/core/lib/styles/index.css'; // Import styles for PDF viewer
import { Grid, Paper, Typography, useMediaQuery } from '@mui/material';

const PdfAnswers = ({ answer }) => {
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [pdfLoadError, setPdfLoadError] = useState(false);

    const pdfNames = answer?.pdfNames || [];
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

    return (
        <Paper sx={{
            p: 2,
        }}>
            <Grid
                container
                spacing={2} // Adjust the spacing between items

            >
                {pdfNames && pdfNames.map((pdfName, index) => (

                    <Grid item lg={4} md={6} sm={6} xs={12}>
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
                            key={index}
                            onClick={() => openPdfModal(pdfName)}
                        >
                            <img
                                src={`https://jewishprayer-text-pdf.s3.amazonaws.com/${pdfName.replace('.pdf', '.jpg')}`}
                                alt={`${pdfName.replace('.pdf', '')} thumbnail`}
                                style={{
                                    width: '100%',
                                    height: '150px',
                                    borderRadius: '4px',
                                    objectFit: 'cover',
                                    objectPosition: 'top',
                                }}
                            />
                            <Typography style={{ fontSize: "16px", textAlign: "center", color: "#fff", marginTop: "10px", }}> {pdfName}</Typography>
                        </div>
                    </Grid>
                ))}
            </Grid>
            {renderPdfModal()}
        </Paper>
    );
};

export default PdfAnswers;
