import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Modal, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, InputLabel, Snackbar, CircularProgress } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import ConfirmDialog from '../../EnterpriseCollabration/ConfirmDialog';
import "./EventLocation.scss";

const styles = {
  tableContainer: {
    marginBottom: '0',
  },
  label: {
    color: '#8bbae5',
    marginBottom: '8px',
  },
  headerCell: {
    fontWeight: 'bold',
    background: '#13538b',
    color: 'white',
    minWidth: "200px",
    fontSize: 16,
  },
  cell: {
    fontSize: 16,
  },
  approveButton: {
    backgroundColor: "#063762",
    color: "#fff",
    textTransform: "capitalize",
    borderRadius: "50px",
    padding: "0 15px",
    height: "40px",
    marginLeft: "7px",
  },
  content: {
    flex: 1,
    padding1:"16px",
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#063762',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
    padding: '35px 25px',
    width: '500px',
    borderRadius: '8px',
  },
  modalTitle: {
    fontWeight: 'medium',
    marginBottom: '16px',
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  modalButton: {
    backgroundColor: '#fff',
    color: '#063762',
    textTransform: 'capitalize',
    borderRadius: '10px',
    padding: '30px 15px',
    fontSize: '16px',
    marginTop: "20px",
  },
};

const AdminAddEventLocation = () => {
  const [eventLocations, setEventLocations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [editLocationId, setEditLocationId] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [confirmationText, setConfirmationText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEventLocations = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/event-location/get-events-locations`);

        if (response.status === 200) {
          setEventLocations(response.data);
        } else {
          setSnackbarMessage('Failed to fetch event location');
          setSnackbarOpen(true);
        }
      } catch (error) {
        setSnackbarMessage('Error fetching event location', error);
        setSnackbarOpen(true);
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
    setConfirmationText(`Are you sure you want to delete this location?`);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_HOST}/api/event-location/delete-event-location/${selectedLocationId}`
      );
  
      if (response.status === 200) {
        const updatedCategories = eventLocations.filter((location) => location.id !== selectedLocationId);
        setEventLocations(updatedCategories);
        setConfirmDialogOpen(false);
        setSnackbarMessage('Location deleted successfully');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage('Failed to delete event location');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('Error deleting event location',error);
      setSnackbarOpen(true);
    }
  };

  const handleAddLocation = () => {
    setLocationName('');
    setEditLocationId(null);
    setIsModalOpen(true);
  };

  const handleSaveLocation = async () => {
    try {
      setLoading(true);
      if (eventLocations.some(location => location.eventLocationName.toLowerCase() === locationName.toLowerCase())) {
        setSnackbarMessage('This location already exists!');
        setSnackbarOpen(true);
        return;
      }

      const response = await axios.post(`${process.env.REACT_APP_API_HOST}/api/event-location/add-event-location`, { eventLocationName: locationName });

      if (response.status === 200) {
        const newLocation = response.data;
        setEventLocations((prevCategories) => [...prevCategories, newLocation]);
        setIsModalOpen(false);
        setLocationName('');
        setSnackbarMessage(newLocation);
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage('Failed to save event location');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('Error:', error);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      if (eventLocations.some(location => location.eventLocationName === locationName && location.id !== editLocationId)) {
        setSnackbarMessage('This location already exists!');
        setSnackbarOpen(true);
        return;
      }
      const apiUrl = `${process.env.REACT_APP_API_HOST}/api/event-location/update-event-location`;
      const response = await axios.put(apiUrl, { id: editLocationId, eventLocationName: locationName });
      if (response.status === 200) {
        const updatedLocation = response.data;
        setEventLocations((prevCategories) => {
          const updatedCategories = prevCategories.map((location) => (location.id === editLocationId ? updatedLocation : location));
          setIsModalOpen(false);
          setLocationName('');
          setEditLocationId(null);
          return updatedCategories;
        });
        setSnackbarMessage('Location updated successfully');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage('Failed to update event location');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('Error:', error);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Box style={{ ...styles.content}} className="enterpriseFormBox">
          <Box className="event-top-heading">
            <Typography variant="h6" sx={{ flex: '1', pb: 2 }}>
              Add Event Location
            </Typography>
            <IconButton color="primary" size="small" onClick={handleAddLocation}>
              <AddIcon /> Add
            </IconButton>
          </Box>
          {eventLocations.length > 0 ? (
            <TableContainer component={Paper} style={styles.tableContainer}>
              <Table style={styles.table}>
                <TableHead>
                  <TableRow>
                    <TableCell style={styles.headerCell}>Location</TableCell>
                    <TableCell style={{ ...styles.headerCell, textAlign: "right", }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {eventLocations.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell style={styles.cell}>{row.eventLocationName}</TableCell>
                      <TableCell style={{ ...styles.cell, textAlign: "right", }}>
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
            </TableContainer>) : (
            <Typography variant="body1" className='no-data-found'>
              No event location available. Please add a location.
            </Typography>
          )}
        </Box>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={styles.modal}
      >
        <Box style={styles.modalContent}>
          <Typography variant="h5" sx={styles.modalTitle}>
            {editLocationId !== null ? "Edit Event Location" : "Add Event Location"}
          </Typography>
          <form
            style={styles.modalForm}
            onSubmit={(e) => {
              e.preventDefault();
              editLocationId !== null ? handleUpdate() : handleSaveLocation();
            }}
          >
            <InputLabel style={styles.label}>Location</InputLabel>
            <TextField
              variant="outlined"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder='Enter Location'
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              style={styles.modalButton}
              disabled={loading || !locationName.trim()}
            >
              {loading ? <CircularProgress size={24} /> : (editLocationId !== null ? "Save Changes" : "Save & Add")}
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
  )
}

export default AdminAddEventLocation;
