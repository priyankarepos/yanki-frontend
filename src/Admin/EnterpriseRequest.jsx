import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useContext } from 'react';
import 'react-tagsinput/react-tagsinput.css'; // Import the CSS
import { Context } from '../App';
import AdminDashboard from './AdminDashboard';

const styles = {
    tableContainer: {
        marginBottom: '0',
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
};

const AdminEnterpriseRequest = () => {
    const { drawerOpen } = useContext(Context);

    const dummyData = [
        {
            id: 1,
            enterpriseName: 'Enterprise 1',
            email: 'enterprise1@example.com',
            phoneNumber: '123-456-7890',
            ownerName: 'Owner 1',
            website: 'https://enterprise1.com',
            requestDate: '2023-01-15',
            status: 'Pending',
        },
        {
            id: 2,
            enterpriseName: 'Enterprise 2',
            email: 'enterprise2@example.com',
            phoneNumber: '987-654-3210',
            ownerName: 'Owner 2',
            website: 'https://enterprise2.com',
            requestDate: '2023-01-20',
            status: 'Approved',
        },
        // Add more dummy data as needed
    ];

    const handleApprove = (id) => {
        // Add logic to approve the enterprise request with the given ID
    };

    const handleReject = (id) => {
    };


    const contentMargin = drawerOpen ? '0' : '0';

    return (
        <Box style={{ display: "flex" }}>
            <Box sx={{ width: drawerOpen ? '270px' : "0" }}><AdminDashboard /></Box>
            <Box style={{ ...styles.content, marginLeft: contentMargin }} className="enterpriseFormBox" sx={{ width: drawerOpen ? 'calc(100% - 270px)' : "100%", marginTop: '70px', padding: '16px' }}>
                <Box style={{ ...styles.content, marginLeft: contentMargin }}>
                    <Typography variant="h6" sx={{ pb: 2 }}>Enterprise Request</Typography>
                    <TableContainer component={Paper} style={styles.tableContainer}>
                        <Table style={styles.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={styles.headerCell}>Enterprise Name</TableCell>
                                    <TableCell style={styles.headerCell}>Email</TableCell>
                                    <TableCell style={styles.headerCell}>Phone Number</TableCell>
                                    <TableCell style={styles.headerCell}>Owner Name</TableCell>
                                    <TableCell style={styles.headerCell}>Website</TableCell>
                                    <TableCell style={styles.headerCell}>Request Date</TableCell>
                                    <TableCell style={styles.headerCell}>Status</TableCell>
                                    <TableCell style={{...styles.headerCell, textAlign: "center",}}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dummyData.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell style={styles.cell}>{row.enterpriseName}</TableCell>
                                        <TableCell style={styles.cell}>{row.email}</TableCell>
                                        <TableCell style={styles.cell}>{row.phoneNumber}</TableCell>
                                        <TableCell style={styles.cell}>{row.ownerName}</TableCell>
                                        <TableCell style={styles.cell}>
                                            <a href={row.website} style={{color: "#fff",}}>
                                                {row.website}
                                            </a>
                                        </TableCell>
                                        <TableCell style={styles.cell}>{row.requestDate}</TableCell>
                                        <TableCell style={styles.cell}>{row.status}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                style={styles.approveButton}
                                                onClick={() => handleApprove(row.id)}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                size="small"
                                                style={styles.approveButton}
                                                onClick={() => handleReject(row.id)}
                                            >
                                                Reject
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </Box >
    )
}

export default AdminEnterpriseRequest