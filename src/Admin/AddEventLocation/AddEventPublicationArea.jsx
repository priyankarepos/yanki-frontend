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

const AdminAddEventPublicationArea = () => {
  const { drawerOpen } = useContext(Context);
  const [publicationArea, setPublicationArea] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [publicationAreaName, setPublicationAreaName] = useState('');
  const [editPublicationAreaId, setEditPublicationAreaId] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [confirmationText, setConfirmationText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEventPublicationArea = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/event-publication-area/get-events-publicationAreas`);

        if (response.status === 200) {
          setPublicationArea(response.data);
        } else {
          setSnackbarMessage('Failed to fetch publication area');
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
    const area = publicationArea.find((publicationArea) => publicationArea.id === id);
    setPublicationAreaName(area.eventPublicationAreaName);
    setEditPublicationAreaId(id);
    setIsModalOpen(true);
  };

  const handleDeleteArea = (id) => {
    setConfirmDialogOpen(true);
    setSelectedAreaId(id);
    setConfirmationText(`Are you sure you want to delete this publication area?`);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_HOST}/api/event-publication-area/delete-event-publicationArea/${selectedAreaId}`
      );

      if (response.status === 200) {
        const updatedAreas = publicationArea.filter((area) => area.id !== selectedAreaId);
        setPublicationArea(updatedAreas);
        setConfirmDialogOpen(false);
        setSnackbarMessage('Publication Area deleted successfully');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage('Failed to delete publication area');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('Error:', error);
      setSnackbarOpen(true);
    }
  };

  const handleAddPublicationArea = () => {
    setPublicationAreaName('');
    setEditPublicationAreaId(null);
    setIsModalOpen(true);
  };

  const handleSaveArea = async () => {
    try {
      setLoading(true);
      if (publicationArea.some(area => area.eventPublicationAreaName.toLowerCase() === publicationAreaName.toLowerCase())) {
        setSnackbarMessage('This publication area already exists!');
        setSnackbarOpen(true);
        return;
      }

      const apiUrl = `${process.env.REACT_APP_API_HOST}/api/event-publication-area/add-event-publicationArea`;

      const response = await axios.post(apiUrl, { eventPublicationAreaName: publicationAreaName });

      if (response.status === 200) {
        const newPublicationArea = response.data;
        setPublicationArea((prevArea) => [...prevArea, newPublicationArea]);
        setIsModalOpen(false);
        setPublicationAreaName('');
        setEditPublicationAreaId('');
        setSnackbarMessage('Publication area saved successfully');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage('Failed to save publication area');
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
      if (publicationArea.some(area => area.eventPublicationAreaName === publicationAreaName && area.id !== editPublicationAreaId)) {
        setSnackbarMessage('This publication area already exists!');
        setSnackbarOpen(true);
        return;
      }

      const apiUrl = `${process.env.REACT_APP_API_HOST}/api/event-publication-area/update-event-publicationArea`;

      const response = await axios.put(apiUrl, { id: editPublicationAreaId, eventPublicationAreaName: publicationAreaName });

      if (response.status === 200) {
        const updatedArea = response.data;
        setPublicationArea((prevArea) => {
          const updatedAreas = prevArea.map((area) => (area.id === editPublicationAreaId ? updatedArea : area));
          setIsModalOpen(false);
          setPublicationAreaName('');
          setEditPublicationAreaId(null);
          return updatedAreas;
        });
        setSnackbarMessage('Publication area updated successfully');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage('Failed to update publication area');
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
      <Box style={{ ...styles.content }} className="enterpriseFormBox">
        <Box style={{ ...styles.content, marginLeft: contentMargin }}>
          <Box className="event-top-heading">
            <Typography variant="h6" sx={{ flex: '1', pb: 2 }}>
              Add Event Publication Area
            </Typography>
            <IconButton color="primary" size="small" onClick={handleAddPublicationArea}>
              <AddIcon /> Add
            </IconButton>
          </Box>
          {publicationArea.length > 0 ? (
            <TableContainer component={Paper} style={styles.tableContainer}>
              <Table style={styles.table}>
                <TableHead>
                  <TableRow>
                    <TableCell style={styles.headerCell}>Publication Area</TableCell>
                    <TableCell style={{ ...styles.headerCell, textAlign: "right", }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {publicationArea.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell style={styles.cell}>{row.eventPublicationAreaName}</TableCell>
                      <TableCell style={{ ...styles.cell, textAlign: "right", }}>
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
            </TableContainer>) : (
            <Typography variant="body1" className='no-data-found'>
              No event location available. Please add a location.
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
            {editPublicationAreaId !== null ? "Edit Event Publication Area" : "Add Event Publication Area"}
          </Typography>
          <form
            style={styles.modalForm}
            onSubmit={(e) => {
              e.preventDefault();
              editPublicationAreaId !== null ? handleUpdate() : handleSaveArea();
            }}
          >
            <InputLabel style={styles.label}>Publication Area</InputLabel>
            <TextField
              variant="outlined"
              value={publicationAreaName}
              onChange={(e) => setPublicationAreaName(e.target.value)}
              placeholder='Enter Publication Area'
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              style={styles.modalButton}
              disabled={loading || !publicationAreaName.trim()}
            >
              {loading ? <CircularProgress size={24} /> : (editPublicationAreaId !== null ? "Save Changes" : "Save & Add")}
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

export default AdminAddEventPublicationArea;
