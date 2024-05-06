import React, { useContext, useState, useEffect } from 'react';
import { Box, Typography, Grid, TextField, InputLabel, Divider, Button, Snackbar, FormHelperText, useMediaQuery, Modal } from '@mui/material';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import EnterpriseDashboard from './EnterpriseDashboard';
import { useForm, Controller } from 'react-hook-form';
import 'react-tagsinput/react-tagsinput.css';
import TagsInput from 'react-tagsinput';
import { Context } from '../App';
import { FormControl, Select, MenuItem } from '@mui/material';
import axios from "axios";
import "./EnterpriseStyle.scss";
import { emailRegex } from '../Utils/validations/validation';
import { CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import CloseIcon from '@mui/icons-material/Close';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { pdfjs } from 'react-pdf';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ConfirmDialog from './ConfirmDialog';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const EnterpriseProfile = () => {
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState("");
  const { drawerOpen } = useContext(Context);
  const [enterpriseDetails, setEnterpriseDetails] = useState({});
  const [enterpriseCategories, setEnterpriseCategories] = useState([]);
  const [tagCount, setTagCount] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isButtonClick, setIsButtonClick] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfLoadError, setPdfLoadError] = useState(false);
  const [pdfName, setPdfName] = useState("");
  const [fileError, setFileError] = useState('');

  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/EnterpriseDocumentUpload/get-enterprise-certificate`);

      setTableData(response.data.map((pdfUrl, index) => ({ id: index + 1, pdfUrl })));

    } catch (error) {
      setSnackbarMessage('Error fetching data:', error);
      setSnackbarOpen(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openPdfModal = (index) => {
    const selectedPdfData = tableData[index];
    setSelectedPdf(selectedPdfData);
    setPdfLoadError(false);
  };

  const closePdfModal = () => {
    setSelectedPdf(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setValue('file', [file]);
    const error = validateFile(file);
    setFileError(error);
  };

  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!file || !allowedTypes.includes(file.type)) {
      return 'Invalid file type. Please upload a JPEG, PNG, or PDF file.';
    }
    return '';
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('file', data.file[0]);

      const apiUrl = `${process.env.REACT_APP_API_HOST}/api/EnterpriseDocumentUpload/upload-enterprise-document?IsCertificate=true`;

      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setSnackbarMessage(`Document with Name ${data.file[0].name} added successfully`);
        setSnackbarOpen(true);
        setIsModalOpen(false);
        setTableData((prevTableData) => [
          ...prevTableData,
          {
            id: prevTableData.length + 1,
            pdfUrl: data.file[0].name,
          },
        ]);
        fetchData();
      } else {
        setSnackbarMessage('Failed to upload file');
        setSnackbarOpen(true);
        setIsModalOpen(false);
      }
    } catch (error) {
      setSnackbarMessage('An error occurred while uploading the file.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (pdfName) => {
    setPdfName(pdfName);
    setConfirmDialogOpen(true);
    setConfirmationText(`Are you sure you want to delete this file?`);
  };

  const handleConfirmation = async () => {
    const rowIndex = tableData.findIndex((row) => row.pdfUrl.split('/').pop() === pdfName);

    if (rowIndex !== -1) {
      try {
        setLoading(true);
        const response = await axios.delete(`${process.env.REACT_APP_API_HOST}/api/EnterpriseDocumentUpload/delete-enterprise-document?fileName=${encodeURIComponent(pdfName)}`);

        if (response.status === 200) {
          const updatedTableData = [...tableData];
          updatedTableData.splice(rowIndex, 1);
          setTableData(updatedTableData);
          setConfirmDialogOpen(false);
          setSnackbarMessage(`Document with Name ${pdfName} deleted successfully`);
          setSnackbarOpen(true);
        } else {
          setSnackbarMessage(`Failed to delete document: ${response.status}, ${response.data.message}`);
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

  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    formState,
    formState: { errors, isSubmitted },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      EnterpriseName: enterpriseDetails.enterpriseName || "",
      EnterprisePointOfContact: enterpriseDetails.contactPersonName || "",
      EnterpriseAddress: enterpriseDetails.enterpriseAddress || "",
      EmailAddress: enterpriseDetails.enterpriseEmail || "",
      PhoneNumber: enterpriseDetails.enterprisePhoneNumber || "",
      WebsiteUrl: enterpriseDetails.website || "",
      WhatsappPhoneNumber: enterpriseDetails.whatsAppPhoneNumber || "",
      InstagramUsername: enterpriseDetails.instagramUsername || "",
      LinkedinUsername: enterpriseDetails.linkedInUsername || "",
      EnterpriseDescription: enterpriseDetails.enterpriseDescription || "",
      EnterpriseCategories: enterpriseDetails.categoryId || "",
      BusinessHoursOpeningTime: enterpriseDetails.officeOpenTime || "",
      BusinessHoursClosingTime: enterpriseDetails.officeCloseTime || "",
      FoundedYear: enterpriseDetails.foundedYear || "",
      FrequentlyAskedQuestions: enterpriseDetails.faQs || "",
      EnterpriseIdentificationKeywords: enterpriseDetails.enterpriseKeywords || [],
    },
    criteriaMode: 'all',
    validate: (data) => {
      const validationErrors = {
        EnterpriseIdentificationKeywords:
          data.EnterpriseIdentificationKeywords.length > 0 ||
          'At least one keyword is required',
      };

      // Validate that opening and closing times are not the same
      if (data.BusinessHoursOpeningTime === data.BusinessHoursClosingTime) {
        validationErrors.BusinessHoursClosingTime =
          'Opening and closing times cannot be the same';
      }

      return validationErrors;
    },
  });

  const { isDirty } = formState;
  useEffect(() => {
    setValue('PhoneNumber', '44',);
  }, [setValue]);

  useEffect(() => {
    const fetchEnterpriseCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_HOST}/api/yanki-ai/get-enterprises-categories`
        );

        if (response.status === 200) {
          setEnterpriseCategories(response.data);
        } else {
          setSnackbarMessage('Failed to fetch enterprise categories');
          setSnackbarOpen(true);
        }
      } catch (error) {
        setSnackbarMessage('Error:', error);
        setSnackbarOpen(true);
      }
    };

    fetchEnterpriseCategories();
  }, []);

  useEffect(() => {
    const fetchEnterpriseDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/yanki-ai/get-enterprise-details`);

        if (response.status === 200) {
          setEnterpriseDetails(response.data);
          sessionStorage.setItem('enterpriseId', response.data.enterpriseId);
        } else {
          setSnackbarMessage('Failed to fetch enterprise details');
          setSnackbarOpen(true);
        }
      } catch (error) {
        setSnackbarMessage('Error:', error);
        setSnackbarOpen(true);
      }
    };

    fetchEnterpriseDetails();
  }, []);

  useEffect(() => {
    setValue("EnterpriseName", enterpriseDetails[0]?.enterpriseName || "");
    setValue("EnterprisePointOfContact", enterpriseDetails[0]?.contactPersonName || "");
    setValue("EnterpriseAddress", enterpriseDetails[0]?.enterpriseAddress || "");
    setValue("EmailAddress", enterpriseDetails[0]?.enterpriseEmail || "");
    setValue("PhoneNumber", enterpriseDetails[0]?.enterprisePhoneNumber || "");
    setValue("WebsiteUrl", enterpriseDetails[0]?.website || "");
    setValue("WhatsappPhoneNumber", enterpriseDetails[0]?.whatsAppPhoneNumber || "");
    setValue("InstagramUsername", enterpriseDetails[0]?.instagramUsername || "");
    setValue("LinkedinUsername", enterpriseDetails[0]?.linkedInUsername || "");
    setValue("EnterpriseDescription", enterpriseDetails[0]?.enterpriseDescription || "");
    setValue("EnterpriseCategories", enterpriseDetails[0]?.categoryId || "");
    setValue("BusinessHoursOpeningTime", enterpriseDetails[0]?.officeOpenTime || "");
    setValue("BusinessHoursClosingTime", enterpriseDetails[0]?.officeCloseTime || "");
    setValue("FoundedYear", enterpriseDetails[0]?.foundedYear || "");
    setValue("FrequentlyAskedQuestions", enterpriseDetails[0]?.faQs || "");

    if (enterpriseDetails[0]?.enterpriseKeywords) {
      const keywordsArray = enterpriseDetails[0]?.enterpriseKeywords.split(',');
      setTags(keywordsArray);
      setValue("EnterpriseIdentificationKeywords", keywordsArray || []);
    }
  }, [enterpriseDetails, setValue]);

  const checkEnterpriseKeyword = async (tag) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_HOST}/api/yanki-ai/check-enterprise-keyword/${tag}`
      );

      if (response.status === 200) {
        const keywordExists = response.data.exists;

        if (keywordExists !== undefined) {
          setSnackbarMessage('keywordExists', keywordExists);
          setSnackbarOpen(true);

          if (keywordExists) {
            setSnackbarMessage('Keyword already exists:', tag);
            setSnackbarOpen(true);
          } else {
            setSnackbarMessage('Keyword does not exist:', tag);
            setSnackbarOpen(true);

            setTags((prevTags) => [...prevTags, tag]);
          }
        } else {
          setSnackbarMessage('Keyword existence is undefined for:', tag);
          setSnackbarOpen(false);
        }
      } else {
        setSnackbarMessage('Failed to check enterprise keyword');
        setSnackbarOpen(true);
      }
      return response.data;
    } catch (error) {
      setSnackbarMessage('Error checking enterprise keyword:', error);
      setSnackbarOpen(true);
      return { isSuccess: false };
    }
  };

  const handleAddTag = async (tag) => {
    try {
      if (tagCount >= 25) {
        setSnackbarMessage('You have reached the maximum limit of tags (25).');
        setSnackbarOpen(true);
        return;
      }

      if (tag.length > 40) {
        setSnackbarMessage('Tag should not exceed 40 characters.');
        setSnackbarOpen(true);
        return;
      }

      const lowerCaseTag = tag.toLowerCase();

      if (tags.map((existingTag) => existingTag.toLowerCase()).includes(lowerCaseTag)) {
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
          setSnackbarMessage(`Tag "${tag}" is not available in this enterprise.`);
          setSnackbarOpen(true);
        }
      } else {
        setSnackbarMessage('Failed to check enterprise keyword');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('Error handling tag:', error);
      setSnackbarOpen(true);
    }
  };


  const handleRemoveTag = (tag) => {
    if (tags.length === 1) {
      setSnackbarMessage('At least one tag is required.');
      setSnackbarOpen(true);
      return;
    }
    const updatedTags = tags.filter((t) => t !== tag);
    setTags(updatedTags);
    setTagCount((prevCount) => Math.max(0, prevCount - 1));
    setIsButtonClick(true);

  };

  useEffect(() => {
    setTagCount(tags.length);
  }, [tags]);

  const departmentsData = JSON.parse(sessionStorage.getItem('departmentsData')) || [];

  const updateEnterpriseDetails = async () => {
    try {
      setIsLoading(true);

      const formData = getValues();
      const tagsAsString = tags.join(',');
      const response = await axios.put(
        `${process.env.REACT_APP_API_HOST}/api/yanki-ai/update-enterprise-details`,
        {
          enterpriseId: enterpriseDetails[0]?.enterpriseId,
          enterpriseName: formData.EnterpriseName,
          categoryId: selectedCategory || formData.EnterpriseCategories,
          contactPersonName: formData.EnterprisePointOfContact,
          website: formData.WebsiteUrl ? formData.WebsiteUrl : null,
          enterpriseAddress: formData.EnterpriseAddress,
          enterprisePhoneNumber: formData.PhoneNumber,
          enterpriseEmail: formData.EmailAddress,
          whatsAppPhoneNumber: formData.WhatsappPhoneNumber,
          instagramUsername: formData.InstagramUsername,
          linkedInUsername: formData.LinkedinUsername,
          enterpriseDescription: formData.EnterpriseDescription,
          officeOpenTime: formData.BusinessHoursOpeningTime,
          officeCloseTime: formData.BusinessHoursClosingTime,
          foundedYear: formData.FoundedYear,
          faQs: formData.FrequentlyAskedQuestions,
          enterpriseKeywords: tagsAsString,
        }
      );

      if (response.status === 200) {
        if (departmentsData.length === 0) {
          setSnackbarMessage('Enterprise details updated successfully. You can now start adding departments');
        } else {
          setSnackbarMessage('Enterprise details updated successfully');
        }
        setSnackbarOpen(true);
        window.location.reload();
      } else {
        setSnackbarMessage('Failed to update enterprise details');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('Error updating enterprise details:', error);
      setSnackbarOpen(true);
    }
  };

  const placeholderText = `Product Overview:
• Could you please provide an overview of the products you offer?
• What are the key features and benefits of your products?

Service Offerings:
• What services does your enterprise provide, and what’s the market you’re focusing?
• Are there any unique or specialized services that your enterprise offers?
`;

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isLargeScreen = useMediaQuery("(min-width: 600px)");

  const renderPdfModal = () => {
    return (
      <Modal
        open={Boolean(selectedPdf)}
        onClose={closePdfModal}
        className='enterprise-profile-modal'
      >
        <div className="enterprise-profile-pdf-modal">
          <IconButton
            className='enterprise-profile-pdf-modal-icon-button'
            style={{ top: !isLargeScreen ? '40px' : '20px' }}
            onClick={closePdfModal}
            aria-label="close"
          >
            <CloseIcon className='enterprise-white-color' />
          </IconButton>
          {!pdfLoadError ? (
            selectedPdf?.pdfUrl.toLowerCase().endsWith('.pdf') ? (
              <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}>
                <Viewer fileUrl={selectedPdf?.pdfUrl} />
              </Worker>
            ) : (
              <img
                src={selectedPdf?.pdfUrl}
                alt=""
                className='enterprise-profile-image'
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



  return (
    <Box className="enterprise-box">
      <Box sx={{ width: drawerOpen && !isSmallScreen ? '270px' : "0" }}>
        <EnterpriseDashboard />
      </Box>
      <Box className={`enterpriseFormBox ${drawerOpen ? "sidebar-content" : "main-content" }`} >
        <Typography variant="h6" className='enterprise-heading'>
          My Enterprise Profile
        </Typography>
        <Grid container spacing={2} className='enterprise-profile'>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <InputLabel className='enterprise-input-lable'>Enterprise Name<sup className='asterisk'>*</sup></InputLabel>
            <Controller
              control={control}
              name="EnterpriseName"
              rules={{
                required: "Enterprise name is required.",
                minLength: {
                  value: 3,
                  message: "Enterprise name should be at least 3 characters long.",
                },
                maxLength: {
                  value: 30,
                  message: "Enterprise name should not exceed 30 characters.",
                },
              }}
              render={({ field }) => (
                <div>
                  <TextField
                    className='enterprise-input-field'
                    {...field}
                    type="outlined"
                    placeholder="Type enterprise name here"
                    fullWidth
                  />
                  {errors['EnterpriseName'] && (
                    <FormHelperText className='error-handling'>{errors['EnterpriseName'].message}</FormHelperText>
                  )}
                </div>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <InputLabel className='enterprise-input-lable'>Enterprise point of contact<sup className='asterisk'>*</sup></InputLabel>
            <Controller
              control={control}
              name="EnterprisePointOfContact"
              rules={{
                required: "Enterprise Point Of Contact is required.",
                minLength: {
                  value: 3,
                  message: "Enterprise Point Of Contact should be at least 3 characters long.",
                },
                maxLength: {
                  value: 30,
                  message: "Enterprise Point Of Contact should not exceed 30 characters.",
                },
              }}
              render={({ field }) => (
                <div>
                  <TextField
                   className='enterprise-input-field'
                    {...field}
                    type="outlined"
                    placeholder="Enterprise point of contact name"
                    fullWidth
                  />
                  {errors['EnterprisePointOfContact'] && (
                    <FormHelperText className='error-handling'>{errors['EnterprisePointOfContact'].message}</FormHelperText>
                  )}
                </div>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel className='enterprise-input-lable'>Enterprise address<sup className='asterisk'>*</sup></InputLabel>
            <Controller
              control={control}
              name="EnterpriseAddress"
              rules={{ required: "Enterprise Address is required" }}
              render={({ field }) => (
                <div>
                  <TextareaAutosize
                    className='enterprise-text-area'
                    {...field}
                    placeholder="Type enterprise address here"
                    onFocus={(e) => e.target.style.outline = 'none'}
                    onMouseOver={(e) => e.target.style.backgroundColor = 'none'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'none'}
                  />
                  {errors['EnterpriseAddress'] && (
                    <FormHelperText className='error-handling'>{errors['EnterpriseAddress'].message}</FormHelperText>
                  )}
                </div>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <InputLabel className='enterprise-input-lable'>Email Address<sup className='asterisk'>*</sup></InputLabel>
            <Controller
              control={control}
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
              render={({ field }) => (
                <div>
                  <TextField
                    className='enterprise-input-field'
                    {...field}
                    type="outlined"
                    placeholder="Type email address here"
                    fullWidth
                  />
                  {errors['EmailAddress'] && (
                    <FormHelperText className='error-handling'>{errors['EmailAddress'].message}</FormHelperText>
                  )}
                </div>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <InputLabel className='enterprise-input-lable'>Phone Number<sup className='asterisk'>*</sup></InputLabel>
            <Controller
              control={control}
              name="PhoneNumber"
              rules={{
                required: {
                  value: true,
                  message: "Phone number is required.",
                },
              }}
              render={({ field }) => (
                <div>
                  <ReactPhoneInput className='enterprise-input-field'
                    value={field.value}
                    preferredCountries={['us', 'il', 'gb', 'ca', 'mx']}
                    placeholder="Phone number"
                    onChange={(value, country, event) => {
                      field.onChange(value);
                    }}
                    error={!!errors["PhoneNumber"]}
                  />
                  {errors['PhoneNumber'] && (
                    <FormHelperText className='error-handling'>{errors['PhoneNumber'].message}</FormHelperText>
                  )}
                </div>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={4}>
            <InputLabel className='enterprise-input-lable'>Website URL</InputLabel>
            <Controller
              control={control}
              name="WebsiteUrl"
              render={({ field }) => (
                <div>
                  <TextField
                    className='enterprise-input-field'
                    {...field}
                    type="outlined"
                    placeholder="Type website URL here"
                    fullWidth
                  />
                </div>
              )}
            />
          </Grid>

          <Grid item xs={12}><Divider sx={{ marginY: { xs: '10px' } }}  className="custom-divider"></Divider></Grid>

          <Grid item xs={12} sm={12} md={6} lg={4}>
            <InputLabel className='enterprise-input-lable'>WhatsApp Phone Number</InputLabel>
            <Controller
              control={control}
              name="WhatsappPhoneNumber"
              render={({ field }) => (
                <TextField
                  className='enterprise-input-field'
                  {...field}
                  type="outlined"
                  placeholder="Type WhatsApp phone number here"
                  fullWidth
                  error={!!errors['WhatsappPhoneNumber']}
                  helperText={errors['WhatsappPhoneNumber'] ? errors['WhatsappPhoneNumber'].message : ''}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={4}>
            <InputLabel className='enterprise-input-lable'>Instagram Username</InputLabel>
            <Controller
              control={control}
              name="InstagramUsername"
              render={({ field }) => (
                <TextField
                  className='enterprise-input-field'
                  {...field}
                  type="outlined"
                  placeholder="Type Instagram username here"
                  fullWidth
                  error={!!errors['InstagramUsername']}
                  helperText={errors['InstagramUsername'] ? errors['InstagramUsername'].message : ''}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={4}>
            <InputLabel className='enterprise-input-lable'>LinkedIn Username</InputLabel>
            <Controller
              control={control}
              name="LinkedinUsername"
              render={({ field }) => (
                <TextField
                  className='enterprise-input-field'
                  {...field}
                  type="outlined"
                  placeholder="Type LinkedIn username here"
                  fullWidth
                  error={!!errors['LinkedinUsername']}
                  helperText={errors['LinkedinUsername'] ? errors['LinkedinUsername'].message : ''}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} className="Enterprise-Description">
            <InputLabel className='enterprise-input-lable'>Enterprise Description<sup className='asterisk'>*</sup></InputLabel>
            <Controller
              control={control}
              name="EnterpriseDescription"
              rules={{ required: "Enterprise Description is required" }}
              render={({ field }) => (
                <div>
                  <TextareaAutosize
                   className='enterprise-text-area enterprise-description-text-area'
                    {...field}
                    placeholder={placeholderText}
                    onFocus={(e) => e.target.style.outline = 'none'}
                    onMouseOver={(e) => e.target.style.backgroundColor = 'none'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'none'}
                  />
                  {errors['EnterpriseDescription'] && (
                    <FormHelperText className='error-handling'>{errors['EnterpriseDescription'].message}</FormHelperText>
                  )}
                </div>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={4} className='enterprise-profile-category'>
            <InputLabel className='enterprise-input-lable'>Enterprise Categories<sup className='asterisk'>*</sup></InputLabel>
            <FormControl fullWidth error={!!errors['EnterpriseCategories']} required>
              <Controller
                control={control}
                name="EnterpriseCategories"
                rules={{ required: 'Please select an enterprise category' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={selectedCategory}
                    onChange={(event) => setSelectedCategory(event.target.value)}
                    displayEmpty
                    className='enterprise-input-field EnterpriseCategorySelect'
                  >
                    <MenuItem value="" disabled>
                      {enterpriseDetails[0]?.categoryName}
                    </MenuItem>
                    {enterpriseCategories
                      .filter((category) => category.id !== enterpriseDetails.categoryId)
                      .map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                  </Select>
                )}
              />
              {errors['EnterpriseCategories'] && (
                <FormHelperText className='error-handling'>
                  {errors['EnterpriseCategories'].message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={4}>
            <InputLabel className='enterprise-input-lable'>Business Hours Opening Time<sup className='asterisk'>*</sup></InputLabel>
            <Controller
              control={control}
              name="BusinessHoursOpeningTime"
              rules={{ required: "Business Hours Opening Time is required" }}
              render={({ field }) => (
                <div>
                  <TextField
                    className='enterprise-input-field'
                    {...field}
                    type="time"
                    placeholder="Office opening time"
                    fullWidth
                  />
                  {errors['BusinessHoursOpeningTime'] && (
                    <FormHelperText className='error-handling'>{errors['BusinessHoursOpeningTime'].message}</FormHelperText>
                  )}
                </div>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={4}>
            <InputLabel className='enterprise-input-lable'>Business Hours Closing Time<sup className='asterisk'>*</sup></InputLabel>
            <Controller
              control={control}
              name="BusinessHoursClosingTime"
              rules={{ required: "Business Hours Closing Time is required" }}
              render={({ field }) => (
                <div>
                  <TextField
                    className='enterprise-input-field'
                    {...field}
                    type="time"
                    placeholder="Office closing time"
                    fullWidth
                  />
                  {errors.BusinessHoursClosingTime && (
                    <FormHelperText className='error-handling'>{errors.BusinessHoursClosingTime.message}</FormHelperText>
                  )}
                </div>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={4}>
            <InputLabel className='enterprise-input-lable'>Founded Year<sup className='asterisk'>*</sup></InputLabel>
            <Controller
              control={control}
              name="FoundedYear"
              rules={{ required: "Founded Year is required" }}
              render={({ field }) => (
                <div>
                  <TextField
                    className='enterprise-input-field'
                    {...field}
                    type="outlined"
                    inputProps={{ maxLength: 4 }}
                    placeholder="Type founded year here"
                    fullWidth
                  />
                  {errors['FoundedYear'] && (
                    <FormHelperText className='error-handling'>{errors['FoundedYear'].message}</FormHelperText>
                  )}
                </div>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={4}>
            <InputLabel className='enterprise-input-lable'>Religious Certifications<sup className='asterisk'>*</sup></InputLabel>
            
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
              fullWidth
              className='enterprise-profile-upload-button'
              disabled={enterpriseDetails[0]?.isProfileCompleted === false}
              onClick={() => setIsModalOpen(true)}
            >{enterpriseDetails[0]?.isProfileCompleted === false && "Please complete your profile first."}
            </Button>

            <ul className='enterprise-profile-ul'>
              {tableData.map((row, index) => (
                <li key={index + 1} className='enterprise-profile-list'>
                  <div className='enterprise-profile-list-container'>
                    <a href={row.pdfUrl} target="_blank" rel="noopener noreferrer" className='enterprise-profile-list-link' >
                      {row.id} - {row.pdfUrl ? row.pdfUrl.split('/').pop() : ''}
                    </a>
                  </div>
                  <div>
                    <IconButton onClick={() => openPdfModal(index)} className='enterprise-profile-list-icon-button'>
                      <VisibilityIcon className='enterprise-profile-list-icon' />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(row.pdfUrl.split('/').pop())} className='enterprise-profile-list-icon-button' >
                      <DeleteIcon className='enterprise-profile-list-icon' />
                    </IconButton>
                  </div>
                </li>
              ))}
            </ul>
          </Grid>

          <Grid item xs={12}><Divider sx={{ marginY: { xs: '10px' } }} className='custom-divider'></Divider></Grid>

          <Grid item xs={12}>
            <InputLabel className='enterprise-input-lable'>Frequently Asked Questions (FAQs)</InputLabel>
            <Controller
              control={control}
              name="FrequentlyAskedQuestions"
              render={({ field }) => (
                <TextareaAutosize
                  className='enterprise-text-area'
                  {...field}
                  placeholder="Type frequently asked questions (FAQs) here"
                  onFocus={(e) => e.target.style.outline = 'none'}
                  onMouseOver={(e) => e.target.style.backgroundColor = 'none'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'none'}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <InputLabel className='enterprise-input-lable'>Enterprise identification keywords<sup className='asterisk'>*</sup></InputLabel>
            <Controller
              control={control}
              name="EnterpriseIdentificationKeywords"
              render={({ field }) => (
                <div>
                  <TagsInput
                    value={tags}
                    onChange={(newTags) => setTags(newTags)}
                    addKeys={[13, 9]}
                    placeholder="Type Enterprise identification keywords here"
                    className='enterprise-input-field'
                    inputProps={{
                      ...field,
                      value: tagInput,
                      onChange: (e) => setTagInput(e.target.value),
                      onKeyDown: (e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          e.persist();
                          handleAddTag(e.target.value);
                          field.onChange('');
                          setTagInput('');
                        }
                      },
                    }}
                  />
                  <div className='enterprise-tags-container'>
                    {tags.map((tag, index) => (
                      <div key={`${tag}-${index}`} className='enterprise-tag' style={{
                        backgroundColor: tag === tagInput ? '#ff7070' : '#6fa8dd',
                      }}>
                        <span className='enterprise-tag-text'>{tag}</span>
                        <span
                          className='enterprise-remove-tag'
                          onClick={() => handleRemoveTag(tag)}
                        >
                          &times;
                        </span>
                      </div>
                    ))}
                  </div>
                  {isSubmitted && !tags.length && (
                    <FormHelperText className='error-handling'>
                      At least one keyword is required
                    </FormHelperText>
                  )}
                  {!tags.length && <Typography className='enterprise-profile-description'>Enterprise identification keywords (press enter after each keywords to register)</Typography>}
                </div>
              )}
            />
          </Grid>

          <Grid item xs={3}>
            {(isButtonClick || selectedCategory) ? <Button
              variant="outlined"
              fullWidth
              className='enterprise-profile-submit-button'
              onClick={handleSubmit(updateEnterpriseDetails)}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} className='enterprise-white-color' /> : 'Save'}
            </Button> : <Button
              variant="outlined"
              sx={{ marginY: { xs: '10px' } }}
              fullWidth
              className='enterprise-profile-submit-button'
              onClick={handleSubmit(updateEnterpriseDetails)}
              disabled={!isDirty || isLoading}
            >
              {isLoading ? <CircularProgress size={24} className='enterprise-white-color'/> : 'Save'}
            </Button>}
          </Grid>
        </Grid>
      </Box>
      {renderPdfModal()}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className='enterprise-profile-modal'
      >
        <Box className='enterprise-profile-modal-content' >
          <Typography variant="h5" className='enterprise-modal-title'>"Upload File"</Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* File Upload */}
            <div>
              <input
                type="file"
                onChange={handleFileChange}
                className='enterprise-input-field enterprise-profile-modal-input-field'
              />
              {fileError && (
                <span className='error-handling'>{fileError}</span>
              )}
            </div>
            <Button
              variant="contained"
              color="primary"
              className='enterprise-profile-modal-button'
              type="submit"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} className='enterprise-profile-modal-button-loader'/> : 'Upload'}
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
        handleConfirm={() => handleConfirmation()}
        confirmationText={confirmationText}
        loading={loading}
      />
    </Box >
  );
};

export default EnterpriseProfile;
