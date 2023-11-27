import React, { useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { pdfjs } from 'react-pdf';

const PdfAnswers = () => {
  const [selectedPdf, setSelectedPdf] = useState(null);
  const apiResponse = {
    "response": {
      "isSucess": true,
      "message": null,
      // ... other properties ...
      "pdfNames": [
        "https://www.jewishvirtuallibrary.org/jsource/Judaism/birkat_hamazon.pdf",
        "https://www.jewishvirtuallibrary.org/jsource/Judaism/birkat_hamazon.pdf"
      ]
    },
    "chatId": "f9ed15f4-855f-4761-9268-628a596fb98d"
  };

  const pdfNames = apiResponse?.response?.pdfNames || [];

  const handlePdfClick = (pdfUrl) => {
    setSelectedPdf(pdfUrl);
  };

  const renderPdfContent = () => {
    if (!selectedPdf) {
      return <div>Select a PDF to view its content.</div>;
    }

    return (
      <div>
        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}>
          <Viewer fileUrl={selectedPdf} />
        </Worker>
      </div>
    );
  };

  return (
    <div>
      <div>
        {pdfNames.map((pdfUrl, index) => (
          <button key={index} onClick={() => handlePdfClick(pdfUrl)}>
            {pdfUrl}
          </button>
        ))}
      </div>
      {renderPdfContent()}
    </div>
  );
};

export default PdfAnswers;
