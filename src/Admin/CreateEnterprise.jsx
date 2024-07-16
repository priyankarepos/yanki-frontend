import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
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
  useMediaQuery,
  Grid,
  FormHelperText,
  TextareaAutosize,
  Divider,
  Pagination,
} from "@mui/material";
import AdminDashboard from "./AdminDashboard";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import "react-tagsinput/react-tagsinput.css";
import TagsInput from "react-tagsinput";
import { Context } from "../App";
import { FormControl, Select, MenuItem } from "@mui/material";
import { emailRegex, phoneRegex } from "../Utils/validations/validation";
import ConfirmDialog from "../EnterpriseCollabration/ConfirmDialog";
import "../EnterpriseCollabration/EnterpriseStyle.scss";
import ReactPhoneInput from "react-phone-input-2";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { messages, apiUrls } from "../Utils/stringConstant/EnterpriseProfileString";

const AdminCreateEnterprise = () => {
  const { drawerOpen } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [enterpriseDetails, setEnterpriseDetails] = useState({});
  const [enterpriseList, setEnterpriseList] = useState([]);
  const [enterpriseCategories, setEnterpriseCategories] = useState([]);
  const [tagCount, setTagCount] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [enterpriseId, setEnterpriseId] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");

  const getEnterpriseDetails = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await axios.get(
        `${apiUrls.getEnterpriseDetails}?enterpriseName=${query}&pageNumber=${pageNumber}&pageSize=10`
      );

      if (response.status === 200) {
        const responseData = response.data;
        if (response.data.totalCount) {
          setEnterpriseDetails(responseData.data);
          setEnterpriseList(responseData.data);
        } else {
          setEnterpriseDetails({});
          setEnterpriseList([]);
        }
        setTotalPages(Math.ceil(response.data.totalCount / 10));
      } else {
        setSnackbarMessage(messages.fetchDetailsFailed);
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage(messages.errorFetchEnterpriseDetails, error);
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, [pageNumber, query]);
  useEffect(() => {
    getEnterpriseDetails();
  }, [getEnterpriseDetails, pageNumber, query]);

  const handlePageChange = (event, newPage) => {
    setPageNumber(newPage);
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

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
        setSnackbarMessage("Error:", error);
        setSnackbarOpen(true);
      }
    };

    fetchEnterpriseCategories();
  }, []);

  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      EnterpriseName: enterpriseDetails.enterpriseName || "",
      EnterprisePointOfContact: enterpriseDetails.contactPersonName || "",
      EnterpriseAddress: enterpriseDetails.enterpriseAddress || "",
      EnterpriseLatitude: enterpriseDetails.latitude || "",
      EnterpriseLongitude: enterpriseDetails.longitude || "",
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
      EnterpriseIdentificationKeywords:
        enterpriseDetails.enterpriseKeywords || [],
    },
    criteriaMode: "all",
    validate: (data) => {
      const validationErrors = {
        EnterpriseIdentificationKeywords:
          data.EnterpriseIdentificationKeywords.length > 0 ||
          messages.oneKeywordRequired,
      };

      if (data.BusinessHoursOpeningTime === data.BusinessHoursClosingTime) {
        validationErrors.BusinessHoursClosingTime =
          messages.openCloseTimeNotSame;
      }

      return validationErrors;
    },
  });

  const checkEnterpriseKeyword = async (tag) => {
    try {
      const response = await axios.get(`${apiUrls.checkEnterpriseKeyword}${tag}`);

      if (response.status === 200) {
        const keywordExists = response.data.exists;

        if (keywordExists !== undefined) {
          if (keywordExists) {
            setSnackbarMessage(messages.keywordExists, tag);
            setSnackbarOpen(true);
          } else {
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
  };

  useEffect(() => {
    setTagCount(tags.length);
  }, [tags]);

  const createAdminEnterprise = async () => {
    try {
      setIsLoading(true);

      const formData = getValues();
      const tagsAsString = tags.join(",");
      const response = await axios.post(
        apiUrls.adminCreateEnterprise,
        {
          enterpriseName: formData.EnterpriseName,
          categoryId: formData.EnterpriseCategories,
          contactPersonName: formData.EnterprisePointOfContact,
          website: formData.WebsiteUrl ? formData.WebsiteUrl : "",
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
          isProfileCompleted: false,
        }
      );

      if (response.status === 200) {
        if (departmentsData.length === 0) {
          setSnackbarMessage(messages.EnterpriseCreatedSuccessfully);
          setSnackbarOpen(true);
        } else {
          setSnackbarMessage(messages.EnterpriseCreatedSuccessfully);
          setSnackbarOpen(true);
        }
        setSnackbarOpen(true);
        getEnterpriseDetails();
      } else {
        setSnackbarMessage(messages.EnterpriseCreatedFailed);
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage(messages.EnterpriseCreatedError, error);
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const departmentsData =
    JSON.parse(sessionStorage.getItem("departmentsData")) || [];

  const handleEditEnterprise = (key, enterpriseId, enterprise) => {
    setEnterpriseId(enterpriseId);
    setValue("EnterpriseName", enterprise.enterpriseName || "");
    setValue("EnterprisePointOfContact", enterprise.contactPersonName || "");
    setValue("EnterpriseAddress", enterprise.enterpriseAddress || "");
    setValue(messages.enterpriseLatitudeField, enterprise.latitude || "");
    setValue(messages.enterpriseLongitudeField, enterprise.longitude || "");
    setValue("EmailAddress", enterprise.enterpriseEmail || "");
    setValue("PhoneNumber", enterprise.enterprisePhoneNumber || "");
    setValue("WebsiteUrl", enterprise.website || "");
    setValue("WhatsappPhoneNumber", enterprise.whatsAppPhoneNumber || "");
    setValue("InstagramUsername", enterprise.instagramUsername || "");
    setValue("LinkedinUsername", enterprise.linkedInUsername || "");
    setValue("EnterpriseDescription", enterprise.enterpriseDescription || "");
    setValue("EnterpriseCategories", enterprise.categoryId || "");
    setValue("BusinessHoursOpeningTime", enterprise.officeOpenTime || "");
    setValue("BusinessHoursClosingTime", enterprise.officeCloseTime || "");
    setValue("FoundedYear", enterprise.foundedYear || "");
    setValue("FrequentlyAskedQuestions", enterprise.faQs || "");

    if (enterprise.enterpriseKeywords) {
      const keywordsArray = enterprise.enterpriseKeywords.split(",");
      setTags(keywordsArray);
      setValue("EnterpriseIdentificationKeywords", keywordsArray || []);
    }
  };

  const handleDeleteEnterprise = (key, enterpriseId) => {
    setEnterpriseId(enterpriseId);
    setConfirmDialogOpen(true);
    setConfirmationText(
      `${messages.createdEnterpriseDelete} "${enterpriseList[key].enterpriseName}"?`
    );
  };

  const handleConfirmDelete = async () => {
    setConfirmDialogOpen(false);
    try {
      const response = await axios.delete(apiUrls.adminDeleteEnterprise(enterpriseId));
      if (response.status === 200) {
        getEnterpriseDetails();
      } else {
        setSnackbarMessage(messages.adminDeleteEnterpriseFailed);
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage(messages.adminDeleteEnterpriseError, error);
      setSnackbarOpen(true);
    }
  };

  const updateEnterpriseDetails = async () => {
    try {
      setIsLoading(true);
      const formData = getValues();
      const tagsAsString = tags.join(",");
      const requestBody = {
        enterpriseId: enterpriseId,
        enterpriseName: formData.EnterpriseName,
        categoryId: formData.EnterpriseCategories,
        contactPersonName: formData.EnterprisePointOfContact,
        website: formData.WebsiteUrl ? formData.WebsiteUrl : "",
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
      };
      const response = await axios.put(
        `${apiUrls.updateEnterpriseDetails}`,
        requestBody
      );
      if (response.status === 200) {
        if (departmentsData.length === 0) {
          setSnackbarMessage(messages.AdminEnterpriseUpdateSuccess);
        } else {
          setSnackbarMessage(messages.AdminEnterpriseUpdateSuccess);
        }
        setSnackbarOpen(true);
        getEnterpriseDetails();
      } else {
        setSnackbarMessage(messages.updateFailed);
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage(messages.updateError, error);
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let autocomplete;

    function initAutocomplete() {
      const input = document.getElementById(messages.addressElementId);
      autocomplete = new window.google.maps.places.Autocomplete(input);

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          alert(messages.noDetailsAvailable(place.name));
          return;
        }

        if (place.geometry) {
          setValue(messages.enterpriseAddressField, place.formatted_address);
          setValue(messages.enterpriseLatitudeField, place.geometry.location.lat());
          setValue(messages.enterpriseLongitudeField, place.geometry.location.lng());
        }
      });
    }

    if (!window.google) {
      // If Google Maps API script is not already loaded, dynamically load it
      const script = document.createElement(messages.scriptText);
      const googleMapsApiUrl = apiUrls.googleMapsApi(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
      script.src = googleMapsApiUrl;
      script.async = true;
      script.defer = true;
      script.onload = initAutocomplete;
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    } else {
      initAutocomplete();
    }
  }, [setValue]);

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const placeholderText = messages.productOverviewPlaceholder;

  return (
    <Box className="admin-faq-wrapper">
      <Box sx={{ width: drawerOpen && !isSmallScreen ? "270px" : "0" }}>
        <AdminDashboard />
      </Box>
      <Box
        className="enterprise-content"
        sx={{
          width: drawerOpen ? "calc(100% - 270px)" : "100%",
          padding: "16px",
        }}
      >
        <Box className="admin-faq-heading">
          <Typography variant="h6">{messages.myEnterpriseProfileHeading}</Typography>
        </Box>
        <Grid container spacing={2} className="enterprise-profile">
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <InputLabel className={messages.enterpriseLabelClass}>
              {messages.enterpriseNameLabel}<sup className={messages.requiredIcon}>*</sup>
            </InputLabel>
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
                    className={messages.enterpriseInputFieldClass}
                    {...field}
                    type="outlined"
                    placeholder={messages.enterpriseNamePlaceholder}
                    fullWidth
                  />
                  {errors["EnterpriseName"] && (
                    <FormHelperText className={messages.createAdminEnterpriseErrorclass}>
                      {errors["EnterpriseName"].message}
                    </FormHelperText>
                  )}
                </div>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <InputLabel className={messages.enterpriseLabelClass}>
              {messages.enterprisePointOfContactLabel}<sup className={messages.requiredIcon}>*</sup>
            </InputLabel>
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
                    className={messages.enterpriseInputFieldClass}
                    {...field}
                    type="outlined"
                    placeholder={messages.enterprisePointOfContactPlaceholder}
                    fullWidth
                  />
                  {errors["EnterprisePointOfContact"] && (
                    <FormHelperText className={messages.createAdminEnterpriseErrorclass}>
                      {errors["EnterprisePointOfContact"].message}
                    </FormHelperText>
                  )}
                </div>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel className={messages.enterpriseLabelClass}>
              {messages.enterpriseAddressLabel}<sup className={messages.requiredIcon}>*</sup>
            </InputLabel>
            <Controller
              control={control}
              name="EnterpriseAddress"
              rules={{ required: messages.enterpriseAddressRequired }}
              render={({ field }) => (
                <div>
                  <TextareaAutosize
                    className="TextareaAutosize"
                    id={messages.addressElementId}
                    {...field}
                    placeholder={messages.enterpriseAddressPlaceholder}
                    onFocus={(e) => (e.target.style.outline = "none")}
                    onMouseOver={(e) =>
                      (e.target.style.backgroundColor = "none")
                    }
                    onMouseOut={(e) =>
                      (e.target.style.backgroundColor = "none")
                    }
                  />
                  {errors["EnterpriseAddress"] && (
                    <FormHelperText className={messages.createAdminEnterpriseErrorclass}>
                      {errors["EnterpriseAddress"].message}
                    </FormHelperText>
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
            <InputLabel className={messages.enterpriseLabelClass}>
              {messages.emailAddressLabel}<sup className={messages.requiredIcon}>*</sup>
            </InputLabel>
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
                    className={messages.enterpriseInputFieldClass}
                    {...field}
                    type="outlined"
                    placeholder={messages.enterpriseEmailAddressplaceholder}
                    fullWidth
                  />
                  {errors["EmailAddress"] && (
                    <FormHelperText className={messages.createAdminEnterpriseErrorclass}>
                      {errors["EmailAddress"].message}
                    </FormHelperText>
                  )}
                </div>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <InputLabel className={messages.enterpriseLabelClass}>
              {messages.phoneNumberLabel}<sup className={messages.requiredIcon}>*</sup>
            </InputLabel>
            <Controller
              control={control}
              name="PhoneNumber"
              rules={{
                required: {
                  value: true,
                  message: messages.enterprisePhoneNumberRequired,
                },
                pattern: {
                  value: phoneRegex,
                  message: messages.enterprisePhoneNumberValid,
                },
              }}
              render={({ field }) => (
                <div className="currentSignInPhone-style">
                  <ReactPhoneInput
                    className="enterprise-phone-input"
                    style={{
                      border: errors["PhoneNumber"]
                        ? "1px solid #ffc9c9"
                        : "1px solid #6fa8dd",
                    }}
                    inputExtraProps={{
                      name: field.name,
                      onBlur: field.onBlur,
                    }}
                    value={field.value}
                    preferredCountries={["us", "il", "gb", "ca", "mx"]}
                    placeholder="Phone number"
                    onChange={(value, country, event) => {
                      field.onChange(value);
                    }}
                    onBlur={() => field.onBlur()}
                    error={!!errors["PhoneNumber"]}
                  />
                  {errors["PhoneNumber"] && (
                    <FormHelperText className="phone-number-error">
                      {errors["PhoneNumber"].message}
                    </FormHelperText>
                  )}
                </div>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <InputLabel className={messages.enterpriseLabelClass}>{messages.websiteUrlLabel}</InputLabel>
            <Controller
              control={control}
              name="WebsiteUrl"
              render={({ field }) => (
                <div>
                  <TextField
                    className={messages.enterpriseInputFieldClass}
                    {...field}
                    type="outlined"
                    placeholder="Type website URL here"
                    fullWidth
                  />
                </div>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider className="table-devider"></Divider>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <InputLabel className={messages.enterpriseLabelClass}>
              {messages.whatsappPhoneNumberLabel}
            </InputLabel>
            <Controller
              control={control}
              name="WhatsappPhoneNumber"
              render={({ field }) => (
                <TextField
                  className={messages.enterpriseInputFieldClass}
                  {...field}
                  type="outlined"
                  placeholder="Type WhatsApp phone number here"
                  fullWidth
                  error={!!errors["WhatsappPhoneNumber"]}
                  helperText={
                    errors["WhatsappPhoneNumber"]
                      ? errors["WhatsappPhoneNumber"].message
                      : ""
                  }
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <InputLabel className={messages.enterpriseLabelClass}>
              {messages.instagramUsernameLabel}
            </InputLabel>
            <Controller
              control={control}
              name="InstagramUsername"
              render={({ field }) => (
                <TextField
                  className={messages.enterpriseInputFieldClass}
                  {...field}
                  type="outlined"
                  placeholder="Type Instagram username here"
                  fullWidth
                  error={!!errors["InstagramUsername"]}
                  helperText={
                    errors["InstagramUsername"]
                      ? errors["InstagramUsername"].message
                      : ""
                  }
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <InputLabel className={messages.enterpriseLabelClass}>
              {messages.linkedinUsernameLabel}
            </InputLabel>
            <Controller
              control={control}
              name="LinkedinUsername"
              render={({ field }) => (
                <TextField
                  className={messages.enterpriseInputFieldClass}
                  {...field}
                  type="outlined"
                  placeholder="Type LinkedIn username here"
                  fullWidth
                  error={!!errors["LinkedinUsername"]}
                  helperText={
                    errors["LinkedinUsername"]
                      ? errors["LinkedinUsername"].message
                      : ""
                  }
                />
              )}
            />
          </Grid>
          <Grid item xs={12} className="Enterprise-Description">
            <InputLabel className={messages.enterpriseLabelClass}>
              {messages.enterpriseDescriptionLabel}<sup className={messages.requiredIcon}>*</sup>
            </InputLabel>
            <Controller
              control={control}
              name="EnterpriseDescription"
              rules={{ required: "Enterprise Description is required" }}
              render={({ field }) => (
                <div>
                  <TextareaAutosize
                    className="TextareaAutosize"
                    {...field}
                    placeholder={placeholderText}
                    onFocus={(e) => (e.target.style.outline = "none")}
                    onMouseOver={(e) =>
                      (e.target.style.backgroundColor = "none")
                    }
                    onMouseOut={(e) =>
                      (e.target.style.backgroundColor = "none")
                    }
                  />
                  {errors["EnterpriseDescription"] && (
                    <FormHelperText className={messages.createAdminEnterpriseErrorclass}>
                      {errors["EnterpriseDescription"].message}
                    </FormHelperText>
                  )}
                </div>
              )}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={4}
            className="enterprise-profile-category"
          >
            <InputLabel className={messages.enterpriseLabelClass}>
              {messages.enterpriseCategoriesLabel}<sup className={messages.requiredIcon}>*</sup>
            </InputLabel>
            <FormControl
              fullWidth
              error={!!errors["EnterpriseCategories"]}
              required
            >
              <Controller
                name="EnterpriseCategories"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    {...field}
                    displayEmpty
                    className="EnterpriseCategorySelect marginBottom-10"
                  >
                    <MenuItem value="" disabled>
                      Select an Enterprise Category
                    </MenuItem>
                    {enterpriseCategories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <InputLabel className={messages.enterpriseLabelClass}>
              {messages.businessHoursOpeningTimeLabel}<sup className={messages.requiredIcon}>*</sup>
            </InputLabel>
            <Controller
              control={control}
              name="BusinessHoursOpeningTime"
              rules={{ required: "Business Hours Opening Time is required" }}
              render={({ field }) => (
                <div>
                  <TextField
                    className="enterprise-input-field enterprise-text-color"
                    {...field}
                    type="time"
                    placeholder="Office opening time"
                    fullWidth
                  />
                  {errors["BusinessHoursOpeningTime"] && (
                    <FormHelperText className={messages.createAdminEnterpriseErrorclass}>
                      {errors["BusinessHoursOpeningTime"].message}
                    </FormHelperText>
                  )}
                </div>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <InputLabel className={messages.enterpriseLabelClass}>
              {messages.businessHoursClosingTimeLabel}<sup className={messages.requiredIcon}>*</sup>
            </InputLabel>
            <Controller
              control={control}
              name="BusinessHoursClosingTime"
              rules={{ required: "Business Hours Closing Time is required" }}
              render={({ field }) => (
                <div>
                  <TextField
                    className="enterprise-input-field enterprise-text-color"
                    {...field}
                    type="time"
                    placeholder="Office closing time"
                    fullWidth
                  />
                  {errors.BusinessHoursClosingTime && (
                    <FormHelperText className={messages.createAdminEnterpriseErrorclass}>
                      {errors.BusinessHoursClosingTime.message}
                    </FormHelperText>
                  )}
                </div>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <InputLabel className={messages.enterpriseLabelClass}>
              {messages.foundedYearLabel}<sup className={messages.requiredIcon}>*</sup>
            </InputLabel>
            <Controller
              control={control}
              name="FoundedYear"
              rules={{ required: "Founded Year is required" }}
              render={({ field }) => (
                <div>
                  <TextField
                    className={messages.enterpriseInputFieldClass}
                    {...field}
                    type="outlined"
                    inputProps={{ maxLength: 4 }}
                    placeholder="Type founded year here"
                    fullWidth
                  />
                  {errors["FoundedYear"] && (
                    <FormHelperText className={messages.createAdminEnterpriseErrorclass}>
                      {errors["FoundedYear"].message}
                    </FormHelperText>
                  )}
                </div>
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider className="table-devider"></Divider>
          </Grid>
          <Grid item xs={12}>
            <InputLabel className={messages.enterpriseLabelClass}>
              {messages.frequentlyAskedQuestionsLabel}
            </InputLabel>
            <Controller
              control={control}
              name="FrequentlyAskedQuestions"
              render={({ field }) => (
                <TextareaAutosize
                  className="TextareaAutosize"
                  {...field}
                  placeholder="Type frequently asked questions (FAQs) here"
                  onFocus={(e) => (e.target.style.outline = "none")}
                  onMouseOver={(e) => (e.target.style.backgroundColor = "none")}
                  onMouseOut={(e) => (e.target.style.backgroundColor = "none")}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel className={messages.enterpriseLabelClass}>
              {messages.enterpriseIdentificationKeywordsLabel}
              <sup className={messages.requiredIcon}>*</sup>
            </InputLabel>
            <Controller
              control={control}
              name="EnterpriseIdentificationKeywords"
              render={({ field }) => (
                <div>
                  <TagsInput
                    className="TagsInput"
                    value={tags}
                    onChange={(newTags) => setTags(newTags)}
                    addKeys={[13, 9]}
                    placeholder={messages.enterpriseIdentificationKeywordsPlaceholderText}
                    inputProps={{
                      ...field,
                      value: tagInput,
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
                    {tags.map((tag, index) => (
                      <div
                        className="enterprise-tags"
                        key={`${tag}-${index}`}
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
                  {isSubmitted && !tags.length && (
                    <FormHelperText className={messages.createAdminEnterpriseErrorclass}>
                      At least one keyword is required
                    </FormHelperText>
                  )}
                  {!tags.length && (
                    <Typography className="enterprise-profile-description">
                      Enterprise identification keywords (press enter after each
                      keywords to register)
                    </Typography>
                  )}
                </div>
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="outlined"
              sx={{ marginY: { xs: "10px" } }}
              fullWidth
              className="button-style"
              onClick={
                enterpriseId !== null
                  ? handleSubmit(updateEnterpriseDetails)
                  : handleSubmit(createAdminEnterprise)
              }
              disabled={isLoading}
            >
              {enterpriseId !== null ? messages.saveChangesButtonText : messages.saveButtonText}
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Divider className="table-devider"></Divider>
          </Grid>

          <Box className="add-eventpadding">
            <Typography variant="h6" className="table-heading">
              Enterprise List
            </Typography>
          </Box>

          <Grid item xs={12}>
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
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="enterprise-headerCell">
                      Enterprise Name
                    </TableCell>
                    <TableCell className="enterprise-headerCell">
                      Enterprise point of contact
                    </TableCell>
                    <TableCell className="enterprise-headerCell">
                      Website URL
                    </TableCell>
                    <TableCell className="enterprise-headerCell">
                      Enterprise Categories
                    </TableCell>
                    <TableCell className="enterprise-headerCell">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {enterpriseList.length !== 0 ? (
                    Object.keys(enterpriseList).map((key) => {
                      const enterprise = enterpriseList[key];
                      return (
                        <TableRow key={key}>
                          <TableCell>{enterprise.enterpriseName}</TableCell>
                          <TableCell>{enterprise.contactPersonName}</TableCell>
                          <TableCell>
                            {enterprise.website ? enterprise.website : "NA"}
                          </TableCell>
                          <TableCell>{enterprise.categoryName}</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() =>
                                handleEditEnterprise(
                                  key,
                                  enterprise.enterpriseId,
                                  enterprise
                                )
                              }
                            >
                              <EditIcon className="color-white" />
                            </IconButton>
                            <IconButton
                              onClick={() =>
                                handleDeleteEnterprise(
                                  key,
                                  enterprise.enterpriseId,
                                  enterprise
                                )
                              }
                            >
                              <DeleteIcon className="color-white" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8}>No enterprise avilable</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
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
          </Grid>
        </Grid>
      </Box>
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

export default AdminCreateEnterprise;
