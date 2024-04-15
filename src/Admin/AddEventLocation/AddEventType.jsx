import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, TextField, Modal, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, InputLabel, Snackbar, CircularProgress } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import ConfirmDialog from '../../EnterpriseCollabration/ConfirmDialog';
import { Context } from '../../App';
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

const AdminAddEventType = () => {
  const { drawerOpen } = useContext(Context);
  const [eventTypes, setEventTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventTypeName, setEventTypeName] = useState('');
  const [editEventTypeId, setEditEventTypeId] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedEventTypeId, setSelectedEventTypeId] = useState(null);
  const [confirmationText, setConfirmationText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/event-type/get-events-types`);

        if (response.status === 200) {
          setEventTypes(response.data);
        } else {
          setSnackbarMessage('Failed to fetch event types');
          setSnackbarOpen(true);
        }
      } catch (error) {
        setSnackbarMessage('Error:', error);
        setSnackbarOpen(true);
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
        `${process.env.REACT_APP_API_HOST}/api/event-type/delete-event-type/${selectedEventTypeId}`
      );

      if (response.status === 200) {
        const updatedEventTypes = eventTypes.filter((event) => event.id !== selectedEventTypeId);
        setEventTypes(updatedEventTypes);
        setConfirmDialogOpen(false);
        setSnackbarMessage('Event type deleted successfully');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage('Failed to delete Event type');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('Error:', error);
      setSnackbarOpen(true);
    }
  };

  const handleAddEventType = () => {
    setEventTypeName('');
    setEditEventTypeId(null);
    setIsModalOpen(true);
  };

  const handleSaveEventType = async () => {
    try {
      setLoading(true);
      if (eventTypes.some(event => event.eventTypeName.toLowerCase() === eventTypeName.toLowerCase())) {
        setSnackbarMessage('This event type name already exists!');
        setSnackbarOpen(true);
        return;
      }

      const apiUrl = `${process.env.REACT_APP_API_HOST}/api/event-type/add-event-type`;

      const response = await axios.post(apiUrl, { eventTypeName });

      if (response.status === 200) {
        const newEventType = response.data;
        setEventTypes((prevEventTypes) => [...prevEventTypes, newEventType]);
        setIsModalOpen(false);
        setEventTypeName('');
        setEditEventTypeId('');
        setSnackbarMessage('Event type saved successfully');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage('Failed to save enterprise event type');
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
      if (eventTypes.some(event => event.eventTypeName === eventTypeName && event.id !== editEventTypeId)) {
        setSnackbarMessage('This event type already exists!');
        setSnackbarOpen(true);
        return;
      }

      const apiUrl = `${process.env.REACT_APP_API_HOST}/api/event-type/update-event-type`;

      const response = await axios.put(apiUrl, { id: editEventTypeId, eventTypeName });

      if (response.status === 200) {
        const updatedEventType = response.data;
        setEventTypes((prevEventTypes) => {
          const updatedCategories = prevEventTypes.map((event) => (event.id === editEventTypeId ? updatedEventType : event));
          setIsModalOpen(false);
          setEventTypeName('');
          setEditEventTypeId(null);
          return updatedCategories;
        });
        setSnackbarMessage('Event type updated successfully');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage('Failed to update event type');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('Error:', error);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const contentMargin = drawerOpen ? '0' : '0';

  return (
    <Box sx={{ display: "flex" }}>
      <Box style={{ ...styles.content }}>
        <Box style={{ ...styles.content, marginLeft: contentMargin }}>
          <Box className="event-top-heading">
            <Typography variant="h6" sx={{ flex: '1', pb: 2 }}>
              Add Event Type
            </Typography>
            <IconButton color="primary" size="small" onClick={handleAddEventType}>
              <AddIcon /> Add
            </IconButton>
          </Box>
          {eventTypes.length > 0 ? (
            <TableContainer component={Paper} style={styles.tableContainer}>
              <Table style={styles.table}>
                <TableHead>
                  <TableRow>
                    <TableCell style={styles.headerCell}>Event Type</TableCell>
                    <TableCell style={{ ...styles.headerCell, textAlign: "right", }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {eventTypes.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell style={styles.cell}>{row.eventTypeName}</TableCell>
                      <TableCell style={{ ...styles.cell, textAlign: "right", }}>
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
            </TableContainer>) : (
            <Typography variant="body1" className='no-data-found'>
              No event type available. Please add event type.
            </Typography>
          )}
        </Box>
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
            {editEventTypeId !== null ? "Edit Event Type" : "Add Event Type"}
          </Typography>
          <form
            style={styles.modalForm}
            onSubmit={(e) => {
              e.preventDefault();
              editEventTypeId !== null ? handleUpdate() : handleSaveEventType();
            }}
          >
            <InputLabel style={styles.label}>Event Type</InputLabel>
            <TextField
              variant="outlined"
              value={eventTypeName}
              onChange={(e) => setEventTypeName(e.target.value)}
              placeholder='Enter Type'
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              style={styles.modalButton}
              disabled={loading || !eventTypeName.trim()}
            >
              {loading ? <CircularProgress size={24} /> : (editEventTypeId !== null ? "Save Changes" : "Save & Add")}
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

export default AdminAddEventType;
