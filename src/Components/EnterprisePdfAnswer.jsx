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
          <>
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

  const renderClickableContent = (text) => {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const phoneRegex = /\b\d{10,}\b/g;
    const urlRegex = /\b(?:https?|ftp):\/\/\S+|\bwww\.\S+\.com\b/g;

    let content = [];

    const cleanedText = text.replace(/(^-|^\.)+/gm, match => match.replace(/[-.]/g, ''));

    cleanedText.split(/\s+/).forEach((word, index, array) => {
      if (word.match(emailRegex)) {
        content.push(
          <span
            key={index}
            className='enterprise-pdf-link'
            onClick={() => window.location.href = `mailto:${word}`}
          >
            {word}
          </span>
        );
        if (index !== array.length - 1) {
          content.push(" ");
        }
      } else if (word.match(phoneRegex)) {
        content.push(
          <span
            key={index}
            className='enterprise-pdf-link'
            onClick={() => window.location.href = `tel:${word}`}
          >
            {word}
          </span>
        );
        if (index !== array.length - 1) {
          content.push(" ");
        }
      } else if (word.match(urlRegex)) {
        content.push(
          <span
            key={index}
            className='enterprise-pdf-link'
            onClick={() => window.open(word, '_blank')}
          >
            {word}
          </span>
        );
        if (index !== array.length - 1) {
          content.push(" ");
        }
      } else {
        const lastChar = word.slice(-1);
        const punctuation = ['.', ',', '-'];
        const isLastCharPunctuation = punctuation.includes(lastChar);
        content.push(
          <span key={index}>
            {isLastCharPunctuation ? word.slice(0, -1) : word}{" "}
          </span>
        );
      }
    });

    return content;
  };

  return (
    <Paper sx={{
      p: 2,
    }}>
      <Box>
        <Typography className='enterprise-pdf-text' variant="h6" component="div">
          {renderClickableContent(answer?.contentResponse)}
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
