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

const AdminAddEventPublicationArea = () => {
  const [publicationArea, setPublicationArea] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [publicationAreaName, setPublicationAreaName] = useState("");
  const [editPublicationAreaId, setEditPublicationAreaId] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [confirmationText, setConfirmationText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEventPublicationArea = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_HOST}/api/event-publication-area/get-events-publicationAreas`
        );

        if (response.status === 200) {
          setPublicationArea(response.data);
        } else {
          setSnackbarMessage("Failed to fetch publication area");
          setSnackbarOpen(true);
        }
      } catch (error) {
        setSnackbarMessage(error);
        setSnackbarOpen(true);
      }
    };

    fetchEventPublicationArea();
  }, [isModalOpen]);

  const handleEdit = (id) => {
    const area = publicationArea.find(
      (publicationArea) => publicationArea.id === id
    );
    setPublicationAreaName(area.eventPublicationAreaName);
    setEditPublicationAreaId(id);
    setIsModalOpen(true);
  };

  const handleDeleteArea = (id) => {
    setConfirmDialogOpen(true);
    setSelectedAreaId(id);
    setConfirmationText(
      `Are you sure you want to delete this publication area?`
    );
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_APP_API_HOST}/api/event-publication-area/delete-event-publicationArea/${selectedAreaId}`
      );

      if (response.status === 200) {
        const updatedAreas = publicationArea.filter(
          (area) => area.id !== selectedAreaId
        );
        setPublicationArea(updatedAreas);
        setConfirmDialogOpen(false);
        setSnackbarMessage("Publication Area deleted successfully");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage("Failed to delete publication area");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("Error:", error);
      setSnackbarOpen(true);
    }
  };

  const handleAddPublicationArea = () => {
    setPublicationAreaName("");
    setEditPublicationAreaId(null);
    setIsModalOpen(true);
  };

  const handleSaveArea = async () => {
    try {
      setLoading(true);
      if (
        publicationArea.some(
          (area) =>
            area.eventPublicationAreaName.toLowerCase() ===
            publicationAreaName.toLowerCase()
        )
      ) {
        setSnackbarMessage("This publication area already exists!");
        setSnackbarOpen(true);
        return;
      }

      const apiUrl = `${import.meta.env.VITE_APP_API_HOST}/api/event-publication-area/add-event-publicationArea`;

      const response = await axios.post(apiUrl, {
        eventPublicationAreaName: publicationAreaName,
      });

      if (response.status === 200) {
        const newPublicationArea = response.data;
        setPublicationArea((prevArea) => [...prevArea, newPublicationArea]);
        setIsModalOpen(false);
        setPublicationAreaName("");
        setEditPublicationAreaId("");
        setSnackbarMessage("Publication area saved successfully");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage("Failed to save publication area");
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
        publicationArea.some(
          (area) =>
            area.eventPublicationAreaName === publicationAreaName &&
            area.id !== editPublicationAreaId
        )
      ) {
        setSnackbarMessage("This publication area already exists!");
        setSnackbarOpen(true);
        return;
      }

      const apiUrl = `${import.meta.env.VITE_APP_API_HOST}/api/event-publication-area/update-event-publicationArea`;

      const response = await axios.put(apiUrl, {
        id: editPublicationAreaId,
        eventPublicationAreaName: publicationAreaName,
      });

      if (response.status === 200) {
        const updatedArea = response.data;
        setPublicationArea((prevArea) => {
          const updatedAreas = prevArea.map((area) =>
            area.id === editPublicationAreaId ? updatedArea : area
          );
          setIsModalOpen(false);
          setPublicationAreaName("");
          setEditPublicationAreaId(null);
          return updatedAreas;
        });
        setSnackbarMessage("Publication area updated successfully");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage("Failed to update publication area");
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
            Add Event Publication Area
          </Typography>
          <IconButton
            color="primary"
            size="small"
            onClick={handleAddPublicationArea}
          >
            <AddIcon /> Add
          </IconButton>
        </Box>
        {publicationArea.length > 0 ? (
          <TableContainer component={Paper} className="marginBottom-0">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="event-headerCell">
                    Publication Area
                  </TableCell>
                  <TableCell className="event-headerCell text-right">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {publicationArea.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="event-cell">
                      {row.eventPublicationAreaName}
                    </TableCell>
                    <TableCell className="event-cell text-right">
                      <IconButton onClick={() => handleEdit(row.id)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteArea(row.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body1" className="no-data-found">
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
            {editPublicationAreaId !== null
              ? "Edit Event Publication Area"
              : "Add Event Publication Area"}
          </Typography>
          <form
            className="admin-faq-form-model"
            onSubmit={(e) => {
              e.preventDefault();
              editPublicationAreaId !== null
                ? handleUpdate()
                : handleSaveArea();
            }}
          >
            <InputLabel className="enterprise-label">
              Publication Area
            </InputLabel>
            <TextField
              variant="outlined"
              value={publicationAreaName}
              onChange={(e) => setPublicationAreaName(e.target.value)}
              placeholder="Enter Publication Area"
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className="enterprise-add-category-save-button"
              disabled={loading || !publicationAreaName.trim()}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : editPublicationAreaId !== null ? (
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

export default AdminAddEventPublicationArea;
