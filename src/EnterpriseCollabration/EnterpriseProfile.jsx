import React, { useContext, useState, useEffect } from 'react';
import { Box, Typography, Grid, TextField, InputLabel, Divider, Button, Snackbar, FormHelperText } from '@mui/material';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import EnterpriseDashboard from './EnterpriseDashboard';
import { useForm, Controller } from 'react-hook-form';
import 'react-tagsinput/react-tagsinput.css';
import TagsInput from 'react-tagsinput';
import { Context } from '../App';
import { FormControl, Select, MenuItem } from '@mui/material';
import axios from "axios";
import "./EnterpriseStyle.scss";
import { emailRegex, phoneRegex } from '../Utils/validations/validation';
import { CircularProgress } from '@mui/material';

const styles = {
  inputField: {
    backgroundColor: '#eaf5ff',
    border: '1px solid #6fa8dd',
    borderRadius: '8px',
    marginBottom: '16px',
    color: "#8bbae5",
    with: "100%"
  },
  label: {
    color: '#8bbae5',
    marginBottom: '8px',
  },
  tagsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '8px',
  },
  tag: {
    backgroundColor: '#6fa8dd',
    color: '#fff',
    borderRadius: '4px',
    padding: '4px 8px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  tagText: {
    marginRight: '8px',
  },
  removeTag: {
    cursor: 'pointer',
  },
  content: {
    flex: 1,
    padding: '16px',
    marginLeft: '0',
    transition: 'margin-left 0.3s',
  },
};

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
      ReligiousCertifications: enterpriseDetails.religiousCertification || "",
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

  // const keywords = useWatch({ control, name: 'EnterpriseIdentificationKeywords', defaultValue: [] });


  useEffect(() => {
    const fetchEnterpriseCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_HOST}/api/yanki-ai/get-enterprises-categories`
        );

        console.log('API Response:', response.data);

        if (response.status === 200) {
          setEnterpriseCategories(response.data);
        } else {
          console.error("Failed to fetch enterprise categories");
        }
      } catch (error) {
        console.error("Error:", error);
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
          console.error('Failed to fetch enterprise details');
        }
      } catch (error) {
      }
    };

    fetchEnterpriseDetails();
  }, []);


  useEffect(() => {
    setValue("EnterpriseName", enterpriseDetails.enterpriseName || "");
    setValue("EnterprisePointOfContact", enterpriseDetails.contactPersonName || "");
    setValue("EnterpriseAddress", enterpriseDetails.enterpriseAddress || "");
    setValue("EmailAddress", enterpriseDetails.enterpriseEmail || "");
    setValue("PhoneNumber", enterpriseDetails.enterprisePhoneNumber || "");
    setValue("WebsiteUrl", enterpriseDetails.website || "");
    setValue("WhatsappPhoneNumber", enterpriseDetails.whatsAppPhoneNumber || "");
    setValue("InstagramUsername", enterpriseDetails.instagramUsername || "");
    setValue("LinkedinUsername", enterpriseDetails.linkedInUsername || "");
    setValue("EnterpriseDescription", enterpriseDetails.enterpriseDescription || "");
    setValue("EnterpriseCategories", enterpriseDetails.categoryId || "");
    setValue("BusinessHoursOpeningTime", enterpriseDetails.officeOpenTime || "");
    setValue("BusinessHoursClosingTime", enterpriseDetails.officeCloseTime || "");
    setValue("FoundedYear", enterpriseDetails.foundedYear || "");
    setValue("ReligiousCertifications", enterpriseDetails.religiousCertification || "");
    setValue("FrequentlyAskedQuestions", enterpriseDetails.faQs || "");

    if (enterpriseDetails.enterpriseKeywords) {
      const keywordsArray = enterpriseDetails.enterpriseKeywords.split(',');
      console.log("keywordsArray", keywordsArray);
      setTags(keywordsArray);
      setValue("EnterpriseIdentificationKeywords", keywordsArray || []);
    }
  }, [enterpriseDetails, setValue]);

  const checkEnterpriseKeyword = async (tag) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_HOST}/api/yanki-ai/check-enterprise-keyword/${tag}`
      );

      console.log('Keyword Check Response:', response.data);

      if (response.status === 200) {
        const keywordExists = response.data.exists;

        if (keywordExists !== undefined) {
          console.log("keywordExists", keywordExists);

          if (keywordExists) {
            console.log('Keyword already exists:', tag);
          } else {
            console.log('Keyword does not exist:', tag);

            setTags((prevTags) => [...prevTags, tag]);
          }
        } else {
          console.log('Keyword existence is undefined for:', tag);
        }
      } else {
        console.error('Failed to check enterprise keyword');
      }
      return response.data;
    } catch (error) {
      console.error('Error checking enterprise keyword:', error);
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

        // setIsTagAvailable(response.isAvailable);

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
        console.error('Failed to check enterprise keyword');
        setSnackbarMessage('Failed to check enterprise keyword');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error handling tag:', error);
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
          enterpriseId: enterpriseDetails.enterpriseId,
          enterpriseName: formData.EnterpriseName,
          categoryId: selectedCategory || formData.EnterpriseCategories,
          contactPersonName: formData.EnterprisePointOfContact,
          website: formData.WebsiteUrl,
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
          religiousCertification: formData.ReligiousCertifications,
          faQs: formData.FrequentlyAskedQuestions,
          enterpriseKeywords: tagsAsString,
        }
      );

      console.log('Update Enterprise Details Response:', response.data);

      if (response.status === 200) {
        console.log('Enterprise details updated successfully');
        if (departmentsData.length === 0) {
          setSnackbarMessage('Enterprise details updated successfully. You can now start adding departments');
        } else {
          setSnackbarMessage('Enterprise details updated successfully');
        }
        setSnackbarOpen(true);
        // setIsButtonClick(true)
        window.location.reload();
      } else {
        console.error('Failed to update enterprise details');
        setSnackbarMessage('Failed to update enterprise details');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error updating enterprise details:', error);
    }
  };

  const contentMargin = drawerOpen ? '0' : '0';

  const placeholderText = `Product Overview:
• Could you please provide an overview of the products you offer?
• What are the key features and benefits of your products?

Service Offerings:
• What services does your enterprise provide, and what’s the market you’re focusing?
• Are there any unique or specialized services that your enterprise offers?
`;

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#fff' }}>
      <Box sx={{ width: drawerOpen ? '270px' : "0" }}>
        <EnterpriseDashboard />
      </Box>
      <Box style={{ ...styles.content, marginLeft: contentMargin }} className="enterpriseFormBox" sx={{ width: drawerOpen ? 'calc(100% - 270px)' : "100%", marginTop: '70px', padding: '16px' }}>
        <Typography variant="h6" sx={{ paddingBottom: '16px', color: '#6fa8dd' }}>
          My Enterprise Profile
        </Typography>
        <Grid container spacing={2} className='enterprise-profile'>
          <Grid item xs={12} sm={12} md={6} lg={4} style={styles.gridItem}>
            <InputLabel style={styles.label}>Enterprise Name<sup style={{ color: "red", fontSize: "18px", fontWeight: "600", }}>*</sup></InputLabel>
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
                  value: 20,
                  message: "Enterprise name should not exceed 20 characters.",
                },
              }}
              render={({ field }) => (
                <div>
                  <TextField
                    sx={{ ...styles.inputField }}
                    {...field}
                    type="outlined"
                    placeholder="Type enterprise name here"
                    fullWidth
                  // error={!!errors['EnterpriseName']}
                  // helperText={errors['EnterpriseName'] ? errors['EnterpriseName'].message : ''}
                  />
                  {errors['EnterpriseName'] && (
                    <FormHelperText style={{ color: 'red' }}>{errors['EnterpriseName'].message}</FormHelperText>
                  )}
                </div>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} style={styles.gridItem}>
            <InputLabel style={styles.label}>Enterprise point of contact<sup style={{ color: "red", fontSize: "18px", fontWeight: "600", }}>*</sup></InputLabel>
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
                  value: 20,
                  message: "Enterprise Point Of Contact should not exceed 20 characters.",
                },
              }}
              render={({ field }) => (
                <div>
                  <TextField
                    sx={styles.inputField}
                    {...field}
                    type="outlined"
                    placeholder="Enterprise point of contact name"
                    fullWidth
                  // error={!!errors['EnterprisePointOfContact']}
                  // helperText={errors['EnterprisePointOfContact'] ? errors['EnterprisePointOfContact'].message : ''}
                  />
                  {errors['EnterprisePointOfContact'] && (
                    <FormHelperText style={{ color: 'red' }}>{errors['EnterprisePointOfContact'].message}</FormHelperText>
                  )}
                </div>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel style={styles.label}>Enterprise address<sup style={{ color: "red", fontSize: "18px", fontWeight: "600", }}>*</sup></InputLabel>
            <Controller
              control={control}
              name="EnterpriseAddress"
              rules={{ required: "Enterprise Address is required" }}
              render={({ field }) => (
                <div>
                  <TextareaAutosize
                    style={{
                      backgroundColor: '#eaf5ff',
                      border: '1px solid #6fa8dd',
                      borderRadius: '8px',
                      marginBottom: '16px',
                      color: "#8bbae5", width: '100%', minHeight: "15%", padding: "15px", fontSize: "16px",
                    }}
                    {...field}
                    placeholder="Type enterprise address here"
                    onFocus={(e) => e.target.style.outline = 'none'}
                    onMouseOver={(e) => e.target.style.backgroundColor = 'none'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'none'}
                  />
                  {errors['EnterpriseAddress'] && (
                    <FormHelperText style={{ color: 'red' }}>{errors['EnterpriseAddress'].message}</FormHelperText>
                  )}
                </div>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} style={styles.gridItem}>
            <InputLabel style={styles.label}>Email Address<sup style={{ color: "red", fontSize: "18px", fontWeight: "600", }}>*</sup></InputLabel>
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
                    sx={{ ...styles.inputField }}
                    {...field}
                    type="outlined"
                    placeholder="Type email address here"
                    fullWidth
                  // error={!!errors['EmailAddress']}
                  // helperText={errors['EmailAddress'] ? errors['EmailAddress'].message : ''}
                  />
                  {errors['EmailAddress'] && (
                    <FormHelperText style={{ color: 'red' }}>{errors['EmailAddress'].message}</FormHelperText>
                  )}
                </div>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} style={styles.gridItem}>
            <InputLabel style={styles.label}>Phone Number<sup style={{ color: "red", fontSize: "18px", fontWeight: "600", }}>*</sup></InputLabel>
            <Controller
              control={control}
              name="PhoneNumber"
              rules={{
                required: {
                  value: true,
                  message: "Phone number is required.",
                },
                pattern: {
                  value: phoneRegex,
                  message: "Invalid phone number format.",
                },
              }}
              render={({ field }) => (
                <div>
                  <TextField
                    sx={{ ...styles.inputField }}
                    {...field}
                    type="outlined"
                    placeholder="Type phone number here"
                    fullWidth
                  // error={!!errors['PhoneNumber']}
                  // helperText={errors['PhoneNumber'] ? errors['PhoneNumber'].message : ''}
                  />
                  {errors['PhoneNumber'] && (
                    <FormHelperText style={{ color: 'red' }}>{errors['PhoneNumber'].message}</FormHelperText>
                  )}
                </div>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} style={styles.gridItem}>
            <InputLabel style={styles.label}>Website URL<sup style={{ color: "red", fontSize: "18px", fontWeight: "600", }}>*</sup></InputLabel>
            <Controller
              control={control}
              name="WebsiteUrl"
              rules={{ required: "Website URL is required" }}
              render={({ field }) => (
                <div>
                  <TextField
                    sx={{ ...styles.inputField }}
                    {...field}
                    type="outlined"
                    placeholder="Type website URL here"
                    fullWidth
                  // error={!!errors['WebsiteUrl']}
                  // helperText={errors['WebsiteUrl'] ? errors['WebsiteUrl'].message : ''}
                  />
                  {errors['WebsiteUrl'] && (
                    <FormHelperText style={{ color: 'red' }}>{errors['WebsiteUrl'].message}</FormHelperText>
                  )}
                </div>
              )}
            />
          </Grid>
          <Grid item xs={12}><Divider sx={{ marginY: "20px", background: "#8bbae5", }}></Divider></Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} style={styles.gridItem}>
            <InputLabel style={styles.label}>WhatsApp Phone Number</InputLabel>
            <Controller
              control={control}
              name="WhatsappPhoneNumber"
              render={({ field }) => (
                <TextField
                  sx={{ ...styles.inputField }}
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
          <Grid item xs={12} sm={12} md={6} lg={4} style={styles.gridItem}>
            <InputLabel style={styles.label}>Instagram Username</InputLabel>
            <Controller
              control={control}
              name="InstagramUsername"
              render={({ field }) => (
                <TextField
                  sx={{ ...styles.inputField }}
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
          <Grid item xs={12} sm={12} md={6} lg={4} style={styles.gridItem}>
            <InputLabel style={styles.label}>LinkedIn Username</InputLabel>
            <Controller
              control={control}
              name="LinkedinUsername"
              render={({ field }) => (
                <TextField
                  sx={{ ...styles.inputField }}
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
            <InputLabel style={styles.label}>Enterprise Description<sup style={{ color: "red", fontSize: "18px", fontWeight: "600", }}>*</sup></InputLabel>
            <Controller
              control={control}
              name="EnterpriseDescription"
              rules={{ required: "Enterprise Description is required" }}
              render={({ field }) => (
                <div>
                  <TextareaAutosize
                    style={{
                      backgroundColor: '#eaf5ff',
                      border: '1px solid #6fa8dd',
                      borderRadius: '8px',
                      marginBottom: '16px',
                      color: "#8bbae5", width: '100%', minHeight: "15%", padding: "15px", fontSize: "16px",fontFamily: "unset",textTransform: "none",
                    }}
                    {...field}
                    placeholder={placeholderText}
                    onFocus={(e) => e.target.style.outline = 'none'}
                    onMouseOver={(e) => e.target.style.backgroundColor = 'none'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'none'}
                  />
                  {errors['EnterpriseDescription'] && (
                    <FormHelperText style={{ color: 'red' }}>{errors['EnterpriseDescription'].message}</FormHelperText>
                  )}
                </div>
              )}
            />

          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} style={styles.gridItem} className='enterprise-profile-category'>
            <InputLabel style={styles.label}>Enterprise Categories<sup style={{ color: "red", fontSize: "18px", fontWeight: "600", }}>*</sup></InputLabel>
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
                    sx={{ ...styles.inputField }}
                    className='EnterpriseCategorySelect'
                  >
                    <MenuItem value="" disabled>
                      {enterpriseDetails.categoryName}
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
                <FormHelperText style={{ color: 'red' }}>
                  {errors['EnterpriseCategories'].message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} style={styles.gridItem}>
            <InputLabel style={styles.label}>Business Hours Opening Time<sup style={{ color: "red", fontSize: "18px", fontWeight: "600", }}>*</sup></InputLabel>
            <Controller
              control={control}
              name="BusinessHoursOpeningTime"
              rules={{ required: "Business Hours Opening Time is required" }}
              render={({ field }) => (
                <div>
                  <TextField
                    sx={{ ...styles.inputField }}
                    {...field}
                    // type="outlined"
                    type="time"
                    placeholder="Office opening time"
                    fullWidth
                  // error={!!errors['BusinessHoursOpeningTime']}
                  // helperText={errors['BusinessHoursOpeningTime'] ? errors['BusinessHoursOpeningTime'].message : ''}
                  />
                  {errors['BusinessHoursOpeningTime'] && (
                    <FormHelperText style={{ color: 'red' }}>{errors['BusinessHoursOpeningTime'].message}</FormHelperText>
                  )}
                </div>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} style={styles.gridItem}>
            <InputLabel style={styles.label}>Business Hours Closing Time<sup style={{ color: "red", fontSize: "18px", fontWeight: "600", }}>*</sup></InputLabel>
            <Controller
              control={control}
              name="BusinessHoursClosingTime"
              rules={{ required: "Business Hours Closing Time is required" }}
              render={({ field }) => (
                <div>
                  <TextField
                    sx={{ ...styles.inputField }}
                    {...field}
                    type="time"
                    placeholder="Office closing time"
                    fullWidth
                  // error={!!errors['BusinessHoursClosingTime']}
                  // helperText={errors['BusinessHoursClosingTime'] ? errors['BusinessHoursClosingTime'].message : ''}
                  />
                  {errors.BusinessHoursClosingTime && (
                    <FormHelperText style={{ color: 'red' }}>{errors.BusinessHoursClosingTime.message}</FormHelperText>
                  )}
                </div>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} style={styles.gridItem}>
            <InputLabel style={styles.label}>Founded Year<sup style={{ color: "red", fontSize: "18px", fontWeight: "600", }}>*</sup></InputLabel>
            <Controller
              control={control}
              name="FoundedYear"
              rules={{ required: "Founded Year is required" }}
              render={({ field }) => (
                <div>
                  <TextField
                    sx={{ ...styles.inputField }}
                    {...field}
                    type="outlined"
                    inputProps={{ maxLength: 4 }}
                    placeholder="Type founded year here"
                    fullWidth
                  // error={!!errors['FoundedYear']}
                  // helperText={errors['FoundedYear'] ? errors['FoundedYear'].message : ''}
                  />
                  {errors['FoundedYear'] && (
                    <FormHelperText style={{ color: 'red' }}>{errors['FoundedYear'].message}</FormHelperText>
                  )}
                </div>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} style={styles.gridItem}>
            <InputLabel style={styles.label}>Religious Certifications<sup style={{ color: "red", fontSize: "18px", fontWeight: "600", }}>*</sup></InputLabel>
            <Controller
              control={control}
              name="ReligiousCertifications"
              rules={{ required: "Religious Certifications is required" }}
              render={({ field }) => (
                <div>
                  <TextField
                    sx={{ ...styles.inputField }}
                    {...field}
                    type="outlined"
                    placeholder="Kosher or any other"
                    fullWidth
                  // error={!!errors['ReligiousCertifications']}
                  // helperText={errors['ReligiousCertifications'] ? errors['ReligiousCertifications'].message : ''}
                  />
                  {errors['ReligiousCertifications'] && (
                    <FormHelperText style={{ color: 'red' }}>{errors['ReligiousCertifications'].message}</FormHelperText>
                  )}
                </div>
              )}
            />
          </Grid>
          <Grid item xs={12}><Divider sx={{ marginY: "20px", background: "#8bbae5", }}></Divider></Grid>
          <Grid item xs={12}>
            <InputLabel style={styles.label}>Frequently Asked Questions (FAQs)</InputLabel>
            <Controller
              control={control}
              name="FrequentlyAskedQuestions"
              render={({ field }) => (
                <TextareaAutosize
                  style={{
                    backgroundColor: '#eaf5ff',
                    border: '1px solid #6fa8dd',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    color: "#8bbae5", width: '100%', minHeight: "15%", padding: "15px", fontSize: "16px",
                  }}
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
            <InputLabel style={styles.label}>Enterprise identification keywords<sup style={{ color: "red", fontSize: "18px", fontWeight: "600", }}>*</sup></InputLabel>
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
                    inputProps={{
                      style: {
                        backgroundColor: '#eaf5ff',
                        border: '1px solid #6fa8dd',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        color: '#8bbae5',
                        width: '100%',
                        outline: 'none',
                        height: "60px",
                      },
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
                  <div style={styles.tagsContainer}>
                    {tags.map((tag, index) => (
                      <div key={`${tag}-${index}`} style={{
                        ...styles.tag,
                        backgroundColor: tag === tagInput ? '#ff7070' : '#6fa8dd',
                      }}>
                        <span style={styles.tagText}>{tag}</span>
                        <span
                          style={styles.removeTag}
                          onClick={() => handleRemoveTag(tag)}
                        >
                          &times;
                        </span>
                      </div>
                    ))}
                  </div>
                  {isSubmitted && !tags.length && (
                    <FormHelperText style={{ color: 'red', fontSize: '12px', margin: 0 }}>
                      At least one keyword is required
                    </FormHelperText>
                  )}
                </div>
              )}
            />
          </Grid>
          <Grid item xs={3}>
            {(isButtonClick || selectedCategory) ? <Button
              variant="outlined"
              sx={{ marginY: { xs: '10px' } }}
              fullWidth
              style={{ backgroundColor: '#13538b', color: 'lightblue' }}
              onClick={handleSubmit(updateEnterpriseDetails)}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} style={{ color: "#fff", }} /> : 'Save'}
            </Button> : <Button
              variant="outlined"
              sx={{ marginY: { xs: '10px' } }}
              fullWidth
              style={{ backgroundColor: '#13538b', color: 'lightblue' }}
              onClick={handleSubmit(updateEnterpriseDetails)}
              disabled={!isDirty || isLoading}
            >
              {isLoading ? <CircularProgress size={24} style={{ color: "#fff", }} /> : 'Save'}
            </Button>}
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box >
  );
};

export default EnterpriseProfile;
