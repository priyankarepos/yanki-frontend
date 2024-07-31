import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputLabel,
  useMediaQuery,
  TextField,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import "react-tagsinput/react-tagsinput.css";
import { Context } from "../App";
import AdminDashboard from "./AdminDashboard";
import { FormControl, Select, MenuItem } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import axios from "axios";
import { Pagination, CircularProgress } from "@mui/material";
import "./AdminStyle.css";
import ConfirmDialog from "../EnterpriseCollabration/ConfirmDialog";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { agentChatResponse } from "../Utils/stringConstant/AgentChatResponse";
import { classNames } from "../Utils/stringConstant/stringConstant";
import { apiUrls } from "../Utils/stringConstant/AdminString";

const AdminEnterpriseRequest = () => {
  const { drawerOpen } = useContext(Context);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [enterpriseCategories, setEnterpriseCategories] = useState([]);
  const [enterpriseRequests, setEnterpriseRequests] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingRows, setLoadingRows] = useState([]);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [enterpriseIdToDelete, setEnterpriseIdToDelete] = useState(null);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [query, setQuery] = useState("");
  const [loadingData, setLoadingData] = useState(false);

  const openSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    const fetchEnterpriseCategories = async () => {
      try {
        const response = await axios.get(apiUrls.getEnterprisesCategories);

        if (response.status === 200) {
          setEnterpriseCategories(response.data);
        } else {
          setSnackbarMessage("Failed to fetch enterprise categories");
          setSnackbarOpen(true);
        }
      } catch (error) {
        setSnackbarMessage("Error:", error);
        setSnackbarOpen(true);
      } finally {
        setLoadingData(false);
      }
    };

    const fetchEnterpriseRequests = async () => {
      try {
        const categoryIdParam = selectedCategory || null;

        const response = await axios.get(apiUrls.getEnterprisesRequests, {
          params: {
            categoryId: categoryIdParam,
            enterpriseName: query,
            pageNumber: pageNumber,
            pageSize: 10,
          },
        });

        if (response.status === 200) {
          setEnterpriseRequests(response.data);
          setTotalPages(Math.ceil(response.data.totalCount / 10));
        } else {
          setSnackbarMessage("Failed to fetch enterprise requests");
          setSnackbarOpen(true);
        }
      } catch (error) {
        setSnackbarMessage("Error:", error);
        setSnackbarOpen(true);
      }
    };

    fetchEnterpriseCategories();
    fetchEnterpriseRequests();
  }, [selectedCategory, pageNumber, query]);

  const handlePageChange = (event, newPage) => {
    setPageNumber(newPage);
  };

  const handleApprove = async (enterpriseId, userId, enterpriseName) => {
    try {
      const updatedLoadingRows = [...loadingRows, enterpriseId];
      setLoadingRows(updatedLoadingRows);

      const response = await axios.post(
        apiUrls.approveRejectEnterprisesRequests(userId, enterpriseId, "approve")
      );

      if (response.status === 200) {
        const updatedRequests = enterpriseRequests.data.map((row) =>
          row.enterpriseId === enterpriseId
            ? { ...row, status: "Approved" }
            : row
        );
        setEnterpriseRequests({ ...enterpriseRequests, data: updatedRequests });

        openSnackbar(
          `Enterprise ${enterpriseName} approved successfully`,
          "success"
        );
      } else {
        openSnackbar("Failed to approve enterprise request", "error");
      }
    } catch (error) {
      setSnackbarMessage("Error:", error);
      setSnackbarOpen(true);
    } finally {
      const updatedLoadingRows = loadingRows.filter(
        (rowId) => rowId !== enterpriseId
      );
      setLoadingRows(updatedLoadingRows);
    }
  };

  const handleReject = async (enterpriseId, userId, enterpriseName) => {
    try {
      const updatedLoadingRows = [...loadingRows, enterpriseId];
      setLoadingRows(updatedLoadingRows);

      const response = await axios.post(
        apiUrls.approveRejectEnterprisesRequests(userId, enterpriseId, "reject")
      );

      if (response.status === 200) {
        const updatedRequests = enterpriseRequests.data.map((row) =>
          row.enterpriseId === enterpriseId
            ? { ...row, status: "Rejected" }
            : row
        );
        setEnterpriseRequests({ ...enterpriseRequests, data: updatedRequests });

        openSnackbar(
          `Enterprise ${enterpriseName} rejected successfully`,
          "success"
        );
      } else {
        openSnackbar("Failed to reject enterprise request", "error");
      }
    } catch (error) {
      setSnackbarMessage("Error:", error);
      setSnackbarOpen(true);
    } finally {
      const updatedLoadingRows = loadingRows.filter(
        (rowId) => rowId !== enterpriseId
      );
      setLoadingRows(updatedLoadingRows);
    }
  };

  const handleDeleteClick = (enterpriseId, userId, enterpriseName) => {
    setConfirmationText(`Are you sure you want to delete this event`);
    setConfirmDialogOpen(true);
    setEnterpriseIdToDelete(enterpriseId);
    setUserIdToDelete(userId);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(
        apiUrls.deleteEnterprise(userIdToDelete, enterpriseIdToDelete)
      );

      if (response.status === 200) {
        const updatedRequests = enterpriseRequests.data.filter(
          (row) => row.enterpriseId !== enterpriseIdToDelete
        );
        setEnterpriseRequests({ ...enterpriseRequests, data: updatedRequests });

        openSnackbar(`Request deleted successfully`, "success");
      } else {
        openSnackbar("Failed to delete the request", "error");
      }
    } catch (error) {
      setSnackbarMessage("Error:", error);
      setSnackbarOpen(true);
    } finally {
      setConfirmDialogOpen(false);
    }
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return (
    <Box className="enterprise-request-container">
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <SnackbarContent
          message={snackbarMessage}
          style={{
            backgroundColor:
              snackbarSeverity === "success" ? "#2862953" : "#286295",
          }}
        />
      </Snackbar>
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
        className={agentChatResponse.enterpriseFormBox}
        sx={{
          width: drawerOpen
            ? agentChatResponse.drawerOpenCalcWidth
            : agentChatResponse.hundredWidth, transition: agentChatResponse.transitionStyle,
        }}
      >
        <Box className="enterprise-content">
          <Box className="enterprise-request-header">
            
            <Typography variant="h6" sx={{ pb: 2 }}>
              Enterprise Request
            </Typography>

            <TextField
              variant="outlined"
              placeholder="Search Enterprise"
              value={query}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box className="marginBottom-25">
            <InputLabel className="enterprise-input-lable">
              Select Category
            </InputLabel>
            <FormControl
              fullWidth
              sx={{
                width: { xs: "100%", md: "100%" },
              }}
            >
              <Select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                displayEmpty
                className="EnterpriseCategorySelect marginBottom-10"
              >
                <MenuItem value="">Select an Enterprise Category</MenuItem>
                {enterpriseCategories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <TableContainer
            component={Paper}
            className="enterprise-request-table marginBottom-0"
          >
            {loadingData ? (
              <div className={classNames.noDataFoundClass}>
                <CircularProgress />
              </div>) : (<Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="enterprise-headerCell">
                      Enterprise Name
                    </TableCell>
                    <TableCell className="enterprise-headerCell">Email</TableCell>
                    <TableCell className="enterprise-headerCell">
                      Phone Number
                    </TableCell>
                    <TableCell className="enterprise-headerCell">
                      Contact Person
                    </TableCell>
                    <TableCell className="enterprise-headerCell">
                      Request Date
                    </TableCell>
                    <TableCell className="enterprise-headerCell">
                      Status
                    </TableCell>
                    <TableCell className="enterprise-headerCell text-center">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {enterpriseRequests && enterpriseRequests.data ? (
                    enterpriseRequests.data.map((row) => (
                      <TableRow key={row.enterpriseId}>
                        <TableCell className="enterprise-cell">
                          {row.enterpriseName}
                        </TableCell>
                        <TableCell className="enterprise-cell">
                          {row.email}
                        </TableCell>
                        <TableCell className="enterprise-cell">
                          {row.phoneNumber}
                        </TableCell>
                        <TableCell className="enterprise-cell">
                          {row.contactPersonName}
                        </TableCell>
                        <TableCell className="enterprise-cell">
                          {" "}
                          {new Date(row.requestDate).toLocaleDateString("en-GB")}
                        </TableCell>
                        <TableCell className="enterprise-cell">
                          {row.status}
                        </TableCell>
                        <TableCell>
                          <div className="enterprise-cell-button-container">
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              className="enterprise-cell-button"
                              disabled={
                                loadingRows.includes(row.enterpriseId) ||
                                row.status === "Approved"
                              }
                              onClick={() => {
                                setIsApproving(true);
                                handleApprove(
                                  row.enterpriseId,
                                  row.userId,
                                  row.enterpriseName
                                );
                              }}
                            >
                              {isApproving &&
                                loadingRows.includes(row.enterpriseId) ? (
                                <CircularProgress size={24} />
                              ) : (
                                "Approve"
                              )}
                            </Button>
                            <Button
                              variant="contained"
                              color="secondary"
                              size="small"
                              className="enterprise-cell-button"
                              disabled={
                                loadingRows.includes(row.enterpriseId) ||
                                row.status === "Rejected"
                              }
                              onClick={async () => {
                                setIsRejecting(true);
                                await handleReject(
                                  row.enterpriseId,
                                  row.userId,
                                  row.enterpriseName
                                );
                                setIsRejecting(false);
                              }}
                            >
                              {isRejecting &&
                                loadingRows.includes(row.enterpriseId) ? (
                                <CircularProgress size={24} />
                              ) : (
                                "Reject"
                              )}
                            </Button>
                            {row.status === "Rejected" && (
                              <Button
                                variant="contained"
                                color="secondary"
                                size="small"
                                className="enterprise-cell-button"
                                disabled={loadingRows.includes(row.enterpriseId)}
                                onClick={() =>
                                  handleDeleteClick(
                                    row.enterpriseId,
                                    row.userId,
                                    row.enterpriseName
                                  )
                                }
                              >
                                Delete
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8}>
                        {selectedCategory
                          ? "Loading or no data available"
                          : "Please select a category"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>)}
            {totalPages > 1 && (
              <Pagination
                count={totalPages}
                page={pageNumber}
                onChange={handlePageChange}
                color="primary"
                className="enterprise-pagination"
              />
            )}
          </TableContainer>
        </Box>
      </Box>
      <ConfirmDialog
        open={confirmDialogOpen}
        handleClose={() => setConfirmDialogOpen(false)}
        handleConfirm={handleConfirmDelete}
        confirmationText={confirmationText}
      />
    </Box >
  );
};

export default AdminEnterpriseRequest;
