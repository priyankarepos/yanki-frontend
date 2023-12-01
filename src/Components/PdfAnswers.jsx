import React, { useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { pdfjs } from 'react-pdf';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import '@react-pdf-viewer/core/lib/styles/index.css'; // Import styles for PDF viewer
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Paper, useMediaQuery } from '@mui/material';

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
            <div>
                {pdfNames && pdfNames.map((pdfName, index) => (
                    <Button
                        key={index}
                        onClick={() => openPdfModal(pdfName)}
                        startIcon={<PictureAsPdfIcon />}
                        style={{
                            backgroundColor: "#2f587d",
                            marginRight: pdfNames.length > 1 && index < pdfNames.length - 1 ? '8px' : '0',
                            // marginBottom: pdfNames.length > 1 && index < pdfNames.length - 1 ? '8px' : '0',
                            margin: '8px',
                            // marginLeft: '0',
                        }}
                    >
                        {pdfName}
                    </Button>
                ))}
            </div>
            {renderPdfModal()}
        </Paper>
    );
};

export default PdfAnswers;
