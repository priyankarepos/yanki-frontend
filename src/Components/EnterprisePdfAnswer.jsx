import React, { useEffect, useState } from 'react';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { Box, Grid, Paper, Typography } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import "./AnswerStyle.scss";
import Tooltip from '@mui/material/Tooltip';
import Markdown from "react-markdown";
import { messages } from '../Utils/stringConstant/stringConstant';
import PdfModal from './PdfModal';

const EnterprisePdfAnswer = ({ answer }) => {
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [showPdfGrid, setShowPdfGrid] = useState(false);
  const [processedContentResponse, setProcessedContentResponse] = useState([]);
  const phoneRegex = /\b\d{10,}\b/g;    

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
      const answerArray = answer.contentResponse.split("\n");
      setProcessedContentResponse(answerArray);
    }
  }, [answer]);

  const renderClickableContent = (text) => {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

    let content = "";

    const cleanedText = text.replace(/(^-|^\.)+/gm, (match) =>
      match.replace(/[-.]/g, "")
    );    
    
    cleanedText.split(/\s+/).forEach((word, index, array) => {  
          
      if (word.match(emailRegex)) {
        content += `[${word}](${messages.mailto}:${word})`;
      } else if (word.match(phoneRegex)) {
        content += `[${word}](${messages.tel}:${word})`;
      } else {
        content += word;
      }
      if (index !== array.length - 1) {
        content += " ";
      }
    });
    return content;
  };

  const renderContentResponse = () => {
    return processedContentResponse.map((ans, index) => (
      <Typography
        variant="h6"
        component="div"
        key={index}
        className="sentence-answer-container"
      >
        <Markdown
          components={{
            a: ({ node, ...props }) => {
              if (props.children.match(phoneRegex)) {
                return <a href={`${messages.tel}:${props.children}`}>{props.children}</a>;
              } else {
                return <a href={props.href}>{props.children}</a>;
              }
            },
          }}
        >
          {renderClickableContent(ans)}
        </Markdown>
      </Typography>
    ));
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
