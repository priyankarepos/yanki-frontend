import React, { useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { pdfjs } from 'react-pdf';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import '@react-pdf-viewer/core/lib/styles/index.css'; // Import styles for PDF viewer
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const PdfAnswers = ({ answer }) => {
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [pdfLoadError, setPdfLoadError] = useState(false);

    const { pdfNames } = answer?.response || {};
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
                <div className="pdf-modal" style={{ width: '80%', height: '80%' }}>
                    <IconButton
                        style={{ position: 'absolute', top: '8px', right: '8px' }}
                        onClick={closePdfModal}
                        aria-label="close"
                    >
                        <CloseIcon />
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
        <div>
            <div>
                {pdfNames && pdfNames.map((pdfName, index) => (
                    <Button key={index} onClick={() => openPdfModal(pdfName)} startIcon={<PictureAsPdfIcon />}>
                        {pdfName}
                    </Button>
                ))}
            </div>
            {renderPdfModal()}
        </div>
    );
};

export default PdfAnswers;
