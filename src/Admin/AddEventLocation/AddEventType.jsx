import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import ConfirmDialog from "../../EnterpriseCollabration/ConfirmDialog";
import "./EventLocation.scss";
import { classNames } from "../../Utils/stringConstant/stringConstant";
import { apiUrls, className } from "../../Utils/stringConstant/AdminString";
import { messages } from "../../Utils/stringConstant/EnterpriseProfileString";

const AdminAddEventType = () => {
  const [eventTypes, setEventTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventTypeName, setEventTypeName] = useState("");
  const [editEventTypeId, setEditEventTypeId] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedEventTypeId, setSelectedEventTypeId] = useState(null);
  const [confirmationText, setConfirmationText] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const response = await axios.get(apiUrls.getEventsTypes);

        if (response.status === 200) {
          setEventTypes(response.data);
        } else {
          setSnackbarMessage("Failed to fetch event types");
          setSnackbarOpen(true);
        }
      } catch (error) {
        setSnackbarMessage("Error:", error);
        setSnackbarOpen(true);
      } finally {
        setLoadingData(false);
      }
    };

    fetchEventTypes();
  }, [isModalOpen]);

  const handleEdit = (id) => {
    const eventType = eventTypes.find((event) => event.id === id);
    setEventTypeName(eventType.eventTypeName);
    setEditEventTypeId(id);
    setIsModalOpen(true);
  };

  const handleDeleteEventType = (id) => {
    setConfirmDialogOpen(true);
    setSelectedEventTypeId(id);
    setConfirmationText(`Are you sure you want to delete this event type?`);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(
        apiUrls.deleteEventTypes(selectedEventTypeId)
      );

      if (response.status === 200) {
        const updatedEventTypes = eventTypes.filter(
          (event) => event.id !== selectedEventTypeId
        );
        setEventTypes(updatedEventTypes);
        setConfirmDialogOpen(false);
        setSnackbarMessage("Event type deleted successfully");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage("Failed to delete Event type");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("Error:", error);
      setSnackbarOpen(true);
    }
  };

  const handleAddEventType = () => {
    setEventTypeName("");
    setEditEventTypeId(null);
    setIsModalOpen(true);
  };

  const handleSaveEventType = async () => {
    try {
      setLoading(true);
      if (
        eventTypes.some(
          (event) =>
            event.eventTypeName.toLowerCase() === eventTypeName.toLowerCase()
        )
      ) {
        setSnackbarMessage("This event type name already exists!");
        setSnackbarOpen(true);
        return;
      }

      const response = await axios.post(apiUrls.addEventTypes, { eventTypeName });

      if (response.status === 200) {
        const newEventType = response.data;
        setEventTypes((prevEventTypes) => [...prevEventTypes, newEventType]);
        setIsModalOpen(false);
        setEventTypeName("");
        setEditEventTypeId("");
        setSnackbarMessage("Event type saved successfully");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage("Failed to save enterprise event type");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("Error:", error);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      if (
        eventTypes.some(
          (event) =>
            event.eventTypeName === eventTypeName &&
            event.id !== editEventTypeId
        )
      ) {
        setSnackbarMessage("This event type already exists!");
        setSnackbarOpen(true);
        return;
      }

      const response = await axios.put(apiUrls.updateEventTypes, {
        id: editEventTypeId,
        eventTypeName,
      });

      if (response.status === 200) {
        const updatedEventType = response.data;
        setEventTypes((prevEventTypes) => {
          const updatedCategories = prevEventTypes.map((event) =>
            event.id === editEventTypeId ? updatedEventType : event
          );
          setIsModalOpen(false);
          setEventTypeName("");
          setEditEventTypeId(null);
          return updatedCategories;
        });
        setSnackbarMessage("Event type updated successfully");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage("Failed to update event type");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("Error:", error);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box>
        <Box className="event-top-heading">
          <Typography variant="h6" sx={{ pb: 2 }}>
            Add Event Type
          </Typography>
          <IconButton color="primary" size="small" onClick={handleAddEventType} className={className.eventAddButton}>
            <AddIcon /> Add
          </IconButton>
        </Box>
        {loadingData ? <div className={classNames.noDataFoundClass}>
          <CircularProgress />
        </div> : eventTypes.length > 0 ? (
          <TableContainer component={Paper} className="marginBottom-0">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="event-headerCell">Event Type</TableCell>
                  <TableCell className="event-headerCell text-right">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {eventTypes.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="event-cell">
                      {row.eventTypeName}
                    </TableCell>
                    <TableCell className="event-cell text-right">
                      <IconButton onClick={() => handleEdit(row.id)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteEventType(row.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body1" className={classNames.noDataFoundClass}>
            No event type available. Please add event type.
          </Typography>
        )}
      </Box>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="event-pdf-modal-open"
      >
        <Box className="enterprise-add-category-container">
          <Typography variant="h5"className="enterprise-add-category-modal-title">
            {editEventTypeId !== null ? "Edit Event Type" : "Add Event Type"}
          </Typography>
          <form
            className="admin-faq-form-model"
            onSubmit={(e) => {
              e.preventDefault();
              editEventTypeId !== null ? handleUpdate() : handleSaveEventType();
            }}
          >
            <InputLabel className="enterprise-label">Event Type<sup className={messages.requiredIcon}>*</sup></InputLabel>
            <TextField
              variant="outlined"
              value={eventTypeName}
              onChange={(e) => setEventTypeName(e.target.value)}
              placeholder="Enter Type"
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className="enterprise-add-category-save-button"
              disabled={loading || !eventTypeName.trim()}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : editEventTypeId !== null ? (
                "Save Changes"
              ) : (
                "Save & Add"
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
        handleConfirm={handleConfirmDelete}
        confirmationText={confirmationText}
      />
    </Box>
  );
};

export default AdminAddEventType;
