import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  FormHelperText,
  Modal,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  CircularProgress,
  useMediaQuery,
  Pagination,
} from "@mui/material";
import AdminDashboard from "./AdminDashboard";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { Context } from "../App";
import ConfirmDialog from "../EnterpriseCollabration/ConfirmDialog";
import TagsInput from "react-tagsinput";
import { useForm, Controller } from "react-hook-form";
import "./AdminStyle.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { pdfjs } from "react-pdf";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { apiUrls, classNames, messages } from "../Utils/stringConstant/stringConstant";
import { agentChatResponse } from "../Utils/stringConstant/AgentChatResponse";
import { className } from "../Utils/stringConstant/AdminString";

const AdminFileUpload = () => {
  const { drawerOpen } = useContext(Context);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [tableData, setTableData] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfLoadError, setPdfLoadError] = useState(false);
  const [pdfName, setPdfName] = useState("");
  const [pdfId, setpdfId] = useState("");
  const [isEditModalOpen, setEditIsModalOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isUploadFile, setIsUploadFile] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    reset,
    formState: { isSubmitted, errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      file: null,
      keywords: "",
    },
  });

  const itemsPerPage = 10;

  const s3BaseUrl = import.meta.env.VITE_APP_S3_BASE_URL;

  const fetchData = async (pageNumber) => {
    try {
      setLoading(true);      
      const response = await axios.get(apiUrls.documentMapping(pageNumber));
      setTableData(response.data.pdfList);
      setTotalPages(Math.ceil(response.data.totalCount / 10));
    } catch (error) {
      setSnackbarMessage(messages.fetchError, error);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pageNumber);
  }, [pageNumber]);

  const handlePageChange = (event, newPage) => {
    setPageNumber(newPage);
  };

  const openPdfModal = (pdfName) => {
    const cleanPdfName = pdfName.replace(/%27/g, "");
    const pdfUrl = `${s3BaseUrl}${cleanPdfName}`;
    setSelectedPdf(pdfUrl);
    setPdfLoadError(false);
  };

  const closePdfModal = () => {
    setSelectedPdf(null);
  };

  const handleAddTag = (newTag) => {
    setTags([...tags, newTag]);
  };

  const validateFile = (value) => {
    if (!value || value.length === 0) {
      return "File is required";
    }
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(value[0].type)) {
      return "Please select a valid file (PDF, JPG, or PNG)";
    }

    return true;
  };

  const onSubmit = async (data) => {
    try {
      setIsUploadFile(true);      
      const formData = new FormData();
      formData.append("file", data.file[0]);
      const apiUrl = `${apiUrls.indexAndUpload}?PdfName=${encodeURIComponent(
        data.file[0].name
      )}&Keywords=${encodeURIComponent(JSON.stringify(tags))}`;

      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setSnackbarMessage(`Document with Name ${pdfName} addedd successfully`);
        setSnackbarOpen(true);
        setIsModalOpen(false);
        reset();
        setTags([]);
        fetchData(pageNumber);
      }
    } catch (error) {
      setSnackbarMessage("An error occurred while uploading the file.");
      setSnackbarOpen(true);
    } finally {
      setIsUploadFile(false);
    }
  };

  const handleDelete = (pdfName, pdfId) => {
    setPdfName(pdfName);
    setpdfId(pdfId);
    setConfirmDialogOpen(true);
    setConfirmationText(`Are you sure you want to delete this file ?`);
  };

  const handleConfirmation = async () => {
    const rowIndex = tableData.findIndex((row) => row.pdfName === pdfName);
    if (rowIndex !== -1) {
      try {
        const response = await axios.delete(apiUrls.deleteDocument, {
          params: {
            documentId: pdfId,
            fileName: pdfName,
          },
        });

        if (response.status === 200) {
          const updatedTableData = [
            ...tableData.slice(0, rowIndex),
            ...tableData.slice(rowIndex + 1),
          ];
          setTableData(updatedTableData);
          if (updatedTableData.length === 0 && pageNumber > 1) {
            setPageNumber(pageNumber - 1);
          } else {
            fetchData(pageNumber);
          }
          setConfirmDialogOpen(false);
          setSnackbarMessage(
            `Document with Name ${pdfName} deleted successfully`
          );
          setSnackbarOpen(true);
        } else {
          setSnackbarMessage(response.status, response.data.message);
          setSnackbarOpen(true);
        }
      } catch (error) {
        setSnackbarMessage(error.message);
        setSnackbarOpen(true);
      }
    }
  };

  const handleUpdate = (pdfData, pdfId) => {
    try {
      let tagsArray = [];

      if (typeof pdfData.keywords === "string") {
        tagsArray = pdfData.keywords
          .split(",")
          .map((keyword) => keyword.trim());
      } else if (Array.isArray(pdfData.keywords)) {
        tagsArray = JSON.parse(pdfData.keywords.flat());
      } else {
        setSnackbarMessage("Invalid keywords format:", pdfData.keywords);
        setSnackbarOpen(true);
      }
      setTags(tagsArray);
    } catch (error) {
      setSnackbarMessage("Error handling keywords:", error);
      setSnackbarOpen(true);
      setTags([]);
    }
    setEditIsModalOpen(true);
    setpdfId(pdfId);
    setFileName(pdfData.pdfName);
  };

  const updateKeywords = async (data) => {
    try {
      setIsUploadFile(true);
      const response = await axios.put(
        apiUrls.updateDocumentKeywords(pdfId, tags)
      );
      if (response.status === 200) {
        const updatedTableData = tableData.map((row) => {
          if (row.documentId === pdfId) {
            return {
              ...row,
              keywords: tags.join(", "),
            };
          }
          return row;
        });

        setTableData(updatedTableData);
        setConfirmDialogOpen(false);
        setSnackbarMessage("Keywords updated successfully");
        setSnackbarOpen(true);
        reset();
        setTags([]);
      } else {
        setSnackbarMessage(response.status, response.data.message);
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("Error updating keywords:", error);
      setSnackbarOpen(true);
    } finally {
      setIsUploadFile(false);
      setEditIsModalOpen(false);
    }
  };

  const renderPdfModal = () => {
    return (
      <Modal
        open={Boolean(selectedPdf)}
        onClose={closePdfModal}
        className="event-pdf-modal-open"
      >
        <div className="pdf-modal">
          <IconButton onClick={closePdfModal} aria-label="close">
            <CloseIcon />
          </IconButton>
          {!pdfLoadError ? (
            <Worker
              workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}
            >
              <Viewer fileUrl={selectedPdf} />
            </Worker>
          ) : (
            <div>Error loading PDF. Please try again.</div>
          )}
        </div>
      </Modal>
    );
  };

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pageNumber]);

  return (
    <div className="admin-faq-wrapper">
      <Box
        sx={{
          width:
            drawerOpen && !isSmallScreen
              ? agentChatResponse.drawerOpenWidth
              : agentChatResponse.zeroWidth,
          transition: agentChatResponse.transitionStyle,
        }}
      >
        <AdminDashboard />
      </Box>
      <Box
        className="admin-file-upload-content"
        sx={{
          width: drawerOpen
            ? agentChatResponse.drawerOpenCalcWidth
            : agentChatResponse.hundredWidth,
          transition: agentChatResponse.transitionStyle,
        }}
      >
        <Box className="admin-faq-heading">
          <Typography variant="h6">Upload Files</Typography>
          <IconButton
            color="secondary"
            size="small"
            onClick={() => {
              setIsModalOpen(true);
              setTags([]);
            }}
          >
            <AddIcon /> Add Files
          </IconButton>
        </Box>
        {loading ? (
          <div className={classNames.noDataFoundClass}>
            <CircularProgress />
          </div>
        ) : (
          <React.Fragment>
            {tableData && tableData.length === 0 ? (
              <Typography variant="h6" className={classNames.noDataFoundClass}>
                No data available.
              </Typography>
            ) : (
              <TableContainer component={Paper} className="margin-top-20">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className={className.enterpriseHeaderCell}>
                        Sr No.
                      </TableCell>
                      <TableCell className={className.enterpriseHeaderCell}>
                        PDF Name
                      </TableCell>
                      <TableCell className={className.enterpriseHeaderCell}>
                        Keywords
                      </TableCell>
                      <TableCell className={className.enterpriseHeaderCell}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableData &&
                      tableData.map((row, index) => (
                        <TableRow key={index + 1}>
                          <TableCell>
                            {(pageNumber - 1) * itemsPerPage + index + 1}
                          </TableCell>
                          <TableCell>{row.pdfName}</TableCell>
                          <TableCell>
                            {Array.isArray(row.keywords) ? (
                              row.keywords.map((keyword, index) => {
                                try {
                                  const parsedKeyword = JSON.parse(keyword);
                                  if (Array.isArray(parsedKeyword)) {
                                    return (
                                      <span key={index}>
                                        {index > 0 && ", "}
                                        {parsedKeyword.join(", ").toLowerCase()}
                                      </span>
                                    );
                                  }
                                } catch (error) {
                                  setSnackbarMessage(messages.error, error);
                                  setSnackbarOpen(true);
                                }
                                return (
                                  <span key={index}>
                                    {index > 0 && ", "}
                                    {String(keyword).toLowerCase()}
                                  </span>
                                );
                              })
                            ) : (
                              <span>{String(row.keywords).toLowerCase()}</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => openPdfModal(row.pdfName)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                            <IconButton
                              onClick={() =>
                                handleDelete(row.pdfName, row.documentId)
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => handleUpdate(row, row.documentId)}
                            >
                              <EditIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                {totalPages > 1 && (
                  <Box marginTop={2}>
                    <Pagination
                      count={totalPages}
                      page={pageNumber}
                      onChange={handlePageChange}
                      color={messages.primaryColor}
                      className={messages.enterprisePaginationClass}
                    />
                  </Box>
                )}
              </TableContainer>
            )}
          </React.Fragment>
        )}
      </Box>
      {renderPdfModal()}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="event-pdf-modal-open"
      >
        <Box className="admin-faq-model-content">
          <Box className={className.adminModalContainer}>
            <Typography
              variant="h5"
              className="enterprise-add-category-modal-title"
            >
              Upload File
            </Typography>
            <IconButton onClick={() => setIsModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* File Upload */}
            <Controller
              control={control}
              name="file"
              render={({ field }) => (
                <div className="form-input">
                  <input
                    type="file"
                    onChange={(e) => {
                      const selectedFile = e.target.files[0];
                      setValue("file", [selectedFile]);
                      trigger("file");
                    }}
                  />
                  {errors.file && (
                    <span className="error-message">{errors.file.message}</span>
                  )}
                </div>
              )}
              rules={{ validate: validateFile }}
            />

            {/* Keywords */}
            <Controller
              control={control}
              name="keywords"
              render={({ field }) => (
                <div className="form-input">
                  <TagsInput
                    value={tags}
                    onChange={(newTags) => setTags(newTags)}
                    addKeys={[13, 9]}
                    placeholder="Type keywords here"
                    inputProps={{
                      ...field,
                      value: tagInput,
                      onChange: (e) => setTagInput(e.target.value),
                      onKeyDown: (e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          e.persist();
                          handleAddTag(e.target.value);
                          field.onChange("");
                          setTagInput("");
                        }
                      },
                    }}
                  />
                  {Array.isArray(tags) && tags.length === 0 && (
                    <FormHelperText className="error-message">
                      At least one keyword is required
                    </FormHelperText>
                  )}
                </div>
              )}
              rules={{
                validate: (value) => {
                  const keywordsArray = Array.isArray(value) ? value : [value];
                  return keywordsArray.length > 0 || "Keywords are required";
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              className="enterprise-add-category-save-button"
              type="submit"
              disabled={isUploadFile || tags.length === 0}
            >
              {isUploadFile ? (
                <CircularProgress
                  size={24}
                  className={messages.eventFormSubmitButtonLoader}
                />
              ) : (
                "Upload"
              )}
            </Button>
          </form>
        </Box>
      </Modal>
      <Modal
        open={isEditModalOpen}
        onClose={() => setEditIsModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="event-pdf-modal-open"
      >
        <Box className="admin-faq-model-content">
          <Typography
            variant="h5"
            className="enterprise-add-category-modal-title"
          >
            Update Keyword
          </Typography>
          <form className="keyword-update-box">
            {/* Keywords */}
            <Typography>Filename: {fileName}</Typography>
            <Controller
              control={control}
              name="keywords"
              render={({ field }) => (
                <div className="form-input">
                  <TagsInput
                    value={tags || []}
                    onChange={(newTags) => setTags(newTags)}
                    addKeys={[13, 9]}
                    placeholder="Type keywords here"
                    inputProps={{
                      ...field,
                      value: tagInput,
                      onChange: (e) => setTagInput(e.target.value),
                      onKeyDown: (e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          e.persist();
                          const existingTagIndex = tags.findIndex(
                            (tag) => tag === tagInput
                          );
                          if (existingTagIndex !== -1) {
                            const updatedTags = [...tags];
                            updatedTags[existingTagIndex] = tagInput;
                            setTags(updatedTags);
                            field.onChange(updatedTags);
                          } else {
                            handleAddTag(tagInput);
                            setTagInput("");
                          }
                        }
                      },
                    }}
                  />
                  {Array.isArray(tags) && tags.length === 0 && (
                    <FormHelperText className="error-message">
                      At least one keyword is required
                    </FormHelperText>
                  )}
                </div>
              )}
              rules={{
                validate: (value) => {
                  const keywordsArray = Array.isArray(value) ? value : [value];
                  return keywordsArray.length === 0 || "Keywords are required";
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              className="enterprise-add-category-save-button"
              type="submit"
              disabled={tags.length === 0 || isUploadFile}
              onClick={(e) => updateKeywords(e)}
            >
              {isUploadFile ? (
                <CircularProgress
                  size={24}
                  className={messages.eventFormSubmitButtonLoader}
                />
              ) : (
                "Update"
              )}
            </Button>
          </form>
        </Box>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
      <ConfirmDialog
        open={confirmDialogOpen}
        handleClose={() => setConfirmDialogOpen(false)}
        handleConfirm={() => handleConfirmation()}
        confirmationText={confirmationText}
      />
    </div>
  );
};

export default AdminFileUpload;
