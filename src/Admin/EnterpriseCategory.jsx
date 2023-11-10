import { Box, Typography, TextField, Modal, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, InputLabel } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import 'react-tagsinput/react-tagsinput.css'; // Import the CSS
import { Context } from '../App';
import AdminDashboard from './AdminDashboard';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

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
    console.log("enterpriseCategories", enterpriseCategories);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [editCategoryId, setEditCategoryId] = useState(null);
    const [isDataFetched, setIsDataFetched] = useState(false);

    const handleEditDepartment = (id) => {
        const category = enterpriseCategories.find((category) => category.id === id);
        setCategoryName(category.categoryName);
        setEditCategoryId(id);
        setIsModalOpen(true);
    };

    const handleDeleteDepartment = async (id) => {
        try {
            // Delete the category
            const response = await axios.delete(
                `${process.env.REACT_APP_API_HOST}/api/yanki-ai/delete-enterprise-category/${id}`
            );

            if (response.status === 200) {
                const updatedCategories = enterpriseCategories.filter((category) => category.id !== id);
                setEnterpriseCategories(updatedCategories);
            } else {
                console.error('Failed to delete enterprise category');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleAddCategory = async () => {
        setIsModalOpen(true)
        try {
            // Call the API to add a new category
            const response = await axios.post(
                `${process.env.REACT_APP_API_HOST}/api/yanki-ai/add-enterprise-category`,
                { name: categoryName }
            );

            if (response.status === 200) {
                // Update the state with the new category
                const newCategory = response.data;
                setEnterpriseCategories([...enterpriseCategories, newCategory]);
                setIsModalOpen(false);
                setCategoryName('');
            } else {
                console.error('Failed to add enterprise category');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        const fetchEnterpriseCategories = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_HOST}/api/yanki-ai/get-enterprises-categories`
                );

                if (response.status === 200) {
                    setEnterpriseCategories(response.data);
                } else {
                    console.error('Failed to fetch enterprise categories');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchEnterpriseCategories();
    }, []);

    const handleSaveCategory = async () => {
        try {
            if (editCategoryId !== null) {
                // Update the category
                const response = await axios.put(
                    `${process.env.REACT_APP_API_HOST}/api/yanki-ai/update-enterprise-category/${editCategoryId}`,
                    { categoryName }
                );
    
                if (response.status === 200) {
                    const updatedCategories = enterpriseCategories.map((category) => {
                        if (category.id === editCategoryId) {
                            return { ...category, categoryName };
                        }
                        return category;
                    });
                    setEnterpriseCategories(updatedCategories);
                } else {
                    console.error('Failed to update enterprise category');
                }
            } else {
                // Add a new category
                const response = await axios.post(
                    `${process.env.REACT_APP_API_HOST}/api/yanki-ai/add-enterprise-category`,
                    { name: categoryName }
                );
    
                if (response.status === 200) {
                    const newCategory = response.data;
                    setEnterpriseCategories([...enterpriseCategories, newCategory]);
                } else {
                    console.error('Failed to add enterprise category');
                }
            }
            setIsModalOpen(false);
            setCategoryName(''); // Clear the category name input
    
            // Fetch updated categories after the save button is clicked
            const updatedResponse = await axios.get(
                `${process.env.REACT_APP_API_HOST}/api/yanki-ai/get-enterprises-categories`
            );
    
            if (updatedResponse.status === 200) {
                setEnterpriseCategories(updatedResponse.data);
            } else {
                console.error('Failed to fetch updated enterprise categories');
            }
        } catch (error) {
            console.error('Error:', error);
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
                                            <IconButton onClick={() => handleEditDepartment(row.id)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteDepartment(row.id)}>
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
                        {editCategoryId !== null ? "Edit Enterprise Categories" : "Add Enterprise Categories"}
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
                            onClick={handleSaveCategory}
                            style={styles.modalButton}
                        >
                            {editCategoryId !== null ? "Save Changes" : "Save & Add"}
                        </Button>
                    </form>
                </Box>
            </Modal>
        </Box >
    )
}

export default AdminEnterpriseCategory