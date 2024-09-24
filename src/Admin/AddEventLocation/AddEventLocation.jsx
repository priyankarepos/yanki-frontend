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
import { apiUrls, message } from "../../Utils/stringConstant/AdminString";
import { messages } from "../../Utils/stringConstant/EnterpriseProfileString";

const AdminAddEventLocation = () => {
  const [eventLocations, setEventLocations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [editLocationId, setEditLocationId] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [confirmationText, setConfirmationText] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    const fetchEventLocations = async () => {
      try {
        const response = await axios.get(apiUrls.getEventLocations);

        if (response.status === 200) {
          setEventLocations(response.data);
        } else {
          setSnackbarMessage(message.failedFetchEventLocation);
          setSnackbarOpen(true);
        }
      } catch (error) {
        setSnackbarMessage(message.failedFetchEventLocation, error);
        setSnackbarOpen(true);
      } finally {
        setLoadingData(false);
      }
    };

    fetchEventLocations();
  }, [isModalOpen]);

  const handleEdit = (id) => {
    const location = eventLocations.find((location) => location.id === id);
    setLocationName(location.eventLocationName);
    setEditLocationId(id);
    setIsModalOpen(true);
  };

  const handleDeleteLocation = (id) => {
    setConfirmDialogOpen(true);
    setSelectedLocationId(id);
    setConfirmationText(message.deleteLocation);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(
        apiUrls.deleteEventLocations(selectedLocationId)
      );

      if (response.status === 200) {
        const updatedCategories = eventLocations.filter(
          (location) => location.id !== selectedLocationId
        );
        setEventLocations(updatedCategories);
        setConfirmDialogOpen(false);
        setSnackbarMessage(message.successDeleteLocation);
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage(message.failedDeleteLocation);
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage(message.errorDeleteLocation, error);
      setSnackbarOpen(true);
    }
  };

  const handleAddLocation = () => {
    setLocationName("");
    setEditLocationId(null);
    setIsModalOpen(true);
  };

  const handleSaveLocation = async () => {
    try {
      setLoading(true);
      if (
        eventLocations.some(
          (location) =>
            location.eventLocationName.toLowerCase() ===
            locationName.toLowerCase()
        )
      ) {
        setSnackbarMessage(message.locationAlreadyExists);
        setSnackbarOpen(true);
        return;
      }

      const response = await axios.post(apiUrls.addEventLocations, {
        eventLocationName: locationName,
      });

      if (response.status === 200) {
        const newLocation = response.data;
        setEventLocations((prevCategories) => [...prevCategories, newLocation]);
        setIsModalOpen(false);
        setLocationName("");
        setSnackbarMessage(newLocation);
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage(message.failedSaveLocation);
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage(message.failedSaveLocation, error);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      if (
        eventLocations.some(
          (location) =>
            location.eventLocationName === locationName &&
            location.id !== editLocationId
        )
      ) {
        setSnackbarMessage(message.locationAlreadyExists);
        setSnackbarOpen(true);
        return;
      }
      const response = await axios.put(apiUrls.updateEventLocations, {
        id: editLocationId,
        eventLocationName: locationName,
      });
      if (response.status === 200) {
        const updatedLocation = response.data;
        setEventLocations((prevCategories) => {
          const updatedCategories = prevCategories.map((location) =>
            location.id === editLocationId ? updatedLocation : location
          );
          setIsModalOpen(false);
          setLocationName("");
          setEditLocationId(null);
          return updatedCategories;
        });
        setSnackbarMessage(message.locationUpdatedSuccess);
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage(message.failedUpdateLocation);
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage(message.failedUpdateLocation, error);
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
            Add Event Location
          </Typography>
          <IconButton color="primary" size="small" onClick={handleAddLocation}>
            <AddIcon /> Add
          </IconButton>
        </Box>
        {loadingData ? <div className={classNames.noDataFoundClass}>
          <CircularProgress />
        </div> : eventLocations.length > 0 ? (
          <TableContainer component={Paper} className="marginBottom-0">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="event-headerCell">Location</TableCell>
                  <TableCell className="event-headerCell text-right">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {eventLocations.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="event-cell">
                      {row.eventLocationName}
                    </TableCell>
                    <TableCell className="event-cell text-right">
                      <IconButton onClick={() => handleEdit(row.id)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteLocation(row.id)}>
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
            No event location available. Please add a location.
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
          <Typography
            variant="h5"
            className="enterprise-add-category-modal-title"
          >
            {editLocationId !== null
              ? "Edit Event Location"
              : "Add Event Location"}
          </Typography>
          <form
            className="admin-faq-form-model"
            onSubmit={(e) => {
              e.preventDefault();
              editLocationId !== null ? handleUpdate() : handleSaveLocation();
            }}
          >
            <InputLabel className="enterprise-label">Location<sup className={messages.requiredIcon}>*</sup></InputLabel>
            <TextField
              variant="outlined"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="Enter Location"
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className="enterprise-add-category-save-button"
              disabled={loading || !locationName.trim()}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : editLocationId !== null ? (
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

export default AdminAddEventLocation;
