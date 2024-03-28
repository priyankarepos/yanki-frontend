import React, { useEffect, useState, useMemo } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { pdfjs } from 'react-pdf';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { Grid, Paper, Typography, useMediaQuery } from '@mui/material';
import { Button } from '@mui/base';
import "./AnswerStyle.scss"
import { Box } from '@mui/system';

const PdfAnswers = ({ answer }) => {
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [pdfLoadError, setPdfLoadError] = useState(false);
    const [visiblePdfCount, setVisiblePdfCount] = useState(2);
    const [thumbnailUrls, setThumbnailUrls] = useState([]);

    const pdfNames = useMemo(() => answer?.pdfNames || [], [answer?.pdfNames]);

    const s3BaseUrl = process.env.REACT_APP_S3_BASE_URL;

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
                <div className="pdf-modal">
                    <IconButton
                        style={{ position: 'absolute', top: !isLargeScreen ? '40px' : '20px',}}
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

    const handleLoadMore = () => {
        setVisiblePdfCount((prevCount) => prevCount + 2);
    };

    useEffect(() => {
        setVisiblePdfCount(2);
    }, [answer]);
    
    useEffect(() => {
        pdfjs.GlobalWorkerOptions.workerSrc = pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

    // Load PDF documents
    const promises = pdfNames.slice(0, visiblePdfCount).map(async (pdfName) => {
      const pdfUrl = `${s3BaseUrl}${pdfName}`;
      return pdfjs.getDocument(pdfUrl).promise.then((pdf) => {
        return pdf.getPage(1).then((page) => {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          const viewport = page.getViewport({ scale: 1.0 });
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };
          return page.render(renderContext).promise.then(() => {
            const imageDataUrl = canvas.toDataURL();
            return imageDataUrl;
          });
        });
      });
    });

    Promise.all(promises).then((thumbnails) => {
      setThumbnailUrls(thumbnails);
      console.log(thumbnails);
    });
  }, [pdfNames, visiblePdfCount, s3BaseUrl]);


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
                                src={thumbnailUrls[index]}
                                alt={`${pdfName.replace('.pdf', '')} thumbnail`}
                            />
                            <Typography className='enterprise-pdf-name' sx={{ marginTop: "10px", }}> {pdfName}</Typography>
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
