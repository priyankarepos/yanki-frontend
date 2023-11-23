import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, TextField, Modal, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, InputLabel, Snackbar } from '@mui/material';
import AdminDashboard from './AdminDashboard';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { Context } from '../App';
import {
  CircularProgress,
} from '@mui/material';
import ConfirmDialog from '../EnterpriseCollabration/ConfirmDialog';

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
        padding: '16px',
        marginLeft: '0',
        transition: 'margin-left 0.3s',
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

const AdminEnterpriseCategory = () => {
  const { drawerOpen } = useContext(Context);
  const [enterpriseCategories, setEnterpriseCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
const [selectedCategoryId, setSelectedCategoryId] = useState(null);
const [confirmationText, setConfirmationText] = useState('');

  console.log("enterpriseCategories", enterpriseCategories);

  useEffect(() => {
    const fetchEnterpriseCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/yanki-ai/get-enterprises-categories`);

        if (response.status === 200) {
          setEnterpriseCategories(response.data);
        } else {
          console.error('Failed to fetch enterprise categories');
        }
      } catch (error) {
        console.error('Error fetching enterprise categories:', error);
        setSnackbarMessage('Error fetching enterprise categories');
        setSnackbarOpen(true);
      }
    };
    fetchEnterpriseCategories();
  }, [isModalOpen]);

  const handleEdit = (id) => {
    const category = enterpriseCategories.find((category) => category.id === id);
    console.log("category", category);
    setCategoryName(category.name);
    setEditCategoryId(id);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (id) => {
    // Open the confirmation dialog and store the selected category ID
    setConfirmDialogOpen(true);
    setSelectedCategoryId(id); // Use setSelectedCategoryId to store the selected category ID
    setConfirmationText(`Are you sure you want to delete this category?`);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_HOST}/api/yanki-ai/delete-enterprise-category/${selectedCategoryId}`
      );

      if (response.status === 200) {
        const updatedCategories = enterpriseCategories.filter((category) => category.id !== selectedCategoryId);
        setEnterpriseCategories(updatedCategories);
        setConfirmDialogOpen(false);
        setSnackbarMessage('Category deleted successfully');
        setSnackbarOpen(true);
      } else {
        console.error('Failed to delete enterprise category');
        setSnackbarMessage('Failed to delete enterprise category');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setSnackbarMessage('Error deleting enterprise category');
      setSnackbarOpen(true);
    }
  };

  const handleAddCategory = () => {
    setCategoryName('');
    setEditCategoryId(null);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async () => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_HOST}/api/yanki-ai/add-enterprise-category`;
  
      const response = await axios.post(apiUrl, { name: categoryName });
  
      if (response.status === 200) {
        const newCategory = response.data;
  
        // Update state with the new category
        setEnterpriseCategories((prevCategories) => [...prevCategories, newCategory]);
  
        setIsModalOpen(false);
        setCategoryName('');
        setEditCategoryId(''); // Reset editCategoryId after successful save
  
        setSnackbarMessage('Category saved successfully');
        setSnackbarOpen(true);
      } else {
        console.error('Failed to save enterprise category');
        setSnackbarMessage('Failed to save enterprise category');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setSnackbarMessage('Error saving enterprise category');
      setSnackbarOpen(true);
    }
  };
  
  

  const handleUpdate = async () => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_HOST}/api/yanki-ai/update-enterprise-category`;
  
      const response = await axios.put(apiUrl, { name: categoryName, id: editCategoryId });
  
      if (response.status === 200) {
        const updatedCategory = response.data;
  
        // Update state with the new category
        setEnterpriseCategories((prevCategories) => {
          const updatedCategories = prevCategories.map((category) => (category.id === editCategoryId ? updatedCategory : category));
  
          setIsModalOpen(false);
          setCategoryName('');
          setEditCategoryId(null); // Reset editCategoryId after successful save
  
          return updatedCategories;
        });
  
        setSnackbarMessage('Category updated successfully');
        setSnackbarOpen(true);
      } else {
        console.error('Failed to update enterprise category');
        setSnackbarMessage('Failed to update enterprise category');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setSnackbarMessage('Error updating enterprise category');
      setSnackbarOpen(true);
    }
  };
  
  

  const contentMargin = drawerOpen ? '0' : '0';

  return (
    <Box style={{ display: "flex" }}>
      <Box sx={{ width: drawerOpen ? '270px' : "0" }}><AdminDashboard /></Box>
      <Box style={{ ...styles.content, marginLeft: contentMargin }} className="enterpriseFormBox" sx={{ width: drawerOpen ? 'calc(100% - 270px)' : "100%", marginTop: '70px', padding: '16px' }}>
        <Box style={{ ...styles.content, marginLeft: contentMargin }}>
          <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: "15px", }}>
            <Typography variant="h6" sx={{ flex: '1', pb: 2 }}>
              Enterprise Categories
            </Typography>
            <IconButton color="secondary" size="small" style={{ color: "#fff", padding: "5px" }} onClick={handleAddCategory}>
              <AddIcon /> Add
            </IconButton>
          </Box>
          <TableContainer component={Paper} style={styles.tableContainer}>
            <Table style={styles.table}>
              <TableHead>
                <TableRow>
                  <TableCell style={styles.headerCell}>Category Name</TableCell>
                  <TableCell style={{ ...styles.headerCell, textAlign: "right", }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {enterpriseCategories.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell style={styles.cell}>{row.name}</TableCell>
                    <TableCell style={{ ...styles.cell, textAlign: "right", }}>
                      <IconButton onClick={() => handleEdit(row.id)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteCategory(row.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
            {editCategoryId !== null ? "Edit Enterprise Category" : "Add Enterprise Category"}
          </Typography>
          <form style={styles.modalForm}>
            <InputLabel style={styles.label}>Category Name</InputLabel>
            <TextField
              variant="outlined"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder='Enter Category'
            />
            <Button
              variant="contained"
              color="primary"
              onClick={editCategoryId !== null ? handleUpdate : handleSaveCategory}
              style={styles.modalButton}
            >
              {editCategoryId !== null ? "Save Changes" : "Save & Add"}
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

export default AdminEnterpriseCategory;
