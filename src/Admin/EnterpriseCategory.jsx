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
} from "@mui/material";
import AdminDashboard from "./AdminDashboard";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { Context } from "../App";
import ConfirmDialog from "../EnterpriseCollabration/ConfirmDialog";
import { agentChatResponse } from "../Utils/stringConstant/AgentChatResponse";
import { classNames } from "../Utils/stringConstant/stringConstant";

const AdminEnterpriseCategory = () => {
  const { drawerOpen } = useContext(Context);
  const [enterpriseCategories, setEnterpriseCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [confirmationText, setConfirmationText] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    const fetchEnterpriseCategories = async () => {
      try {
        setLoadingData(true);
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/get-enterprises-categories`
        );

        if (response.status === 200) {
          setEnterpriseCategories(response.data);
        } else {
          setSnackbarMessage("Failed to fetch enterprise categories");
          setSnackbarOpen(true);
        }
      } catch (error) {
        setSnackbarMessage("Error fetching enterprise categories");
        setSnackbarOpen(true);
      } finally {
        setLoadingData(false);
      }
    };
    fetchEnterpriseCategories();
  }, [isModalOpen]);

  const handleEdit = (id) => {
    const category = enterpriseCategories.find(
      (category) => category.id === id
    );
    setCategoryName(category.name);
    setEditCategoryId(id);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (id) => {
    setConfirmDialogOpen(true);
    setSelectedCategoryId(id);
    setConfirmationText(`Are you sure you want to delete this category?`);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/delete-enterprise-category/${selectedCategoryId}`
      );

      if (response.status === 200) {
        const updatedCategories = enterpriseCategories.filter(
          (category) => category.id !== selectedCategoryId
        );
        setEnterpriseCategories(updatedCategories);
        setConfirmDialogOpen(false);
        setSnackbarMessage("Category deleted successfully");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage("Failed to delete enterprise category");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("Error deleting enterprise category");
      setSnackbarOpen(true);
    }
  };

  const handleAddCategory = () => {
    setCategoryName("");
    setEditCategoryId(null);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async () => {
    try {
      setLoading(true);
      if (
        enterpriseCategories.some(
          (category) =>
            category.name.toLowerCase() === categoryName.toLowerCase()
        )
      ) {
        setSnackbarMessage("This category name already exists!");
        setSnackbarOpen(true);
        return;
      }

      const apiUrl = `${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/add-enterprise-category`;

      const response = await axios.post(apiUrl, { name: categoryName });

      if (response.status === 200) {
        const newCategory = response.data;
        setEnterpriseCategories((prevCategories) => [
          ...prevCategories,
          newCategory,
        ]);
        setIsModalOpen(false);
        setCategoryName("");
        setEditCategoryId("");
        setSnackbarMessage("Category saved successfully");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage("Failed to save enterprise category");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("Error saving enterprise category");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      if (
        enterpriseCategories.some(
          (category) =>
            category.name === categoryName && category.id !== editCategoryId
        )
      ) {
        setSnackbarMessage("This category name already exists!");
        setSnackbarOpen(true);
        return;
      }
      const apiUrl = `${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/update-enterprise-category`;
      const response = await axios.put(apiUrl, {
        name: categoryName,
        id: editCategoryId,
      });
      if (response.status === 200) {
        const updatedCategory = response.data;
        setEnterpriseCategories((prevCategories) => {
          const updatedCategories = prevCategories.map((category) =>
            category.id === editCategoryId ? updatedCategory : category
          );
          setIsModalOpen(false);
          setCategoryName("");
          setEditCategoryId(null);
          return updatedCategories;
        });
        setSnackbarMessage("Category updated successfully");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage("Failed to update enterprise category");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("Error updating enterprise category");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return (
    <Box className="admin-faq-wrapper">
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
        className="enterprise-content"
        sx={{
          width: drawerOpen
            ? agentChatResponse.drawerOpenCalcWidth
            : agentChatResponse.hundredWidth, transition: agentChatResponse.transitionStyle,
        }}
      >
        <Box className="admin-faq-heading">
          <Typography variant="h6" sx={{ pb: 2 }}>
            Enterprise Categories
          </Typography>
          <IconButton
            color="secondary"
            size="small"
            onClick={handleAddCategory}
          >
            <AddIcon /> Add
          </IconButton>
        </Box>
        {loadingData ? <div className={classNames.noDataFoundClass}>
          <CircularProgress />
        </div> : enterpriseCategories.length > 0 ? (
          <TableContainer component={Paper} className="marginBottom-0">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="enterprise-headerCell">
                    Category Name
                  </TableCell>
                  <TableCell className="enterprise-headerCell text-right">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {enterpriseCategories.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="event-cell">{row.name}</TableCell>
                    <TableCell className="event-cell text-right">
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
        ) : (
          <Typography variant="body1" className={classNames.noDataFoundClass}>
            No categories available. Please add a category.
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
          <Typography variant="h5" className="enterprise-add-category-modal-title">
            {editCategoryId !== null
              ? "Edit Enterprise Category"
              : "Add Enterprise Category"}
          </Typography>
          <form
            className="enterprise-add-category-form-model"
            onSubmit={(e) => {
              e.preventDefault();
              editCategoryId !== null ? handleUpdate() : handleSaveCategory();
            }}
          >
            <InputLabel className="enterprise-add-category-label">Category Name</InputLabel>
            <TextField
              variant="outlined"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter Category"
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className="enterprise-add-category-save-button"
              disabled={loading || !categoryName.trim()}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : editCategoryId !== null ? (
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

export default AdminEnterpriseCategory;
