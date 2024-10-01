import { Worker, Viewer } from "@react-pdf-viewer/core";
import { pdfjs } from "react-pdf";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { apiUrls, classNames, messages } from "../Utils/stringConstant/stringConstant";

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
      className={classNames.enterprisePdfAnswerModal}
    >
      <div className={classNames.pdfModal}>
        <IconButton onClick={closeModal} aria-label={messages.close}>
          <CloseIcon />
        </IconButton>
        {!pdfLoadError ? (
          <div>
            {isPdf ? (
              <Worker
                workerUrl={apiUrls.workerUrl(pdfjs.version)}
              >
                <Viewer fileUrl={pdfUrl} />
              </Worker>
            ) : (
              <img
                className={classNames.enterprisePdfImg}
                src={pdfUrl}
                alt={messages.pdfDocument}
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

export default PdfModal;
