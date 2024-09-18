import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Modal,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputLabel,
  Snackbar,
  CircularProgress,
  useMediaQuery,
  Grid,
  FormHelperText,
  Pagination,
} from "@mui/material";
import AdminDashboard from "./AdminDashboard";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { Context } from "../App";
import ConfirmDialog from "../EnterpriseCollabration/ConfirmDialog";
import "./AdminStyle.css";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { pdfjs } from "react-pdf";
import CloseIcon from "@mui/icons-material/Close";
import Multiselect from "multiselect-react-dropdown";
import { Controller, useForm } from "react-hook-form";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { FormControl } from "@mui/base";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import { agentChatResponse } from "../Utils/stringConstant/AgentChatResponse";
import { classNames } from "../Utils/stringConstant/stringConstant";
import { apiUrls, message } from "../Utils/stringConstant/AdminString";
import { headers } from "../Utils/stringConstant/stringConstant";

const AdminEventRequest = () => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm();
  const { drawerOpen } = useContext(Context);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPdfModalOpen, setPdfModalOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [eventLocations, setEventLocations] = useState([]);
  const [eventRequests, setEventRequests] = useState([]);
  const [publicationArea, setPublicationArea] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loadingRows, setLoadingRows] = useState([]);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [eventIdToDelete, setEventIdToDelete] = useState(null);
  const [editEventData, setEditEventData] = useState(null);
  const [editEventId, setEditEventId] = useState(null);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isPublicationAreaDropdownOpen, setIsPublicationAreaDropdownOpen] =
    useState(false);
  const [isEventTypeDropdownOpen, setIsEventTypeDropdownOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const handlePageChange = (event, newPage) => {
    setPageNumber(newPage);
    fetchEventRequest(newPage);
  };

  const handleLocationDropdownToggle = () => {
    setIsLocationDropdownOpen(!isLocationDropdownOpen);
    setIsPublicationAreaDropdownOpen(false);
    setIsEventTypeDropdownOpen(false);
  };

  const handlePublicationAreaDropdownToggle = () => {
    setIsPublicationAreaDropdownOpen(!isPublicationAreaDropdownOpen);
    setIsLocationDropdownOpen(false);
    setIsEventTypeDropdownOpen(false);
  };

  const handleEventTypeDropdownToggle = () => {
    setIsEventTypeDropdownOpen(!isEventTypeDropdownOpen);
    setIsLocationDropdownOpen(false);
    setIsPublicationAreaDropdownOpen(false);
  };

  useEffect(() => {
    if (editEventData) {
      setValue("EventName", editEventData?.eventName || ""); // Set default value for EventName
      setValue("EventLocationAddress", editEventData?.eventAddress || ""); // Set default value for EventLocationAddress
    }
  }, [editEventData, setValue]);

  const fetchEventRequest = async (pageNumber) => {
    try {
      setIsDataLoading(true);
      const response = await axios.get(apiUrls.getAllEvents(pageNumber));

      if (response.status === 200) {
        setEventRequests(response.data);
        setTotalPages(Math.ceil(response.data.totalCount / 10));
      } else {
        setSnackbarMessage("Failed to fetch event location");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("Error fetching event location", error);
      setSnackbarOpen(true);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchEventRequest(pageNumber);
  }, [isFormModalOpen, pageNumber]);
  
  useEffect(() => {
    const fetchEventLocations = async () => {
      try {
        const response = await axios.get(apiUrls.getEventsLocations);

        if (response.status === 200) {
          setEventLocations(response.data);
        } else {
          setSnackbarMessage("Failed to fetch event location");
          setSnackbarOpen(true);
        }
      } catch (error) {
        setSnackbarMessage("Error fetching event location", error);
        setSnackbarOpen(true);
      }
    };

    fetchEventLocations();
  }, []);
  useEffect(() => {
    const fetchEventPublicationArea = async () => {
      try {
        const response = await axios.get(apiUrls.getEventPublicationAreas);

        if (response.status === 200) {
          setPublicationArea(response.data);
        } else {
          setSnackbarMessage("Failed to fetch publication area");
          setSnackbarOpen(true);
        }
      } catch (error) {
        setSnackbarMessage("Error fetching publication area", error);
        setSnackbarOpen(true);
      }
    };

    fetchEventPublicationArea();
  }, []);
  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const response = await axios.get(apiUrls.getEventsTypes);

        if (response.status === 200) {
          setEventTypes(response.data);
        } else {
          setSnackbarMessage("Error fetching event types");
          setSnackbarOpen(true);
        }
      } catch (error) {
        setSnackbarMessage("Error fetching event types", error);
        setSnackbarOpen(true);
      }
    };

    fetchEventTypes();
  }, []);
  const handlePdfSelect = (file) => {
    setSelectedPdf(file);
    setPdfModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const addEventData = {
        eventName: data.EventName,
        eventAddress: data.EventLocationAddress,
        eventLocation: data.locations.map((item) => item.name),
        eventPublicationArea: data.publicationArea.map((item) => item.name),
        eventType: data.eventTypes.map((item) => item.name),
        eventDetails: data.eventDetails,
        eventDateAndTime: `${data.date}T${data.time}`,
      };
      const addEventResponse = await axios.post(apiUrls.addEvent, addEventData);
      const eventId = addEventResponse.data;
      if (!uploadedFiles || uploadedFiles.length === 0) {
        window.location.reload();
      }
      const formData = new FormData();
      if (Array.isArray(data.uploadedFiles)) {
        data.uploadedFiles.forEach((file) => {
          formData.append("imageFiles", file);
        });
      } else {
        setIsLoading(false);
        return;
      }

      await axios.post(apiUrls.eventImageUpload(eventId), formData, {
        headers: headers,
      });
      setIsLoading(false);
      setUploadedFiles([]);
      setEventLocations([]);
      setEventTypes([]);
      setPublicationArea([]);
      reset();
      setFormModalOpen(false);
      setSnackbarMessage(
        "Your event publish request has been sent successfully"
      );
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Error submitting event:", error);
      setSnackbarOpen(true);
      setIsLoading(false);
    }
  };

  const handleEditClick = (event, eventId) => {
    setEditEventData(event);
    setEditEventId(eventId);
    openFormModal();
    if (editEventData) {
      setValue("EventName", event.eventName || "");
      setValue("EventLocationAddress", event.eventAddress || "");
      setValue("EventDetails", event.eventDetails || "");
      setValue("EventDateAndTime", event.eventDateAndTime || "");
      setValue(
        "locations",
        editEventData.eventLocation
          ? editEventData.eventLocation
            .flatMap((location) => location.split(","))
            .map((location) => ({ name: location }))
          : []
      );
      setValue(
        "publicationArea",
        editEventData.eventPublicationArea
          ? editEventData.eventPublicationArea
            .flatMap((area) => area.split(","))
            .map((area) => ({ name: area }))
          : []
      );
      setValue(
        "eventTypes",
        editEventData.eventType
          ? editEventData.eventType
            .flatMap((area) => area.split(","))
            .map((area) => ({ name: area }))
          : []
      );
    }
  };

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      const formData = getValues();
      const requestData = {
        eventId: editEventId,
        eventName: formData.EventName,
        eventAddress: formData.EventLocationAddress,
        status: formData.status,
        eventLocation: formData.locations.map((item) => item.name),
        eventPublicationArea: formData.publicationArea.map((item) => item.name),
        eventType: formData.eventTypes.map((item) => item.name),
        eventDetails: formData.eventDetails,
        eventDateAndTime: `${formData.date}T${formData.time}`,
      };

      await axios.put(apiUrls.updateEvent, requestData);
      if (
        Array.isArray(formData.uploadedFiles) &&
        formData.uploadedFiles.length > 0
      ) {
        const formDataImages = new FormData();
        formData.uploadedFiles.forEach((file) => {
          formDataImages.append("imageFiles", file);
        });
        await axios.post(apiUrls.imageUploadUrl(editEventId), formDataImages, {
          headers: headers,
        });
        setSnackbarMessage(message.imageUploadedSuccess);
        setSnackbarOpen(true);
      }

      setFormModalOpen(false);
      setIsLoading(false);
      setUploadedFiles([]);
      reset();
      window.location.reload();
      setSnackbarMessage("Event has been updated successfully");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Error updating event:", error);
      setSnackbarOpen(true);
      setIsLoading(false);
    }
  };

  const handleApprove = async (eventId, userId, EventName) => {
    try {
      const updatedLoadingRows = [...loadingRows, eventId];
      setLoadingRows(updatedLoadingRows);
      const approveResponse = await axios.post(
        apiUrls.approveRejectEventsRequests(eventId, "approve")
      );
      if (approveResponse.status === 200) {
        await axios.post(apiUrls.sendEmailEventSubscribers(eventId));
        setSnackbarMessage(message.eventApproved(EventName), message.success);
        setSnackbarOpen(true);
        fetchEventRequest(pageNumber);
      } else {
        setSnackbarMessage("Failed to approve event request", "error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("Error:", error);
      setSnackbarOpen(true);
    } finally {
      const updatedLoadingRows = loadingRows.filter(
        (rowId) => rowId !== eventId
      );
      setLoadingRows(updatedLoadingRows);
    }
  };

  const handleReject = async (eventId, userId, EventName) => {
    try {
      const updatedLoadingRows = [...loadingRows, eventId];
      setLoadingRows(updatedLoadingRows);

      const response = await axios.post(
        apiUrls.approveRejectEventsRequests(eventId, "reject")
      );

      if (response.status === 200) {
        setSnackbarMessage(message.eventRejected(EventName), message.success);
        setSnackbarOpen(true);
        fetchEventRequest(pageNumber);
      } else {
        setSnackbarMessage("Failed to reject event request", "error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("Error:", error);
      setSnackbarOpen(true);
    } finally {
      const updatedLoadingRows = loadingRows.filter(
        (rowId) => rowId !== eventId
      );
      setLoadingRows(updatedLoadingRows);
    }
  };

  const handlePending = async (eventId, userId, EventName) => {
    try {
      const updatedLoadingRows = [...loadingRows, eventId];
      setLoadingRows(updatedLoadingRows);

      const response = await axios.post(
        apiUrls.approveRejectEventsRequests(eventId, "askformoreinformation")
      );

      if (response.status === 200) {
        setSnackbarMessage(message.askformoreinformation);
        setSnackbarOpen(true);
        fetchEventRequest(pageNumber);
      } else {
        setSnackbarMessage("Failed to reject Event request", "error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("Error:", error);
      setSnackbarOpen(true);
    } finally {
      const updatedLoadingRows = loadingRows.filter(
        (rowId) => rowId !== eventId
      );
      setLoadingRows(updatedLoadingRows);
    }
  };

  const handleDeleteClick = (eventId) => {
    setConfirmationText(`Are you sure you want to delete this event`);
    setConfirmDialogOpen(true);
    setEventIdToDelete(eventId);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(apiUrls.deleteEvent(eventIdToDelete));

      if (response.status === 200) {
        fetchEventRequest(pageNumber);
        setSnackbarMessage(message.requestDeletedSuccess, message.success);
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage("Failed to delete the request", "error");
        setSnackbarMessage(`Request deleted successfully`, "success");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("Error:", error);
      setSnackbarOpen(true);
    } finally {
      setConfirmDialogOpen(false);
    }
  };

  const onSelectLocations = (selectedList) => {
    setValue("locations", selectedList);
  };

  const onRemoveLocations = (selectedList) => {
    setValue("locations", selectedList);
  };

  const onSelectEventTypes = (selectedList) => {
    setValue("eventTypes", selectedList);
  };

  const onRemoveEventTypes = (selectedList) => {
    setValue("eventTypes", selectedList);
  };

  const onSelectPublicationArea = (selectedList) => {
    setValue("publicationArea", selectedList);
  };

  const onRemovePublicationArea = (selectedList) => {
    setValue("publicationArea", selectedList);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const invalidFiles = selectedFiles.filter(
      (file) => !["image/jpeg", "image/png"].includes(file.type)
    );
    if (invalidFiles.length > 0) {
      alert("Please select only JPG or PNG files.");
      e.target.value = "";
      return;
    }
    const newFiles = [...uploadedFiles, ...selectedFiles];
    setValue("uploadedFiles", newFiles);

    const totalFilesCount = editEventData
      ? editEventData.imageUrl.length + uploadedFiles.length
      : uploadedFiles.length;
    if (totalFilesCount + selectedFiles.length > 3) {
      alert("You can upload up to 3 files.");
      e.target.value = "";
      return;
    }
    setUploadedFiles(newFiles);
    e.target.value = "";
  };

  const handleFileRemove = (fileName) => {
    const updatedFiles = uploadedFiles.filter((file) => file.name !== fileName);
    setUploadedFiles(updatedFiles);
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await axios.delete(apiUrls.deleteEventImage(imageId));
      setSnackbarMessage(message.imageDeletedSuccess);
      setSnackbarOpen(true);
      const updatedImages = editEventData.imageUrl.filter(
        (image) => image.imageId !== imageId
      );
      const updatedEditEventData = {
        ...editEventData,
        imageUrl: updatedImages,
      };

      setEditEventData(updatedEditEventData);
    } catch (error) {
      setSnackbarMessage("Error deleting image:", error);
      setSnackbarOpen(true);
    }
  };

  const openFormModal = () => {
    setFormModalOpen(true);
  };

  const closeFormModal = () => {
    setFormModalOpen(false);
    reset();
    setIsLocationDropdownOpen(false);
    setIsPublicationAreaDropdownOpen(false);
    setIsEventTypeDropdownOpen(false);
  };

  const closePdfModal = () => {
    setPdfModalOpen(false);
    setSelectedPdf(null);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage({ url: imageUrl.imageUrl });
    setIsImageModalOpen(true);
  };

  const getImageFilename = (imageUrl) => {
    const parts = imageUrl.split("/");
    return parts.pop();
  };

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return (
    <Box className="event-request-container">
      <Box sx={{
        width:
          drawerOpen && !isSmallScreen
            ? agentChatResponse.drawerOpenWidth
            : agentChatResponse.zeroWidth,
        transition: agentChatResponse.transitionStyle,
      }}>
        <AdminDashboard />
      </Box>
      <Box
        className={agentChatResponse.enterpriseFormBox}
        sx={{
          width: drawerOpen
            ? agentChatResponse.drawerOpenCalcWidth
            : agentChatResponse.hundredWidth, transition: agentChatResponse.transitionStyle,
        }}
      >
        <Box className="event-content">
          <Box className="event-title-container">
            <Typography variant="h6">Event Submission Requests</Typography>
            <IconButton
              onClick={openFormModal}
              color="secondary"
              size="small"
              className="event-add-button"
            >
              <AddIcon /> Add
            </IconButton>
          </Box>
          {
            isDataLoading ? (
              <div className={classNames.noDataFoundClass}>
                <CircularProgress />
              </div>
            ) : Array.isArray(eventRequests.events) && eventRequests.events.length > 0 ? (
              <TableContainer component={Paper} className="enterprise-request-table marginBottom-0">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className="event-headerCell">Name</TableCell>
                      <TableCell className="event-headerCell">Location</TableCell>
                      <TableCell className="event-headerCell">Address</TableCell>
                      <TableCell className="event-headerCell">Date</TableCell>
                      <TableCell className="event-headerCell">Time</TableCell>
                      <TableCell className="event-headerCell">Event Detail</TableCell>
                      <TableCell className="event-headerCell">Event Type</TableCell>
                      <TableCell className="event-headerCell">Event Publication Area</TableCell>
                      <TableCell className="event-headerCell">Images</TableCell>
                      <TableCell className="event-headerCell">Status</TableCell>
                      <TableCell className="event-headerCell text-right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      ...eventRequests.events.filter((event) => event.status === "Pending"),
                      ...eventRequests.events.filter((event) => event.status !== "Pending"),
                    ].map((event, index) => (
                      <TableRow key={index}>
                        <TableCell className="event-cell">{event.eventName}</TableCell>
                        <TableCell className="event-cell">{event.eventLocation.join(", ")}</TableCell>
                        <TableCell className="event-cell">{event.eventAddress}</TableCell>
                        <TableCell className="event-cell">
                          {new Date(event.eventDateAndTime).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="event-cell">
                          {new Date(event.eventDateAndTime).toLocaleTimeString()}
                        </TableCell>
                        <TableCell className="event-cell">{event.eventDetails}</TableCell>
                        <TableCell className="event-cell">{event.eventType.join(", ")}</TableCell>
                        <TableCell className="event-cell">{event.eventPublicationArea.join(", ")}</TableCell>
                        <TableCell className="event-cell">
                          {event.imageUrl && event.imageUrl.length > 0 ? (
                            event.imageUrl.map((image, index) => (
                              <p className="event-image-url" key={index} onClick={() => handleImageClick(image)}>
                                {getImageFilename(image.imageUrl)}
                              </p>
                            ))
                          ) : (
                            <p>N/A</p>
                          )}
                        </TableCell>
                        <TableCell className="event-cell">{event.status}</TableCell>
                        <TableCell className="event-cell text-right">
                          <div className="enterprise-cell-button-container">
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              className="event-cell-button"
                              disabled={loadingRows.includes(event.eventId) || event.status === "Approved"}
                              onClick={() => {
                                setIsApproving(true);
                                handleApprove(event.eventId, event.userId, event.eventName);
                              }}
                            >
                              {isApproving && loadingRows.includes(event.eventId) ? (
                                <CircularProgress size={24} />
                              ) : (
                                "Approve"
                              )}
                            </Button>
                            <Button
                              variant="contained"
                              color="secondary"
                              size="small"
                              className="event-cell-button"
                              disabled={loadingRows.includes(event.eventId) || event.status === "Rejected"}
                              onClick={async () => {
                                setIsRejecting(true);
                                await handleReject(event.eventId, event.userId, event.eventName);
                                setIsRejecting(false);
                              }}
                            >
                              {isRejecting && loadingRows.includes(event.eventId) ? (
                                <CircularProgress size={24} />
                              ) : (
                                "Reject"
                              )}
                            </Button>
                            <Button
                              variant="contained"
                              color="secondary"
                              size="small"
                              className="event-cell-button"
                              disabled={loadingRows.includes(event.eventId)}
                              onClick={async () => {
                                setIsPending(true);
                                await handlePending(event.eventId, event.userId, event.eventName);
                                setIsPending(false);
                              }}
                            >
                              {isPending && loadingRows.includes(event.eventId) ? (
                                <CircularProgress size={24} />
                              ) : (
                                "Ask for more info"
                              )}
                            </Button>
                            <Button
                              variant="contained"
                              color="secondary"
                              size="small"
                              className="event-cell-button"
                              onClick={() => handleEditClick(event, event.eventId)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="contained"
                              color="secondary"
                              size="small"
                              className="event-cell-button"
                              disabled={loadingRows.includes(event.eventId)}
                              onClick={() => handleDeleteClick(event.eventId)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {totalPages > 1 && (
                  <Pagination
                    count={totalPages}
                    page={pageNumber}
                    onChange={handlePageChange}
                    color="primary"
                    className="enterprise-pagination"
                  />
                )}
              </TableContainer>
            ) : (
              <Typography variant="body1" className={classNames.noDataFoundClass}>
                No event submission request available.
              </Typography>
            )
          }

        </Box>
      </Box>
      <Modal
        open={isPdfModalOpen || isImageModalOpen}
        onClose={() => {
          closePdfModal();
          setIsImageModalOpen(false);
        }}
        aria-labelledby="pdf-modal-title"
        aria-describedby="pdf-modal-description"
        className="event-pdf-modal-open"
      >
        <div className="pdf-modal">
          <IconButton
            onClick={() => {
              closePdfModal();
              setIsImageModalOpen(false);
            }}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          {selectedImage && selectedImage.url && (
            <img
              src={selectedImage.url}
              alt={selectedImage.name || "Image"}
              className="event-select-img"
            />
          )}
        </div>
      </Modal>
      <Modal
        open={isFormModalOpen}
        onClose={closeFormModal}
        aria-labelledby="form-modal-title"
        aria-describedby="form-modal-description"
        className="event-add-form-modal"
      >
        <Paper 
          elevation={3} 
          className="event-modal-content" 
        >
          <div className="event-model-close-btn">
            <IconButton onClick={closeFormModal} aria-label="close">
              <CloseIcon />
            </IconButton>
          </div>

          <form
            onSubmit={
              editEventData !== null
                ? handleSubmit(handleUpdate)
                : handleSubmit(onSubmit)
            }
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ pt: 2 }}>Event Submission Form</Typography>
              </Grid>
              <Grid item lg={6} md={12} sm={12} xs={12}>
                <InputLabel>Event Name</InputLabel>
                <Controller
                  control={control}
                  name="EventName"
                  rules={{
                    required: "Event name is required.",
                    minLength: {
                      value: 3,
                      message:
                        "Event name should be at least 3 characters long.",
                    },
                    maxLength: {
                      value: 50,
                      message: "Event name should not exceed 30 characters.",
                    },
                  }}
                  render={({ field }) => (
                    <div>
                      <TextField
                        {...field}
                        type="outlined"
                        placeholder="Event name"
                        fullWidth
                        value={field.value} 
                        onChange={field.onChange}
                      />
                      {errors["EventName"] && (
                        <FormHelperText className="error-message">
                          {errors["EventName"].message}
                        </FormHelperText>
                      )}
                    </div>
                  )}
                />
              </Grid>
              <Grid item lg={6} md={12} sm={12} xs={12}>
                <InputLabel>Location</InputLabel>
                <Controller
                  control={control}
                  name="locations"
                  defaultValue={
                    editEventData && editEventData.eventLocation
                      ? editEventData.eventLocation
                        .flatMap((location) => location.split(","))
                        .map((location) => ({ name: location }))
                      : []
                  }
                  rules={{ required: "Location is required." }}
                  render={({ field }) => (
                    <>
                      <Multiselect
                        options={eventLocations.map((location) => ({
                          name: location.eventLocationName,
                          id: location.id,
                        }))}
                        selectedValues={field.value}
                        onSelect={(selectedList) => {
                          onSelectLocations(selectedList);
                          field.onChange(selectedList);
                        }}
                        onRemoveLocation={(selectedList) => {
                          onRemoveLocations(selectedList);
                          field.onChange(selectedList);
                        }}
                        displayValue="name"
                        showArrow
                        customArrow={
                          !isLocationDropdownOpen ? (
                            <ArrowDropDownCircleIcon
                            className="cursor-pointer"
                              onClick={handleLocationDropdownToggle}
                            />
                          ) : (
                            <CancelIcon
                            className="cursor-pointer"
                              onClick={handleLocationDropdownToggle}
                            />
                          )
                        }
                        closeOnSelect
                        showCheckbox
                        keepListOpen={isLocationDropdownOpen}
                        className={
                          !isLocationDropdownOpen
                            ? "displayNoneShow"
                            : "displayBlockShow"
                        }
                      />
                      {errors.locations && (
                        <span className="error-message">
                          {errors.locations.message}
                        </span>
                      )}
                    </>
                  )}
                />
              </Grid>
              <Grid item lg={6} md={12} sm={12} xs={12}>
                <InputLabel>Event Location Address</InputLabel>
                <Controller
                  control={control}
                  name="EventLocationAddress"
                  rules={{
                    required: "Event location address is required.",
                  }}
                  render={({ field }) => (
                    <div>
                      <TextField
                        {...field}
                        variant="outlined"
                        placeholder="Event location address"
                        fullWidth
                        value={field.value}
                        onChange={field.onChange}
                      />
                      {errors["EventLocationAddress"] && (
                        <FormHelperText className="error-message">
                          {errors["EventLocationAddress"].message}
                        </FormHelperText>
                      )}
                    </div>
                  )}
                />
              </Grid>
              <Grid item lg={6} md={12} sm={12} xs={12}>
                <InputLabel>Date</InputLabel>
                <Controller
                  control={control}
                  name="date"
                  defaultValue={
                    editEventData
                      ? new Date(editEventData.eventDateAndTime)
                        .toISOString()
                        .split("T")[0]
                      : ""
                  }
                  rules={{
                    required: "Date is required",
                  }}
                  render={({ field }) => (
                    <div>
                      <TextField {...field} type="date" fullWidth />
                      {errors["date"] && (
                        <FormHelperText className="error-message">
                          {errors["date"].message}
                        </FormHelperText>
                      )}
                    </div>
                  )}
                />
              </Grid>
              <Grid item lg={6} md={12} sm={12} xs={12}>
                <InputLabel>Time</InputLabel>
                <Controller
                  control={control}
                  name="time"
                  defaultValue={
                    editEventData
                      ? new Date(
                        editEventData.eventDateAndTime
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })
                      : ""
                  }
                  rules={{
                    required: "Time is required",
                  }}
                  render={({ field }) => (
                    <div>
                      <TextField {...field} type="time" fullWidth />
                      {errors["time"] && (
                        <FormHelperText className="error-message">
                          {errors["time"].message}
                        </FormHelperText>
                      )}
                    </div>
                  )}
                />
              </Grid>
              <Grid item lg={6} md={12} sm={12} xs={12}>
                <InputLabel>Publication Area</InputLabel>
                <Controller
                  control={control}
                  name="publicationArea"
                  defaultValue={
                    editEventData && editEventData.eventPublicationArea
                      ? editEventData.eventPublicationArea
                        .flatMap((area) => area.split(","))
                        .map((area) => ({ name: area }))
                      : []
                  }
                  rules={{ required: "Publication area is required." }}
                  render={({ field }) => (
                    <>
                      <Multiselect
                        options={publicationArea.map((item) => ({
                          name: item.eventPublicationAreaName,
                          id: item.id,
                        }))}
                        selectedValues={field.value}
                        onSelect={(selectedList) => {
                          onSelectPublicationArea(selectedList);
                          field.onChange(selectedList);
                        }}
                        onRemove={(selectedList) => {
                          onRemovePublicationArea(selectedList);
                          field.onChange(selectedList);
                        }}
                        displayValue="name"
                        showArrow
                        customArrow={
                          !isPublicationAreaDropdownOpen ? (
                            <ArrowDropDownCircleIcon
                              className="cursor-pointer"
                              onClick={handlePublicationAreaDropdownToggle}
                            />
                          ) : (
                            <CancelIcon
                              className="cursor-pointer"
                              onClick={handlePublicationAreaDropdownToggle}
                            />
                          )
                        }
                        closeOnSelect
                        showCheckbox
                        keepListOpen={isPublicationAreaDropdownOpen}
                        className={
                          !isPublicationAreaDropdownOpen
                            ? "displayNoneShow"
                            : "displayBlockShow"
                        }
                      />
                      {errors.publicationArea && (
                        <span className="error-message">
                          {errors.publicationArea.message}
                        </span>
                      )}
                    </>
                  )}
                />
              </Grid>
              <Grid item lg={6} md={12} sm={12} xs={12}>
                <InputLabel>Event Type</InputLabel>
                <Controller
                  control={control}
                  name="eventTypes"
                  defaultValue={
                    editEventData && editEventData.eventType
                      ? editEventData.eventType
                        .flatMap((type) => type.split(","))
                        .map((type) => ({ name: type }))
                      : []
                  }
                  rules={{ required: "Event type is required." }}
                  render={({ field }) => (
                    <>
                      <Multiselect
                        options={eventTypes.map((item) => ({
                          name: item.eventTypeName,
                          id: item.id,
                        }))}
                        selectedValues={field.value}
                        onSelect={(selectedList) => {
                          onSelectEventTypes(selectedList);
                          field.onChange(selectedList);
                        }}
                        onRemove={(selectedList) => {
                          onRemoveEventTypes(selectedList);
                          field.onChange(selectedList);
                        }}
                        displayValue="name"
                        showArrow
                        customArrow={
                          !isEventTypeDropdownOpen ? (
                            <ArrowDropDownCircleIcon
                              className="cursor-pointer"
                              onClick={handleEventTypeDropdownToggle}
                            />
                          ) : (
                            <CancelIcon
                              className="cursor-pointer"
                              onClick={handleEventTypeDropdownToggle}
                            />
                          )
                        }
                        closeOnSelect
                        showCheckbox
                        keepListOpen={isEventTypeDropdownOpen}
                        className={
                          !isEventTypeDropdownOpen
                            ? "displayNoneShow"
                            : "displayBlockShow"
                        }
                      />
                      {errors.eventTypes && (
                        <span className="error-message">
                          {errors.eventTypes.message}
                        </span>
                      )}
                    </>
                  )}
                />
              </Grid>
              <Grid item lg={6} md={12} sm={12} xs={12}>
                <InputLabel>Upload Files</InputLabel>
                <Controller
                  control={control}
                  name="uploadedFiles"
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <input
                        className="event-form-file"
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*, .pdf"
                        multiple
                        name="uploadedFiles"
                      />
                      <>
                        {editEventData &&
                          editEventData.imageUrl &&
                          editEventData.imageUrl.map((file) => (
                            <div
                              className="pdf-img-style-box"
                              key={file.imageId}
                            >
                              <p>{getImageFilename(file.imageUrl)}</p>
                              <p>
                                <span
                                  onClick={() => handleImageClick(file)}
                                  className="icon-style"
                                >
                                  <VisibilityIcon />
                                </span>
                                <span
                                  onClick={() =>
                                    handleDeleteImage(file.imageId)
                                  }
                                  className="icon-style2"
                                >
                                  <DeleteIcon />
                                </span>
                              </p>
                            </div>
                          ))}
                        {uploadedFiles.map((file) => (
                          <div className="pdf-img-style-box" key={file.name}>
                            <p>{file.name}</p>
                            <p>
                              <span
                                onClick={() => handlePdfSelect(file)}
                                className="icon-style"
                              >
                                <VisibilityIcon />
                              </span>
                              <span
                                onClick={() => handleFileRemove(file.name)}
                                className="icon-style2"
                              >
                                <DeleteIcon />
                              </span>
                            </p>
                          </div>
                        ))}
                      </>

                      {uploadedFiles.length > 3 && (
                        <FormHelperText className="error-message">
                          {`Can not upload more than 3 files: ${field.value.length}/3`}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <InputLabel>Event Details</InputLabel>
                <Controller
                  control={control}
                  name="eventDetails"
                  defaultValue={editEventData ? editEventData.eventDetails : ""}
                  rules={{
                    required: "Event Details are required",
                  }}
                  render={({ field }) => (
                    <div>
                      <TextField {...field} multiline rows={4} fullWidth />
                      {errors["eventDetails"] && (
                        <FormHelperText className="error-message">
                          {errors["eventDetails"].message}
                        </FormHelperText>
                      )}
                    </div>
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CircularProgress className="event-form-submit-button-loader" size={24} />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Modal>
      <Modal
        open={isPdfModalOpen}
        onClose={closePdfModal}
        aria-labelledby="pdf-modal-title"
        aria-describedby="pdf-modal-description"
        className="event-pdf-modal-open"
      >
        <div className="pdf-modal">
          <IconButton onClick={closePdfModal} aria-label="close">
            <CloseIcon />
          </IconButton>
          {selectedPdf && (
            <>
              {selectedPdf.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(selectedPdf)}
                  alt={selectedPdf.name}
                className="event-select-img"
                />
              ) : (
                <Worker
                  workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}
                >
                  <Viewer fileUrl={URL.createObjectURL(selectedPdf)} />
                </Worker>
              )}
            </>
          )}
        </div>
      </Modal>
      <ConfirmDialog
        open={confirmDialogOpen}
        handleClose={() => setConfirmDialogOpen(false)}
        handleConfirm={handleConfirmDelete}
        confirmationText={confirmationText}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default AdminEventRequest;
