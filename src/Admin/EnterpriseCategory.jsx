import { Box, Typography, TextField, Modal, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, InputLabel } from '@mui/material';
import React, { useContext, useState } from 'react';
import 'react-tagsinput/react-tagsinput.css'; // Import the CSS
import { Context } from '../App';
import AdminDashboard from './AdminDashboard';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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

    const [dummyData, setDummyData] = useState([
        {
            id: 1,
            categoryName: 'category 1',
        },
        {
            id: 2,
            categoryName: 'category 2',
        },
        // Add more dummy data as needed
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [editCategoryId, setEditCategoryId] = useState(null);

    const handleEditDepartment = (id) => {
        const category = dummyData.find((category) => category.id === id);
        setCategoryName(category.categoryName);
        setEditCategoryId(id);
        setIsModalOpen(true);
    };

    const handleDeleteDepartment = (id) => {
        // Delete the category
        // const updatedData = dummyData.filter((category) => category.id !== id);
        // Update your state or API here
    };

    const handleSaveCategory = () => {
        if (editCategoryId !== null) {
            // Update the category
            const updatedData = dummyData.map((category) => {
                if (category.id === editCategoryId) {
                    return { ...category, categoryName };
                }
                return category;
            });
            // Update your state or API here
            setDummyData(updatedData); // Update the state
        } else {
            // Add a new category
            const newCategory = {
                id: dummyData.length + 1,
                categoryName,
            };
            const updatedData = [...dummyData, newCategory];
            // Update your state or API here
            setDummyData(updatedData); // Update the state
        }
        setIsModalOpen(false);
        setCategoryName(''); // Clear the category name input
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
                        <IconButton color="secondary" size="small" style={{ color: "#fff", padding: "5px" }} onClick={() => setIsModalOpen(true)}>
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
                                {dummyData.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell style={styles.cell}>{row.categoryName}</TableCell>
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