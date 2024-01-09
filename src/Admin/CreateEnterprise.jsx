import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, TextField, Modal, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, InputLabel, Snackbar,CircularProgress, useMediaQuery } from '@mui/material';
import AdminDashboard from './AdminDashboard';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { Context } from '../App';
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

const AdminCreateEnterprise = () => {
  const { drawerOpen } = useContext(Context);

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const contentMargin = drawerOpen ? '0' : '0';

  return (
    <Box style={{ display: "flex" }}>
      <Box sx={{ width: drawerOpen && !isSmallScreen ? '270px' : "0" }}><AdminDashboard /></Box>
      <Box style={{ ...styles.content, marginLeft: contentMargin }} className="enterpriseFormBox" sx={{ width: drawerOpen ? 'calc(100% - 270px)' : "100%", marginTop: '70px', padding: '16px' }}>
      </Box>
    </Box>
  )
}

export default AdminCreateEnterprise;
