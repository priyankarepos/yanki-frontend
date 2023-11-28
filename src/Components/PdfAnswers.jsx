import React, { useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { pdfjs } from 'react-pdf';

const PdfAnswers = () => {
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [pdfLoadError, setPdfLoadError] = useState(false);

    console.log("selectedPdf", selectedPdf);

    const apiResponse = {
        "response": {
            "isSucess": true,
            "message": null,
            // ... other properties ...
            "pdfNames": [
                "4.birkat-hamazon-sefaradi.pdf",
                "3.birkat-hamazon-ashkenaz.pdf"
            ]
        },
        "chatId": "f9ed15f4-855f-4761-9268-628a596fb98d"
    };

    const s3BaseUrl = "https://jewishprayer-text-pdf.s3.amazonaws.com/";
    const pdfNames = apiResponse?.response?.pdfNames || [];

    const handlePdfClick = (pdfName) => {
        const pdfUrl = `${s3BaseUrl}${pdfName}`;
        setSelectedPdf(pdfUrl);
        setPdfLoadError(false);
    };

    const renderPdfContent = () => {
        if (!selectedPdf) {
            return <div>Select a PDF to view its content.</div>;
        }

        return (
            <div>
                {pdfLoadError ? (
                    <div>Error loading PDF. Please try again.</div>
                ) : (
                    <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}>
                        <Viewer fileUrl={selectedPdf} />
                    </Worker>
                )}
            </div>
        );
    };

    return (
        <div>
            <div>
                {pdfNames.map((pdfName, index) => (
                    <button key={index} onClick={() => handlePdfClick(pdfName)}>
                        {pdfName}
                    </button>
                ))}
            </div>
            {renderPdfContent()}
        </div>
    );
};

export default PdfAnswers;
