import {
  Box,
  Typography,
  Grid,
  TextField,
  InputLabel,
  Divider,
  Button,
  Table,
  Snackbar,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  FormHelperText,
  useMediaQuery,
  Modal,
  CircularProgress,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { useForm, Controller, useWatch } from "react-hook-form";
import "react-tagsinput/react-tagsinput.css";
import TagsInput from "react-tagsinput";
import { Context } from "../App";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import "../EnterpriseCollabration/EnterpriseStyle.scss";
import { emailRegex } from "../Utils/validations/validation";
import AdminDashboard from "./AdminDashboard";
import ConfirmDialog from "../EnterpriseCollabration/ConfirmDialog";
import "../EnterpriseCollabration/EnterpriseStyle.scss";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import { pdfjs } from "react-pdf";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { agentChatResponse } from "../Utils/stringConstant/AgentChatResponse";
import { apiUrls, className, message } from "../Utils/stringConstant/AdminString";
import { headers } from "../Utils/stringConstant/stringConstant";

const AdminCreateDepartment = () => {
  const { drawerOpen } = useContext(Context);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedDepartmentData, setSelectedDepartmentData] = useState({});
  const [departmentID, setDepartmentID] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [triggerEffect, setTriggerEffect] = useState(false);
  const [tagCount, setTagCount] = useState(0);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedDepartmentIndex, setSelectedDepartmentIndex] = useState(null);
  const [confirmationText, setConfirmationText] = useState("");
  const [enterpriseList, setEnterpriseList] = useState({});
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadCertificateModalOpen, setIsUploadCertificateModalOpen] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [certificateDetails, setCertificateDetails] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfLoadError, setPdfLoadError] = useState(false);
  const [pdfName, setPdfName] = useState("");
  const [actionType, setActionType] = useState("");

  const handleSelectChange = (event) => {
    setSelectedEnterpriseId(event.target.value);
  };

  useEffect(() => {
    const getEnterpriseDetails = async () => {
      try {
        const response = await axios.get(apiUrls.getEnterpriseAllDetails);

        if (response.status === 200) {
          const responseData = response.data;
          setEnterpriseList(responseData);
        } else {
          setSnackbarMessage("Failed to fetch enterprise details");
          setSnackbarOpen(true);
        }
      } catch (error) {
        setSnackbarMessage("Error fetching enterprise details:", error);
        setSnackbarOpen(true);
      }
    };

    getEnterpriseDetails();
  }, []);

  const {
    control: departmentControl,
    handleSubmit: handleDepartmentSubmit,
    setValue: setDepartmentValue,
    getValues: getDepartmentValues,
    reset: resetDepartmentForm,
    setFocus: setFocusDepartmentForm,
    formState: { errors: departmentErrors, isSubmitted: isDepartmentSubmitted },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      DepartmentName: selectedDepartmentData?.departmentName || "",
      NameOfRepresentative: selectedDepartmentData?.departmentHeadName || "",
      EmailAddress: selectedDepartmentData?.departmentEmail || "",
      DepartmentDescription:
        selectedDepartmentData?.departmentDescription || "",
      DepartmentIdentificationKeywords:
        selectedDepartmentData?.departmentKeywords || [],
    },
    criteriaMode: "all",
  });

  const {
    control: uploadControl,
    handleSubmit: handleUploadSubmit,
    setValue: setUploadValue,
    trigger: triggerUpload,
    reset: resetUploadForm,
    formState: { errors: uploadErrors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      file: null,
      keywords: "",
    },
  });

  const {
    control: certificateControl,
    handleSubmit: handleCertificateSubmit,
    setValue: setCertificateValue,
    trigger: triggerCertificate,
    reset: resetCertificateForm,
    formState: { errors: certificateErrors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      file: null,
      keywords: "",
    },
  });

  const keywords = useWatch({
    control: departmentControl,
    name: "DepartmentIdentificationKeywords",
    defaultValue: [],
  });

  useEffect(() => {
    const firstErrorField = Object.keys(departmentErrors)[0];    
    if(firstErrorField) {
      setFocusDepartmentForm(firstErrorField);      
    }
  }, [departmentErrors, isDepartmentSubmitted, setFocusDepartmentForm])

  const checkEnterpriseKeyword = async (tag, enterpriseId) => {
    try {
      const response = await axios.get(
        apiUrls.checkEnterpriseKeyword(selectedEnterpriseId, tag)
      );
      setSnackbarMessage("Keyword Check Response:", response.data);
      setSnackbarOpen(true);

      if (response.status === 200) {
        const keywordExists = response.data.exists;
        if (keywordExists !== undefined) {
          if (keywordExists) {
            setSnackbarMessage("Keyword already exists:", tag);
            setSnackbarOpen(true);
          } else {
            setTags((prevTags) => [...prevTags, tag]);
          }
        } else {
          setSnackbarMessage("Keyword existence is undefined for:", tag);
          setSnackbarOpen(false);
        }
      } else {
        setSnackbarMessage("Failed to check enterprise keyword");
        setSnackbarOpen(false);
      }
      return response.data;
    } catch (error) {
      setSnackbarMessage("Error checking enterprise keyword:", error);
      setSnackbarOpen(true);
      return { isSuccess: false };
    }
  };

  const handleAddTag = async (tag) => {
    try {
      if (tagCount >= 25) {
        setSnackbarMessage("You have reached the maximum limit of tags (25).");
        setSnackbarOpen(true);
        return;
      }

      // Check if the tag length exceeds 20 characters
      if (tag.length > 40) {
        setSnackbarMessage("Tag should not exceed 40 characters.");
        setSnackbarOpen(true);
        return;
      }

      const lowerCaseTag = tag.toLowerCase();

      if (
        tags
          .map((existingTag) => existingTag.toLowerCase())
          .includes(lowerCaseTag)
      ) {
        setSnackbarMessage(`Tag "${tag}" already exists.`);
        setSnackbarOpen(true);
        return;
      }

      const response = await checkEnterpriseKeyword(tag);

      if (response && response.isSuccess) {
        setTagCount(tagCount + 1);
        if (response.isAvailable) {
          setTags((prevTags) => {
            const uniqueTags = new Set([...prevTags, tag]);
            return [...uniqueTags];
          });
        } else {
          setSnackbarMessage(
            `Tag "${tag}" is not available in this enterprise.`
          );
          setSnackbarOpen(true);
        }
      } else {
        setSnackbarMessage("Failed to check enterprise keyword");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("Error handling tag:", error);
      setSnackbarOpen(true);
    }
  };

  const handleRemoveTag = (tag) => {
    if (tags.length === 1) {
      setSnackbarMessage("At least one tag is required.");
      setSnackbarOpen(true);
      return;
    }

    const updatedTags = tags.filter((t) => t !== tag);
    setTags(updatedTags);
    setTagCount(updatedTags.length);
  };

  useEffect(() => {
    setTagCount(tags.length);
  }, [tags]);

  const [departmentsData, setDepartmentsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          apiUrls.getEnterpriseDepartments(selectedEnterpriseId)
        );

        if (response.status === 200) {
          setDepartmentsData(response.data);
        } else {
          setSnackbarMessage(
            "Failed to fetch departments:",
            response.statusText
          );
          setSnackbarOpen(true);
        }
      } catch (error) {
        setSnackbarMessage(
          "Error occurred while fetching departments:",
          error.message
        );
        setSnackbarOpen(false);
      }
    };

    fetchData();
  }, [triggerEffect, selectedEnterpriseId]);

  const handleEditDepartment = async (index, departmentId) => {
    const department = departmentsData[index];
    setDepartmentID(departmentId);
    setSelectedDepartmentData(department);

    if (selectedDepartmentData) {
      setDepartmentValue("DepartmentName", department.departmentName || "");
      setDepartmentValue(
        "NameOfRepresentative",
        department.departmentHeadName || ""
      );
      setDepartmentValue("EmailAddress", department.departmentEmail || "");
      setDepartmentValue(
        "DepartmentDescription",
        department.departmentDescription || ""
      );
      const keywordsArray = department.departmentKeywords.split(",");
      setTags(keywordsArray);
      setDepartmentValue(
        "DepartmentIdentificationKeywords",
        keywordsArray || []
      );
    }
  };

  const handleDeleteDepartment = (index, departmentId) => {
    setActionType("deleteDepartment");
    setConfirmDialogOpen(true);
    setSelectedDepartmentIndex(index);
    setConfirmationText(
      `Are you sure you want to delete the department "${departmentsData[index].departmentName}"?`
    );
  };

  const handleDelete = (pdfName) => {
    setActionType("deleteFile");
    setPdfName(pdfName);
    setConfirmDialogOpen(true);
    setConfirmationText(`Are you sure you want to delete this file?`);
  };

  const handleCertificateDelete = (pdfName) => {
    setActionType("deleteCertificate");
    setPdfName(pdfName);
    setConfirmDialogOpen(true);
    setConfirmationText(`Are you sure you want to delete this Certificate?`);
  };

  const handleConfirmation = async () => {
    setLoading(true);
    try {
      setConfirmDialogOpen(false);
      if (actionType === "deleteDepartment") {
        await deleteDepartment();
      } else if (actionType === "deleteFile") {
        await deleteFile();
      } else if (actionType === "deleteCertificate") {
        await deleteCertificate();
      }
    } catch (error) {
      setSnackbarMessage("Error during deletion:", error);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const deleteDepartment = async () => {
    const { departmentId } = departmentsData[selectedDepartmentIndex];
    try {
      const response = await axios.delete(
        apiUrls.deleteEnterpriseDepartments(departmentId)
      );

      if (response.status === 200) {
        setSnackbarMessage("Department deleted successfully");
        setSnackbarOpen(true);
        const updatedDepartments = [...departmentsData];
        updatedDepartments.splice(selectedDepartmentIndex, 1);
        setDepartmentsData(updatedDepartments);
      } else {
        setSnackbarMessage("Failed to delete department:");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("Error deleting department:", error.message);
      setSnackbarOpen(true);
    }
  };

  const deleteFile = async () => {
    const rowIndex = tableData.findIndex(
      (row) => row.pdfUrl.split("/").pop() === pdfName
    );

    if (rowIndex !== -1) {
      try {
        setLoading(true);
        const response = await axios.delete(
          apiUrls.deleteAdminDocument(pdfName)
        );

        if (response.status === 200) {
          const updatedTableData = [...tableData];
          updatedTableData.splice(rowIndex, 1);
          setTableData(updatedTableData);
          setConfirmDialogOpen(false);
          setSnackbarMessage(
            `Document with Name ${pdfName} deleted successfully`
          );
          setSnackbarOpen(true);
        } else {
          setSnackbarMessage(
            `Failed to delete document: ${response.status}, ${response.data.message}`
          );
          setSnackbarOpen(true);
        }
      } catch (error) {
        setSnackbarMessage(`Error deleting document: ${error.message}`);
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const deleteCertificate = async () => {
    const rowIndex = certificateDetails.findIndex(
      (row) => row.pdfUrl.split("/").pop() === pdfName
    );

    if (rowIndex !== -1) {
      try {
        setLoading(true);
        const response = await axios.delete(
          apiUrls.deleteAdminDocument(pdfName)
        );

        if (response.status === 200) {
          const updatedTableData = [...certificateDetails];
          updatedTableData.splice(rowIndex, 1);
          setCertificateDetails(updatedTableData);
          setConfirmDialogOpen(false);
          setSnackbarMessage(
            `Document with Name ${pdfName} deleted successfully`
          );
          setSnackbarOpen(true);
        } else {
          setSnackbarMessage(
            `Failed to delete document: ${response.status}, ${response.data.message}`
          );
          setSnackbarOpen(true);
        }
      } catch (error) {
        setSnackbarMessage(`Error deleting document: ${error.message}`);
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveDepartment = async (data) => {
    const formData = getDepartmentValues();
    if (tags.length === 0) {
      setSnackbarMessage("At least one tag is required.");
      setSnackbarOpen(true);
      return;
    }
    const isDuplicate = departmentsData.some(
      (department) =>
        department.departmentName.toLowerCase() ===
          formData.DepartmentName.toLowerCase() &&
        department.departmentId !== selectedDepartmentData?.departmentId
    );
    if (isDuplicate) {
      setSnackbarMessage("The department you are adding already exists.");
      setSnackbarOpen(true);
      return;
    }
    try {
      const tagsAsString = tags.join(",");
      const payload = {
        departmentId: selectedDepartmentData?.departmentId,
        departmentName: formData.DepartmentName,
        departmentHeadName: formData.NameOfRepresentative,
        departmentEmail: formData.EmailAddress,
        departmentDescription: formData.DepartmentDescription,
        departmentKeywords: tagsAsString,
        enterpriseId: selectedEnterpriseId,
      };

      const response = await axios.put(
        apiUrls.updateEnterpriseDepartment,
        payload
      );
      setTriggerEffect((prev) => !prev);
      if (response.status === 200) {
        setSnackbarOpen(true);
        setSnackbarMessage("Department details updated successfully");
        resetDepartmentForm();
        setSelectedDepartmentData({});
        setDepartmentsData([]);
        setTags([]);
        setDepartmentID(null);
      } else {
        setSnackbarMessage(
          `Failed to update Department details. Status: ${response.status}`
        );
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("Error updating Department details:", error.message);
      setSnackbarOpen(true);
    }
    setSelectedDepartmentData("");
  };

  const onSubmit = async (data) => {
    const isDuplicate = departmentsData.some(
      (department) =>
        department.departmentName.toLowerCase() ===
        data.DepartmentName.toLowerCase()
    );

    if (isDuplicate) {
      setSnackbarMessage("The department you are adding already exists.");
      setSnackbarOpen(true);
      return;
    }
    
    if (tags.length === 0) return;

    try {
      const tagsAsString = tags.join(",");
      const requestBody = {
        departmentId: data.DepartmentId,
        departmentName: data.DepartmentName,
        departmentHeadName: data.NameOfRepresentative,
        departmentEmail: data.EmailAddress,
        departmentDescription: data.DepartmentDescription,
        departmentKeywords: tagsAsString,
        enterpriseId: selectedEnterpriseId,
      };

      const response = await axios.post(
        apiUrls.addEnterpriseDepartment,
        requestBody
      );

      if (response.status === 200) {
        const result = response.data;
        setDepartmentsData([...departmentsData, result]);
        setTags([]);
        setSnackbarMessage("Department added successfully,");
        setSnackbarOpen(true);
        resetDepartmentForm();
        setDepartmentValue("DepartmentName", "");
        setDepartmentValue("NameOfRepresentative", "");
        setDepartmentValue("EmailAddress", "");
        setDepartmentValue("DepartmentDescription", "");
        setDepartmentValue("DepartmentIdentificationKeywords", []);
      } else {
        setSnackbarMessage("API error: " + response.statusText);
        setSnackbarOpen(true);
      }
      setTriggerEffect((prev) => !prev);
    } catch (error) {
      setSnackbarMessage("Error occurred while fetching API:", error.message);
      setSnackbarOpen(true);
    }
  };

  const validateFile = (value) => {
    if (!value || value.length === 0) {
      return "File is required";
    }
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(value[0].type)) {
      return "Please select a valid file (PDF, JPG, or PNG)";
    }

    return true;
  };

  const onSubmitFile = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append(message.file, data.file[0]);

      const response = await axios.post(
        apiUrls.adminUploadDocument(selectedEnterpriseId, false),
        formData,
        {
          headers: headers
        }
      );

      if (response.status === 200) {
        setSnackbarMessage(
          `Document with Name ${data.file[0].name} added successfully`
        );
        setSnackbarOpen(true);
        setIsModalOpen(false);
        resetUploadForm();
        setTableData((prevTableData) => [
          ...prevTableData,
          {
            id: prevTableData.length + 1,
            pdfUrl: response.data.data,
          },
        ]);
      } else {
        setSnackbarMessage("Failed to upload the file");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("An error occurred while uploading the file.");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitCertificate = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append(message.file, data.file[0]);

      const response = await axios.post(
        apiUrls.adminUploadDocument(selectedEnterpriseId, true),
        formData,
        {
          headers: headers
        }
      );

      if (response.status === 200) {
        setSnackbarMessage(
          `Document with Name ${data.file[0].name} added successfully`
        );
        setSnackbarOpen(true);
        setIsUploadCertificateModalOpen(false);
        resetCertificateForm();
        setCertificateDetails((prevTableData) => [
          ...prevTableData,
          {
            id: prevTableData.length + 1,
            pdfUrl: response.data.data,
          },
        ]);
      } else {
        setSnackbarMessage("Failed to upload the file");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("An error occurred while uploading the file.");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const isLargeScreen = useMediaQuery("(min-width: 600px)");

  useEffect(() => {
    const fetchData = async () => {
      setTableData([]);
      try {
        const response = await axios.get(
          getEnterpriseDocument(selectedEnterpriseId)
        );

        if (response.status === 200) {
          setTableData(
            response.data.map((pdfUrl, index) => ({ id: index + 1, pdfUrl }))
          );
        } else {
          setSnackbarMessage("Failed to fetch files:", response.statusText);
          setSnackbarOpen(true);
        }
      } catch (error) {
        setSnackbarMessage(
          "Error occurred while fetching files:",
          error.message
        );
        setSnackbarOpen(false);
      }
    };

    fetchData();
  }, [triggerEffect, selectedEnterpriseId]);

  useEffect(() => {
    const fetchData = async () => {
      setCertificateDetails([]);
      try {
        const response = await axios.get(
          apiUrls.getEnterpriseCertificate(selectedEnterpriseId)
        );

        if (response.status === 200) {
          setCertificateDetails(
            response.data.map((pdfUrl, index) => ({ id: index + 1, pdfUrl }))
          );
        } else {
          setSnackbarMessage(
            "Failed to fetch certificates:",
            response.statusText
          );
          setSnackbarOpen(true);
        }
      } catch (error) {
        setSnackbarMessage(
          "Error occurred while fetching certificates:",
          error.message
        );
        setSnackbarOpen(false);
      }
    };

    fetchData();
  }, [triggerEffect, selectedEnterpriseId]);

  const openPdfModal = (index) => {
    const selectedPdfData = tableData[index];
    setSelectedPdf(selectedPdfData);
    setPdfLoadError(false);
  };

  const openCertificateModal = (index) => {
    const selectedPdfData = certificateDetails[index];
    setSelectedPdf(selectedPdfData);
    setPdfLoadError(false);
  };

  const closePdfModal = () => {
    setSelectedPdf(null);
  };

  const renderPdfModal = () => {
    return (
      <Modal
        open={Boolean(selectedPdf)}
        onClose={closePdfModal}
        className="enterprise-profile-modal"
      >
        <div className="enterprise-profile-pdf-modal">
          <IconButton
            className="enterprise-profile-pdf-modal-icon-button"
            style={{ top: !isLargeScreen ? "40px" : "20px" }}
            onClick={closePdfModal}
            aria-label="close"
          >
            <CloseIcon className="enterprise-white-color" />
          </IconButton>
          {!pdfLoadError ? (
            selectedPdf?.pdfUrl.toLowerCase().endsWith(".pdf") ? (
              <Worker
                workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}
              >
                <Viewer fileUrl={selectedPdf?.pdfUrl} />
              </Worker>
            ) : (
              <img
                src={selectedPdf?.pdfUrl}
                alt=""
                className="enterprise-profile-image"
                onError={() => setPdfLoadError(true)}
              />
            )
          ) : (
            <div>Error loading content. Please try again.</div>
          )}
        </div>
      </Modal>
    );
  };

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        className={agentChatResponse.enterpriseContent}
        sx={{
          width: drawerOpen
            ? agentChatResponse.drawerOpenCalcWidth
            : agentChatResponse.hundredWidth,transition: agentChatResponse.transitionStyle,
        }}
      >
        <Box className="admin-faq-heading">
          <Typography variant="h6">Add Departments</Typography>
        </Box>

        <div className="marginBottom-20">
          <InputLabel className="enterprise-label">
            Select Enterprise<sup className="required-icon">*</sup>
          </InputLabel>
          <select
            id="enterpriseDropdown"
            onChange={handleSelectChange}
            value={selectedEnterpriseId}
          >
            <option value="">Please select enterprise to continue</option>
            {Array.isArray(enterpriseList) &&
              enterpriseList.map((enterprise) => (
                <option
                  key={enterprise.enterpriseId}
                  value={enterprise.enterpriseId}
                >
                  {enterprise.enterpriseName}
                </option>
              ))}
          </select>
        </div>
        <Grid container spacing={2} className="enterprise-profile">
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <InputLabel className="enterprise-label">
              Department<sup className="required-icon">*</sup>
            </InputLabel>
            <Controller
              control={departmentControl}
              name="DepartmentName"
              rules={{
                required: "Department name is required.",
                minLength: {
                  value: 2,
                  message:
                    "Department name should be at least 3 characters long.",
                },
                maxLength: {
                  value: 30,
                  message: "Department name should not exceed 30 characters.",
                },
              }}
              render={({ field : { ref, ...field } }) => (
                <div>
                  <TextField
                    className="admin-search-report-inputField"
                    {...field}
                    inputRef={ref}
                    type="outlined"
                    placeholder="Customer Service"
                    fullWidth
                    disabled={!selectedEnterpriseId}
                  />
                  {departmentErrors["DepartmentName"] && (
                    <FormHelperText className="error-message">
                      {departmentErrors["DepartmentName"].message}
                    </FormHelperText>
                  )}
                </div>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <InputLabel className="enterprise-label">
              Name of representative<sup className="required-icon">*</sup>
            </InputLabel>
            <Controller
              control={departmentControl}
              name="NameOfRepresentative"
              rules={{
                required: "Name of representative is required.",
                minLength: {
                  value: 3,
                  message:
                    "Name of representative should be at least 3 characters long.",
                },
                maxLength: {
                  value: 30,
                  message:
                    "Name of representative should not exceed 30 characters.",
                },
              }}
              render={({ field : { ref, ...field } }) => (
                <div>
                  <TextField
                    className="admin-search-report-inputField"
                    {...field}
                    inputRef={ref}
                    type="outlined"
                    placeholder="John Deo"
                    fullWidth
                    disabled={!selectedEnterpriseId}
                  />
                  {departmentErrors["NameOfRepresentative"] && (
                    <FormHelperText className="error-message">
                      {departmentErrors["NameOfRepresentative"].message}
                    </FormHelperText>
                  )}
                </div>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <InputLabel className="enterprise-label">
              Email Address<sup className="required-icon">*</sup>
            </InputLabel>
            <Controller
              control={departmentControl}
              name="EmailAddress"
              rules={{
                required: {
                  value: true,
                  message: "Email address is required.",
                },
                pattern: {
                  value: emailRegex,
                  message: "Enter valid email address.",
                },
              }}
              render={({ field : { ref, ...field } }) => (
                <div>
                  <TextField
                    className="admin-search-report-inputField"
                    {...field}
                    inputRef={ref}
                    type="outlined"
                    placeholder="Type email address here"
                    fullWidth
                    disabled={!selectedEnterpriseId}
                  />
                  {departmentErrors["EmailAddress"] && (
                    <FormHelperText className="error-message">
                      {departmentErrors["EmailAddress"].message}
                    </FormHelperText>
                  )}
                </div>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel className="enterprise-label">Description</InputLabel>
            <Controller
              control={departmentControl}
              name="DepartmentDescription"
              render={({ field }) => (
                <div>
                  <TextareaAutosize
                    className="TextareaAutosize"
                    {...field}
                    placeholder="Type description here"
                    onFocus={(e) => (e.target.style.outline = "none")}
                    onMouseOver={(e) =>
                      (e.target.style.backgroundColor = "none")
                    }
                    onMouseOut={(e) =>
                      (e.target.style.backgroundColor = "none")
                    }
                    disabled={!selectedEnterpriseId}
                  />
                </div>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel className="enterprise-label">
              Enterprise identification keywords
              <sup className="required-icon">*</sup>
            </InputLabel>
            <Controller
              control={departmentControl}
              name="DepartmentIdentificationKeywords"
              render={({ field }) => (
                <div>
                  <TagsInput
                    className="TagsInput"
                    value={tags}
                    onChange={(newTags) => setTags(newTags)}
                    addKeys={[13, 9]}
                    placeholder="Type Enterprise identification keywords here"
                    disabled={!selectedEnterpriseId}
                    inputProps={{
                      ...field,
                      value: tagInput,
                      ref: field.ref,
                      onChange: (e) => setTagInput(e.target.value),
                      onKeyDown: (e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          e.persist();
                          handleAddTag(e.target.value);
                          field.onChange("");
                          setTagInput("");
                        }
                      },
                    }}
                  />
                  <div className="enterprise-tags-container">
                    {tags?.map((tag, index) => (
                      <div
                        key={`${tag}-${index}`}
                        className="enterprise-tag"
                        style={{
                          backgroundColor:
                            tag === tagInput ? "#ff7070" : "#6fa8dd",
                        }}
                      >
                        <span className="marginRight-8">{tag}</span>
                        <span
                          className="cursor-pointer"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          &times;
                        </span>
                      </div>
                    ))}
                  </div>
                  {isDepartmentSubmitted &&
                    keywords.length === 0 &&
                    tags.length === 0 && (
                      <FormHelperText className="error-message">
                        At least one keyword is required
                      </FormHelperText>
                    )}
                </div>
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="outlined"
              sx={{ marginY: { xs: "10px" } }}
              color="primary"
              onClick={
                departmentID !== null
                  ? handleDepartmentSubmit(handleSaveDepartment)
                  : handleDepartmentSubmit(onSubmit)
              }
            >
              {departmentID !== null ? "Save Changes" : "Save"}
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Divider className="table-devider"></Divider>
          </Grid>

          <Box className="add-eventpadding">
            <Typography variant="h6" className="table-heading">
              Departments
            </Typography>
          </Box>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className={className.createDepartmentTableHeaderCell}>
                      Department
                    </TableCell>
                    <TableCell className={className.createDepartmentTableHeaderCell}>
                      Name of Representative
                    </TableCell>
                    <TableCell className={className.createDepartmentTableHeaderCell}>
                      Email Address
                    </TableCell>
                    <TableCell className={className.createDepartmentTableHeaderCell}>
                      Description
                    </TableCell>
                    <TableCell className={className.createDepartmentTableHeaderCell}>
                      Identification Keywords
                    </TableCell>
                    <TableCell className={className.createDepartmentTableHeaderCell}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {departmentsData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    departmentsData.map((department, index) => (
                      <TableRow key={index}>
                        <TableCell className="create-department-table-cell">
                          {department.departmentName}
                        </TableCell>
                        <TableCell className="create-department-table-cell">
                          {department.departmentHeadName}
                        </TableCell>
                        <TableCell className="create-department-table-cell">
                          {department.departmentEmail}
                        </TableCell>
                        <TableCell className="create-department-table-cell">
                          {department.departmentDescription}
                        </TableCell>
                        <TableCell className="create-department-table-cell">
                          {department.departmentKeywords}
                        </TableCell>
                        <TableCell className="create-department-table-cell">
                          <IconButton
                            onClick={() =>
                              handleEditDepartment(
                                index,
                                department.departmentId,
                                department
                              )
                            }
                          >
                            <EditIcon className="color-white" />
                          </IconButton>
                          <IconButton
                            onClick={() =>
                              handleDeleteDepartment(
                                index,
                                department.departmentId
                              )
                            }
                          >
                            <DeleteIcon className="color-white" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12}>
            <Divider className="table-devider"></Divider>
          </Grid>

          <Box className="enterprise-upload-box enterprise-file-upload-container">
            <Typography variant="h6" className="table-heading">
              Upload Files
            </Typography>
            <Button
              variant="outlined"
              sx={{ marginY: { xs: "10px" } }}
              className="enterprise-add-file-button enterprise-file-upload-button"
              color="primary"
              onClick={() => setIsModalOpen(true)}
              disabled={!selectedEnterpriseId}
            >
              Add Files
            </Button>
          </Box>

          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="create-department-table-header-cell">
                      Sr No.
                    </TableCell>
                    <TableCell className="create-department-table-header-cell">
                      PDF Name
                    </TableCell>
                    <TableCell className="create-department-table-header-cell">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    tableData.map((row, index) => (
                      <TableRow key={index + 1}>
                        <TableCell className="create-department-table-cell">
                          {index + 1}
                        </TableCell>
                        <TableCell className="create-department-table-cell">
                          {row.pdfUrl ? row.pdfUrl.split("/").pop() : ""}
                        </TableCell>
                        <TableCell className="create-department-table-cell">
                          <IconButton onClick={() => openPdfModal(index)}>
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton
                            onClick={() =>
                              handleDelete(row.pdfUrl.split("/").pop())
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12}>
            <Divider className="table-devider"></Divider>
          </Grid>

          <Box className="enterprise-upload-box enterprise-file-upload-container">
            <Typography variant="h6" className="table-heading">
              Religious Certifications
            </Typography>
            <Button
              variant="outlined"
              sx={{ marginY: { xs: "10px" } }}
              className="enterprise-add-file-button enterprise-file-upload-button"
              color="primary"
              onClick={() => setIsUploadCertificateModalOpen(true)}
              disabled={!selectedEnterpriseId}
            >
              Add Files
            </Button>
          </Box>

          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="create-department-table-header-cell">
                      Sr No.
                    </TableCell>
                    <TableCell className="create-department-table-header-cell">
                      PDF Name
                    </TableCell>
                    <TableCell className="create-department-table-header-cell">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {certificateDetails.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    certificateDetails.map((row, index) => (
                      <TableRow key={index + 1}>
                        <TableCell className="create-department-table-cell">
                          {index + 1}
                        </TableCell>
                        <TableCell className="create-department-table-cell">
                          {row.pdfUrl ? row.pdfUrl.split("/").pop() : ""}
                        </TableCell>
                        <TableCell className="create-department-table-cell">
                          <IconButton
                            onClick={() => openCertificateModal(index)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton
                            onClick={() =>
                              handleCertificateDelete(
                                row.pdfUrl.split("/").pop()
                              )
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
      {renderPdfModal()}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="enterprise-profile-modal"
      >
        <Box className="enterprise-upload-modal-content">
          <Typography variant="h5" className="enterprise-modal-title">
            Upload File
          </Typography>
          <form onSubmit={handleUploadSubmit(onSubmitFile)}>
            <Controller
              control={uploadControl}
              name="file"
              render={({ field }) => (
                <div>
                  <input
                    type="file"
                    onChange={(e) => {
                      const selectedFile = e.target.files[0];
                      setUploadValue("file", [selectedFile]);
                      triggerCertificate("file");
                    }}
                    className="enterprise-input-field enterprise-profile-modal-input-field"
                  />
                  {uploadErrors.file && (
                    <span className="error-handling">
                      {uploadErrors.file.message}
                    </span>
                  )}
                </div>
              )}
              rules={{ validate: validateFile }}
            />
            <Button
              variant="contained"
              color="primary"
              className="enterprise-profile-modal-button"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress
                  size={24}
                  className="enterprise-profile-modal-button-loader"
                />
              ) : (
                "Upload"
              )}
            </Button>
          </form>
        </Box>
      </Modal>

      <Modal
        open={isUploadCertificateModalOpen}
        onClose={() => setIsUploadCertificateModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="enterprise-profile-modal"
      >
        <Box className="enterprise-upload-modal-content">
          <Typography variant="h5" className="enterprise-modal-title">
            Upload Religious Certifications
          </Typography>
          <form onSubmit={handleCertificateSubmit(onSubmitCertificate)}>
            {/* File Upload */}
            <Controller
              control={certificateControl}
              name="file"
              render={({ field }) => (
                <div>
                  <input
                    type="file"
                    onChange={(e) => {
                      const selectedFile = e.target.files[0];
                      setCertificateValue("file", [selectedFile]);
                      triggerUpload("file");
                    }}
                    className="enterprise-input-field enterprise-profile-modal-input-field"
                  />
                  {certificateErrors.file && (
                    <span className="error-handling">
                      {certificateErrors.file.message}
                    </span>
                  )}
                </div>
              )}
              rules={{ validate: validateFile }}
            />
            <Button
              variant="contained"
              color="primary"
              className="enterprise-profile-modal-button"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress
                  size={24}
                  className="enterprise-profile-modal-button-loader"
                />
              ) : (
                "Upload"
              )}
            </Button>
          </form>
        </Box>
      </Modal>
      <ConfirmDialog
        open={confirmDialogOpen}
        handleClose={() => setConfirmDialogOpen(false)}
        handleConfirm={handleConfirmation}
        confirmationText={confirmationText}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default AdminCreateDepartment;
