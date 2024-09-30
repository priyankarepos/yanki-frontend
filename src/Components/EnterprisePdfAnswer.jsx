import React, { useEffect, useState } from 'react';
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
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import { messages } from '../Utils/stringConstant/stringConstant';

const PdfModal = ({ isOpen, onClose, pdfUrl, isPdf }) => {
  const { t } = useTranslation();
  const [pdfLoadError, setPdfLoadError] = useState(false);
  const closeModal = () => {
    setPdfLoadError(false);
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={closeModal}
      className='enterprise-pdfAnswer-modal'
    >
      <div className="pdf-modal">
        <IconButton
          onClick={closeModal}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
        {!pdfLoadError ? (
          <div>
            {isPdf ? (
              <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}>
                <Viewer fileUrl={pdfUrl} />
              </Worker>
            ) : (
              <img
                className='enterprise-pdf-img'
                src={pdfUrl}
                alt="PDF Document"
                onError={() => setPdfLoadError(true)}
              />
            )}
          </div>
        ) : (
          <div>{t('errorLoadingContent')}</div>
        )}
      </div>
    </Modal>
  );
};

const EnterprisePdfAnswer = ({ answer }) => {
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [showPdfGrid, setShowPdfGrid] = useState(false);
  const [processedContentResponse, setProcessedContentResponse] = useState([]);

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

  useEffect(() => {
    if (answer?.contentResponse) {
      const answerArray = Array.isArray(answer.contentResponse)
        ? answer.contentResponse
        : [answer.contentResponse];
      setProcessedContentResponse(answerArray);
    }
  }, [answer]);

  const renderClickableContent = (text) => {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const phoneRegex = /(?:(?:\+?(\d{1,3}))?[ -]?(\d{1,4})[ -]?(\d{1,4})[ -]?(\d{1,4})|\(\d{1,4}\)\s*\d{1,4}[- ]?\d{1,4}[- ]?\d{1,4})/g;

    const excludePatterns = [
      messages.foundedYear,
    ];

    const lines = text.split('\n');

    const modifiedLines = lines.map((line) => {
      const isExcluded = excludePatterns.some(pattern => line.includes(pattern));

      if (isExcluded) {
        return line;
      }

      return line
        .replace(emailRegex, (email) => `[${email}](${messages.mailto}:${email})`)
        .replace(phoneRegex, (phone) => `[${phone}](${messages.tel}:${phone.replace(/\s+/g, '')})`);
    });

    return modifiedLines.join('\n');
  };

  const renderContentResponse = () => {
    if (!Array.isArray(processedContentResponse) || processedContentResponse.length === 0) {
      return <Typography>{messages.noContentAvailable}</Typography>;
    }

    const content = processedContentResponse[0];
    const markdownContent = renderClickableContent(content);

    return (
      <Typography className={messages.enterpriseDetailText}>
        <Markdown>{markdownContent}</Markdown>
      </Typography>
    );
  };


  return (
    <Paper sx={{
      p: 2,
    }}>
      <Box>
        {renderContentResponse()}
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
                className='enterprise-pdf-thumbnail'
                onClick={() => handleItemClick(pdfName)}
              >
                <Tooltip title={pdfName} arrow>
                  <Typography className='enterprise-pdf-name'>
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
