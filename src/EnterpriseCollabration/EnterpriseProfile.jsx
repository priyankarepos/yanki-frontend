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
import { messages, apiUrls } from "../Utils/stringConstant/EnterpriseProfileString";
import { agentChatResponse } from '../Utils/stringConstant/AgentChatResponse';

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
      const response = await axios.get(apiUrls.getCertificate);

      setTableData(response.data.map((pdfUrl, index) => ({ id: index + 1, pdfUrl })));

    } catch (error) {
      setSnackbarMessage(`${messages.fetchError} ${error}`);
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
      return messages.invalidFileType;
    }
    return '';
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('file', data.file[0]);

      const apiUrl = apiUrls.uploadDocument;

      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setSnackbarMessage(`${messages.documentAdded}${data.file[0].name}${messages.addedSuccessfully}`);
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
        setSnackbarMessage(messages.uploadFailed);
        setSnackbarOpen(true);
        setIsModalOpen(false);
      }
    } catch (error) {
      setSnackbarMessage(messages.uploadError);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (pdfName) => {
    setPdfName(pdfName);
    setConfirmDialogOpen(true);
    setConfirmationText(messages.deleteConfirm);
  };

  const handleConfirmation = async () => {
    const rowIndex = tableData.findIndex((row) => row.pdfUrl.split('/').pop() === pdfName);

    if (rowIndex !== -1) {
      try {
        setLoading(true);
        const response = await axios.delete(`${apiUrls.deleteDocument}${encodeURIComponent(pdfName)}`);

        if (response.status === 200) {
          const updatedTableData = [...tableData];
          updatedTableData.splice(rowIndex, 1);
          setTableData(updatedTableData);
          setConfirmDialogOpen(false);
          setSnackbarMessage(`${messages.deleteSuccess}${pdfName}${messages.deletedSuccessfully}`);
          setSnackbarOpen(true);
        } else {
          setSnackbarMessage(`${messages.deleteFailed} ${response.status}, ${response.data.message}`);
          setSnackbarOpen(true);
        }
      } catch (error) {
        setSnackbarMessage(`${messages.deleteError} ${error.message}`);
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
      EnterpriseLatitude: enterpriseDetails.latitude || "",
      EnterpriseLongitude: enterpriseDetails.longitude || "",
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
          messages.oneKeywordRequired,
      };

      // Validate that opening and closing times are not the same
      if (data.BusinessHoursOpeningTime === data.BusinessHoursClosingTime) {
        validationErrors.BusinessHoursClosingTime =
          messages.openCloseTimeNotSame;
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
        const response = await axios.get(apiUrls.getEnterpriseCategories);

        if (response.status === 200) {
          setEnterpriseCategories(response.data);
        } else {
          setSnackbarMessage(messages.fetchCategoriesFailed);
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
        const response = await axios.get(apiUrls.getEnterpriseDetails);

        if (response.status === 200) {
          setEnterpriseDetails(response.data.data);
          sessionStorage.setItem('enterpriseId', response.data.data[0].enterpriseId);
        } else {
          setSnackbarMessage(messages.fetchDetailsFailed);
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
    setValue(messages.enterpriseLatitudeField, enterpriseDetails[0]?.latitude || "");
    setValue(messages.enterpriseLongitudeField, enterpriseDetails[0]?.longitude || "");
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
      const response = await axios.get(`${apiUrls.checkEnterpriseKeyword}${tag}`);

      if (response.status === 200) {
        const keywordExists = response.data.exists;

        if (keywordExists !== undefined) {
          setSnackbarMessage('keywordExists', keywordExists);
          setSnackbarOpen(true);

          if (keywordExists) {
            setSnackbarMessage(messages.keywordExists, tag);
            setSnackbarOpen(true);
          } else {
            setSnackbarMessage(messages.keywordNotExist, tag);
            setSnackbarOpen(true);

            setTags((prevTags) => [...prevTags, tag]);
          }
        } else {
          setSnackbarMessage(messages.keywordUndefined, tag);
          setSnackbarOpen(false);
        }
      } else {
        setSnackbarMessage(messages.keywordCheckFailed);
        setSnackbarOpen(true);
      }
      return response.data;
    } catch (error) {
      setSnackbarMessage(messages.errorCheckENterpriseKeyword, error);
      setSnackbarOpen(true);
      return { isSuccess: false };
    }
  };

  const handleAddTag = async (tag) => {
    try {
      if (tagCount >= 25) {
        setSnackbarMessage(messages.tagLimitReached);
        setSnackbarOpen(true);
        return;
      }

      if (tag.length > 40) {
        setSnackbarMessage(messages.tagTooLong);
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
          setSnackbarMessage(messages.tagNotAvailable);
          setSnackbarOpen(true);
        }
      } else {
        setSnackbarMessage(messages.keywordCheckFailed);
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage(messages.errorHandelingTag, error);
      setSnackbarOpen(true);
    }
  };


  const handleRemoveTag = (tag) => {
    if (tags.length === 1) {
      setSnackbarMessage(messages.oneTagRequired);
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
        `${apiUrls.updateEnterpriseDetails}`,
        {
          enterpriseId: enterpriseDetails[0]?.enterpriseId,
          enterpriseName: formData.EnterpriseName,
          categoryId: selectedCategory || formData.EnterpriseCategories,
          contactPersonName: formData.EnterprisePointOfContact,
          website: formData.WebsiteUrl ? formData.WebsiteUrl : null,
          enterpriseAddress: formData.EnterpriseAddress,
          latitude: String(formData.EnterpriseLatitude),
          longitude: String(formData.EnterpriseLongitude),
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
          setSnackbarMessage(messages.updateSuccess);
        } else {
          setSnackbarMessage(messages.updateSuccessNoDepartments);
        }
        setSnackbarOpen(true);
        window.location.reload();
      } else {
        setSnackbarMessage(messages.updateFailed);
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage(messages.updateError, error);
      setSnackbarOpen(true);
    }
  };

  const placeholderText = messages.productOverviewPlaceholder;

  useEffect(() => {
    let autocomplete;

    function initAutocomplete() {
      const input = document.getElementById(messages.addressElementId);
      if (input && window.google && window.google.maps && window.google.maps.places) {
        autocomplete = new window.google.maps.places.Autocomplete(input);

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (!place.geometry) {
            alert(messages.noDetailsAvailable(place.name));
            return;
          }

          setValue(messages.enterpriseAddressField, place.formatted_address);
          setValue(messages.enterpriseLatitudeField, place.geometry.location.lat());
          setValue(messages.enterpriseLongitudeField, place.geometry.location.lng());
        });
      } else {
        setSnackbarMessage(messages.googleMapAPIFullyLoaded);
        setSnackbarOpen(true)
      }
    }

    function loadGoogleMapsScript() {
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        const script = document.createElement(messages.scriptText);
        const googleMapsApiUrl = apiUrls.googleMapsApi(import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY);
        script.src = googleMapsApiUrl;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          initAutocomplete();
        };
        document.head.appendChild(script);

        return () => {
          document.head.removeChild(script);
        };
      } else {
        initAutocomplete();
      }
    }

    if (document.getElementById(messages.addressElementId)) {
      loadGoogleMapsScript();
    } else {
      const observer = new MutationObserver((mutations, me) => {
        if (document.getElementById(messages.addressElementId)) {
          loadGoogleMapsScript();
          me.disconnect(); 
          return;
        }
      });
      observer.observe(document, {
        childList: true,
        subtree: true
      });
    }
  }, [setValue]);


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
      <Box sx={{
          width:
            drawerOpen && !isSmallScreen
              ? agentChatResponse.drawerOpenWidth
              : agentChatResponse.zeroWidth,
              transition: agentChatResponse.transitionStyle,}}>
        <EnterpriseDashboard />
      </Box>
      <Box className={agentChatResponse.enterpriseFormBox}
        sx={{
          width: drawerOpen
            ? agentChatResponse.drawerOpenCalcWidth
            : agentChatResponse.hundredWidth, transition: agentChatResponse.transitionStyle,
        }} >
        <Typography variant="h6" className='enterprise-heading'>
          {messages.myEnterpriseProfileHeading}
        </Typography>
        <Grid container spacing={2} className='enterprise-profile'>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <InputLabel className={messages.enterpriseInputLabel}>{messages.enterpriseNameLabel}<sup className={messages.asterisk}>*</sup></InputLabel>
            <Controller
              control={control}
              name="EnterpriseName"
              rules={{
                required: messages.enterpriseNameRequired,
                minLength: {
                  value: 3,
                  message: messages.enterpriseNameMin3,
                },
                maxLength: {
                  value: 30,
                  message: messages.enterpriseNameMax30,
                },
              }}
              render={({ field }) => (
                <div>
                  <TextField
                    className={messages.enterpriseProfileInputField}
                    {...field}
                    type="outlined"
                    placeholder={messages.enterpriseNamePlaceholder}
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
            <InputLabel className={messages.enterpriseInputLabel}>{messages.enterprisePointOfContactLabel}<sup className={messages.asterisk}>*</sup></InputLabel>
            <Controller
              control={control}
              name="EnterprisePointOfContact"
              rules={{
                required: messages.enterprisePointOfContactRequired,
                minLength: {
                  value: 3,
                  message: messages.enterprisePointOfContactMin3,
                },
                maxLength: {
                  value: 30,
                  message: messages.enterprisePointOfContactMax30,
                },
              }}
              render={({ field }) => (
                <div>
                  <TextField
                    className={messages.enterpriseProfileInputField}
                    {...field}
                    type="outlined"
                    placeholder={messages.enterprisePointOfContactPlaceholder}
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
            <InputLabel className={messages.enterpriseInputLabel}>{messages.enterpriseAddressLabel}<sup className={messages.asterisk}>*</sup></InputLabel>
            <Controller
              control={control}
              name="EnterpriseAddress"
              rules={{ required: messages.enterpriseAddressRequired }}
              render={({ field }) => (
                <div>
                  <TextareaAutosize
                    className='enterprise-text-area'
                    {...field}
                    id={messages.addressElementId}
                    placeholder={messages.enterpriseAddressPlaceholder}
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
          <Grid item xs={6}>
            <InputLabel className={messages.enterpriseInputLabel}>{messages.latitudeLabel}<sup className={messages.requiredIcon}>*</sup></InputLabel>
            <Controller
              control={control}
              name={messages.enterpriseLatitudeField}
              rules={{ required: messages.latitudeRequired }}
              render={({ field }) => (
                <div>
                  <TextField
                    className={messages.enterpriseInputFieldClass}
                    {...field}
                    placeholder={messages.enterpriseLatitude}
                    fullWidth
                    error={!!errors.EnterpriseLatitude}
                  />
                  {errors[messages.enterpriseLatitudeField] && (
                    <FormHelperText className={messages.createAdminEnterpriseErrorclass}>
                      {errors[messages.enterpriseLatitudeField].message}
                    </FormHelperText>
                  )}
                </div>
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <InputLabel className={messages.enterpriseInputLabel}>{messages.longitudeLabel}<sup className={messages.requiredIcon}>*</sup></InputLabel>
            <Controller
              control={control}
              name={messages.enterpriseLongitudeField}
              rules={{ required: messages.longitudeRequired }}
              render={({ field }) => (
                <div>
                  <TextField
                    className={messages.enterpriseInputFieldClass}
                    {...field}
                    placeholder={messages.enterpriseLongitude}
                    fullWidth
                    error={!!errors.EnterpriseLongitude}
                  />
                  {errors[messages.enterpriseLongitudeField] && (
                    <FormHelperText className={messages.createAdminEnterpriseErrorclass}>
                      {errors[messages.enterpriseLongitudeField].message}
                    </FormHelperText>
                  )}
                </div>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <InputLabel className={messages.enterpriseInputLabel}>{messages.emailAddressLabel}<sup className={messages.asterisk}>*</sup></InputLabel>
            <Controller
              control={control}
              name="EmailAddress"
              rules={{
                required: {
                  value: true,
                  message: messages.enterpriseEmailAddressRequired,
                },
                pattern: {
                  value: emailRegex,
                  message: messages.enterpriseEmailAddressValid,
                },
              }}
              render={({ field }) => (
                <div>
                  <TextField
                    className={messages.enterpriseProfileInputField}
                    {...field}
                    type="outlined"
                    placeholder={messages.enterpriseEmailAddressplaceholder}
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
            <InputLabel className={messages.enterpriseInputLabel}>{messages.phoneNumberLabel}<sup className={messages.asterisk}>*</sup></InputLabel>
            <Controller
              control={control}
              name="PhoneNumber"
              rules={{
                required: {
                  value: true,
                  message: messages.enterprisePhoneNumberRequired,
                },
              }}
              render={({ field }) => (
                <div>
                  <ReactPhoneInput className={messages.enterpriseProfileInputField}
                    value={field.value}
                    preferredCountries={['us', 'il', 'gb', 'ca', 'mx']}
                    placeholder={messages.enterprisePhoneNumberplaceholder}
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
            <InputLabel className={messages.enterpriseInputLabel}>{messages.websiteUrlLabel}</InputLabel>
            <Controller
              control={control}
              name="WebsiteUrl"
              render={({ field }) => (
                <div>
                  <TextField
                    className={messages.enterpriseProfileInputField}
                    {...field}
                    type="outlined"
                    placeholder="Type website URL here"
                    fullWidth
                  />
                </div>
              )}
            />
          </Grid>

          <Grid item xs={12}><Divider sx={{ marginY: { xs: '10px' } }} className="custom-divider"></Divider></Grid>

          <Grid item xs={12} sm={12} md={6} lg={4}>
            <InputLabel className={messages.enterpriseInputLabel}>{messages.whatsappPhoneNumberLabel}</InputLabel>
            <Controller
              control={control}
              name="WhatsappPhoneNumber"
              render={({ field }) => (
                <TextField
                  className={messages.enterpriseProfileInputField}
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
            <InputLabel className={messages.enterpriseInputLabel}>{messages.instagramUsernameLabel}</InputLabel>
            <Controller
              control={control}
              name="InstagramUsername"
              render={({ field }) => (
                <TextField
                  className={messages.enterpriseProfileInputField}
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
            <InputLabel className={messages.enterpriseInputLabel}>{messages.linkedinUsernameLabel}</InputLabel>
            <Controller
              control={control}
              name="LinkedinUsername"
              render={({ field }) => (
                <TextField
                  className={messages.enterpriseProfileInputField}
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
            <InputLabel className={messages.enterpriseInputLabel}>{messages.enterpriseDescriptionLabel}<sup className={messages.asterisk}>*</sup></InputLabel>
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
            <InputLabel className={messages.enterpriseInputLabel}>{messages.enterpriseCategoriesLabel}<sup className={messages.asterisk}>*</sup></InputLabel>
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
            <InputLabel className={messages.enterpriseInputLabel}>{messages.businessHoursOpeningTimeLabel}<sup className={messages.asterisk}>*</sup></InputLabel>
            <Controller
              control={control}
              name="BusinessHoursOpeningTime"
              rules={{ required: "Business Hours Opening Time is required" }}
              render={({ field }) => (
                <div>
                  <TextField
                    className={messages.enterpriseProfileInputField}
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
            <InputLabel className={messages.enterpriseInputLabel}>{messages.businessHoursClosingTimeLabel}<sup className={messages.asterisk}>*</sup></InputLabel>
            <Controller
              control={control}
              name="BusinessHoursClosingTime"
              rules={{ required: "Business Hours Closing Time is required" }}
              render={({ field }) => (
                <div>
                  <TextField
                    className={messages.enterpriseProfileInputField}
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
            <InputLabel className={messages.enterpriseInputLabel}>{messages.foundedYearLabel}<sup className={messages.asterisk}>*</sup></InputLabel>
            <Controller
              control={control}
              name="FoundedYear"
              rules={{ required: "Founded Year is required" }}
              render={({ field }) => (
                <div>
                  <TextField
                    className={messages.enterpriseProfileInputField}
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
            <InputLabel className={messages.enterpriseInputLabel}>{messages.religiousCertificationsLabel}<sup className={messages.asterisk}>*</sup></InputLabel>

            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
              fullWidth
              className='enterprise-profile-upload-button'
              disabled={enterpriseDetails[0]?.isProfileCompleted === false}
              onClick={() => setIsModalOpen(true)}
            >{enterpriseDetails[0]?.isProfileCompleted === false && messages.uploadButtonText}
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
            <InputLabel className={messages.enterpriseInputLabel}>{messages.frequentlyAskedQuestionsLabel}</InputLabel>
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
            <InputLabel className={messages.enterpriseInputLabel}>{messages.enterpriseIdentificationKeywordsLabel}<sup className={messages.asterisk}>*</sup></InputLabel>
            <Controller
              control={control}
              name="EnterpriseIdentificationKeywords"
              render={({ field }) => (
                <div>
                  <TagsInput
                    value={tags}
                    onChange={(newTags) => setTags(newTags)}
                    addKeys={[13, 9]}
                    placeholder={messages.enterpriseIdentificationKeywordsPlaceholderText}
                    className={messages.enterpriseProfileInputField}
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
              className={messages.enterpriseProfileSubmitButton}
              onClick={handleSubmit(updateEnterpriseDetails)}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} className='enterprise-white-color' /> : messages.saveButtonText}
            </Button> : <Button
              variant="outlined"
              sx={{ marginY: { xs: '10px' } }}
              fullWidth
              className={messages.enterpriseProfileSubmitButton}
              onClick={handleSubmit(updateEnterpriseDetails)}
              disabled={!isDirty || isLoading}
            >
              {isLoading ? <CircularProgress size={24} className='enterprise-white-color' /> : 'Save'}
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
          <Typography variant="h5" className='enterprise-modal-title'>Upload File</Typography>
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
              {loading ? <CircularProgress size={24} className='enterprise-profile-modal-button-loader' /> : 'Upload'}
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
