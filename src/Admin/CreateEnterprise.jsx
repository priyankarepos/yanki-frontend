import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, InputLabel, Snackbar, useMediaQuery, Grid, FormHelperText, TextareaAutosize, Divider } from '@mui/material';
import AdminDashboard from './AdminDashboard';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import 'react-tagsinput/react-tagsinput.css';
import TagsInput from 'react-tagsinput';
import { Context } from '../App';
import { FormControl, Select, MenuItem } from '@mui/material';
import { emailRegex, phoneRegex } from '../Utils/validations/validation';
import ConfirmDialog from '../EnterpriseCollabration/ConfirmDialog';
import "../EnterpriseCollabration/EnterpriseStyle.scss";
import ReactPhoneInput from 'react-phone-input-2';

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

const AdminCreateEnterprise = () => {
    const { drawerOpen } = useContext(Context);
    const [isLoading, setIsLoading] = useState(false);
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [selectedCategory, setSelectedCategory] = useState("");
    const [enterpriseDetails, setEnterpriseDetails] = useState({});
    const [enterpriseList, setEnterpriseList] = useState({});
    const [enterpriseCategories, setEnterpriseCategories] = useState([]);
    const [tagCount, setTagCount] = useState(0);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [enterpriseId, setEnterpriseId] = useState(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [confirmationText, setConfirmationText] = useState('');


    const getEnterpriseDetails = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `${process.env.REACT_APP_API_HOST}/api/yanki-ai/get-enterprise-details`
            );

            if (response.status === 200) {
                const responseData = response.data;
                setEnterpriseDetails(responseData);
                setEnterpriseList(responseData)

            } else {
                setSnackbarMessage('Failed to fetch enterprise details');
                setSnackbarOpen(true);
            }
        } catch (error) {
            setSnackbarMessage('Error fetching enterprise details:', error);
            setSnackbarOpen(true);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        getEnterpriseDetails();
    }, []);

    useEffect(() => {
        const fetchEnterpriseCategories = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_HOST}/api/yanki-ai/get-enterprises-categories`
                );

                if (response.status === 200) {
                    setEnterpriseCategories(response.data);
                } else {
                    setSnackbarMessage("Failed to fetch enterprise categories");
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

            if (data.BusinessHoursOpeningTime === data.BusinessHoursClosingTime) {
                validationErrors.BusinessHoursClosingTime =
                    'Opening and closing times cannot be the same';
            }

            return validationErrors;
        },
    });

    const checkEnterpriseKeyword = async (tag) => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_HOST}/api/yanki-ai/check-enterprise-keyword/${tag}`
            );

            if (response.status === 200) {
                const keywordExists = response.data.exists;

                if (keywordExists !== undefined) {
                    if (keywordExists) {
                        setSnackbarMessage('Keyword already exists:', tag);
                        setSnackbarOpen(true);
                    } else {

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

    };

    useEffect(() => {
        setTagCount(tags.length);
    }, [tags]);

    const createAdminEnterprise = async () => {
        try {
            setIsLoading(true);

            const formData = getValues();
            const tagsAsString = tags.join(',');
            const response = await axios.post(
                `${process.env.REACT_APP_API_HOST}/api/yanki-ai/admin-create-enterprise`,
                {
                    enterpriseName: formData.EnterpriseName,
                    categoryId: selectedCategory || formData.EnterpriseCategories,
                    contactPersonName: formData.EnterprisePointOfContact,
                    website: formData.WebsiteUrl ? formData.WebsiteUrl : "",
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
                    isProfileCompleted: false,
                }
            );

            if (response.status === 200) {
                if (departmentsData.length === 0) {
                    setSnackbarMessage('Enterprise details created successfully.');
                    setSnackbarOpen(true);
                } else {
                    setSnackbarMessage('Enterprise details created successfully');
                    setSnackbarOpen(true);
                }
                setSnackbarOpen(true);
                getEnterpriseDetails();
            } else {
                setSnackbarMessage('Failed to create enterprise details');
                setSnackbarOpen(true);
            }
        } catch (error) {
            setSnackbarMessage('Error creating enterprise details:', error);
            setSnackbarOpen(true);
        } finally {
            setIsLoading(false);
        }
    };


    const departmentsData = JSON.parse(sessionStorage.getItem('departmentsData')) || [];

    const handleEditEnterprise = (key, enterpriseId, enterprise) => {
        setEnterpriseId(enterpriseId)
        setValue("EnterpriseName", enterprise.enterpriseName || "");
        setValue("EnterprisePointOfContact", enterprise.contactPersonName || "");
        setValue("EnterpriseAddress", enterprise.enterpriseAddress || "");
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
        setValue("ReligiousCertifications", enterprise.religiousCertification || "");
        setValue("FrequentlyAskedQuestions", enterprise.faQs || "");

        if (enterprise.enterpriseKeywords) {
            const keywordsArray = enterprise.enterpriseKeywords.split(',');
            setTags(keywordsArray);
            setValue("EnterpriseIdentificationKeywords", keywordsArray || []);
        }
    };

    const handleDeleteEnterprise = (key, enterpriseId) => {
        setEnterpriseId(enterpriseId)
        setConfirmDialogOpen(true);
        setConfirmationText(`Are you sure you want to delete the enterprise "${enterpriseList[key].enterpriseName}"?`);
    };

    const handleConfirmDelete = async () => {
        setConfirmDialogOpen(false);
        try {
            const response = await axios.delete(
                `${process.env.REACT_APP_API_HOST}/api/yanki-ai/admin-delete-enterprise/${enterpriseId}`
            );
            if (response.status === 200) {
                getEnterpriseDetails()
            } else {
                setSnackbarMessage('Failed to delete enterprise');
                setSnackbarOpen(true);
            }
        } catch (error) {
            setSnackbarMessage('Error deleting enterprise:', error);
                setSnackbarOpen(true);
        }
    };

    const updateEnterpriseDetails = async () => {
        try {
            setIsLoading(true);
            const formData = getValues();
            const tagsAsString = tags.join(',');
            const requestBody = {
                enterpriseId: enterpriseId,
                enterpriseName: formData.EnterpriseName,
                categoryId: selectedCategory || formData.EnterpriseCategories,
                contactPersonName: formData.EnterprisePointOfContact,
                website: formData.WebsiteUrl ? formData.WebsiteUrl : "",
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
            };
            const response = await axios.put(
                `${process.env.REACT_APP_API_HOST}/api/yanki-ai/update-enterprise-details`,
                requestBody
            );
            if (response.status === 200) {
                if (departmentsData.length === 0) {
                    setSnackbarMessage('Enterprise details updated successfully.');
                } else {
                    setSnackbarMessage('Enterprise details updated successfully');
                }
                setSnackbarOpen(true);
                getEnterpriseDetails();
            } else {
                setSnackbarMessage('Failed to update enterprise details');
                setSnackbarOpen(true);
            }
        } catch (error) {
            setSnackbarMessage('Error updating enterprise details:', error);
            setSnackbarOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
    const contentMargin = drawerOpen ? '0' : '0';

    const placeholderText = `Product Overview:
    • Could you please provide an overview of the products you offer?
    • What are the key features and benefits of your products?
    
    Service Offerings:
    • What services does your enterprise provide, and what’s the market you’re focusing?
    • Are there any unique or specialized services that your enterprise offers?
    `;

    return (
        <Box className="admin-faq-wrapper">
            <Box sx={{ width: drawerOpen && !isSmallScreen ? '270px' : "0" }}><AdminDashboard /></Box>
            <Box style={{ ...styles.content, marginLeft: contentMargin }} sx={{ width: drawerOpen ? 'calc(100% - 270px)' : "100%", padding: '16px' }}>
            <Box className="admin-faq-heading">
                    <Typography variant="h6">
                    My Enterprise Profile
                    </Typography>
                </Box>
                <Grid container spacing={2} className='enterprise-profile'>
                    <Grid item xs={12} sm={12} md={6} lg={4} style={styles.gridItem}>
                        <InputLabel style={styles.label}>Enterprise Name<sup className="required-icon">*</sup></InputLabel>
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
                                        sx={{ ...styles.inputField }}
                                        {...field}
                                        type="outlined"
                                        placeholder="Type enterprise name here"
                                        fullWidth
                                    />
                                    {errors['EnterpriseName'] && (
                                        <FormHelperText className='error-message'>{errors['EnterpriseName'].message}</FormHelperText>
                                    )}
                                </div>
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4} style={styles.gridItem}>
                        <InputLabel style={styles.label}>Enterprise point of contact<sup className="required-icon">*</sup></InputLabel>
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
                                        sx={styles.inputField}
                                        {...field}
                                        type="outlined"
                                        placeholder="Enterprise point of contact name"
                                        fullWidth
                                    />
                                    {errors['EnterprisePointOfContact'] && (
                                        <FormHelperText className='error-message'>{errors['EnterprisePointOfContact'].message}</FormHelperText>
                                    )}
                                </div>
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <InputLabel style={styles.label}>Enterprise address<sup className="required-icon">*</sup></InputLabel>
                        <Controller
                            control={control}
                            name="EnterpriseAddress"
                            rules={{ required: "Enterprise Address is required" }}
                            render={({ field }) => (
                                <div>
                                    <TextareaAutosize
                                        className='TextareaAutosize'
                                        {...field}
                                        placeholder="Type enterprise address here"
                                        onFocus={(e) => e.target.style.outline = 'none'}
                                        onMouseOver={(e) => e.target.style.backgroundColor = 'none'}
                                        onMouseOut={(e) => e.target.style.backgroundColor = 'none'}
                                    />
                                    {errors['EnterpriseAddress'] && (
                                        <FormHelperText className='error-message'>{errors['EnterpriseAddress'].message}</FormHelperText>
                                    )}
                                </div>
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4} style={styles.gridItem}>
                        <InputLabel style={styles.label}>Email Address<sup className="required-icon">*</sup></InputLabel>
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
                                    />
                                    {errors['EmailAddress'] && (
                                        <FormHelperText className='error-message'>{errors['EmailAddress'].message}</FormHelperText>
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
                            }}
                            render={({ field }) => (
                                <div style={{ marginBottom: '16px', position: 'relative' }}>
                                    <ReactPhoneInput
                                        style={{
                                            border: errors["PhoneNumber"] ? '1px solid #ffc9c9' : '1px solid #6fa8dd',
                                            backgroundColor: '#eaf5ff',
                                            borderRadius: '8px',
                                            marginBottom: '16px',
                                            color: "#8bbae5",
                                            with: "100%",
                                            height: '55px',
                                            lineHeight: "52px",
                                        }}
                                        inputExtraProps={{
                                            name: field.name,
                                            onBlur: field.onBlur,
                                        }}
                                        value={field.value}
                                        preferredCountries={['us', 'il', 'gb', 'ca', 'mx']}
                                        placeholder="Phone number"
                                        onChange={(value, country, event) => {
                                            field.onChange(value);
                                        }}
                                        onBlur={() => field.onBlur()}
                                        error={!!errors["PhoneNumber"]}
                                    />
                                    {errors['PhoneNumber'] && (
                                        <FormHelperText
                                            style={{
                                                color: '#ffc9c9',
                                            }}
                                        >
                                            {errors['PhoneNumber'].message}
                                        </FormHelperText>
                                    )}
                                </div>
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4} style={styles.gridItem}>
                        <InputLabel style={styles.label}>Website URL</InputLabel>
                        <Controller
                            control={control}
                            name="WebsiteUrl"
                            render={({ field }) => (
                                <div>
                                    <TextField
                                        sx={{ ...styles.inputField }}
                                        {...field}
                                        type="outlined"
                                        placeholder="Type website URL here"
                                        fullWidth
                                    />
                                </div>
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}><Divider className='table-devider'></Divider></Grid>
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
                        <InputLabel style={styles.label}>Enterprise Description<sup className="required-icon">*</sup></InputLabel>
                        <Controller
                            control={control}
                            name="EnterpriseDescription"
                            rules={{ required: "Enterprise Description is required" }}
                            render={({ field }) => (
                                <div>
                                    <TextareaAutosize
                                        className='TextareaAutosize'
                                        {...field}
                                        placeholder={placeholderText}
                                        onFocus={(e) => e.target.style.outline = 'none'}
                                        onMouseOver={(e) => e.target.style.backgroundColor = 'none'}
                                        onMouseOut={(e) => e.target.style.backgroundColor = 'none'}
                                    />
                                    {errors['EnterpriseDescription'] && (
                                        <FormHelperText className='error-message'>{errors['EnterpriseDescription'].message}</FormHelperText>
                                    )}
                                </div>
                            )}
                        />

                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4} style={styles.gridItem} className='enterprise-profile-category'>
                        <InputLabel style={styles.label}>Enterprise Categories<sup className="required-icon">*</sup></InputLabel>
                        <FormControl fullWidth error={!!errors['EnterpriseCategories']} required>
                            <Select
                                value={selectedCategory}
                                onChange={(event) => setSelectedCategory(event.target.value)}
                                displayEmpty
                                sx={{ marginBottom: "10px" }}
                                className='EnterpriseCategorySelect'
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
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4} style={styles.gridItem}>
                        <InputLabel style={styles.label}>Business Hours Opening Time<sup className="required-icon">*</sup></InputLabel>
                        <Controller
                            control={control}
                            name="BusinessHoursOpeningTime"
                            rules={{ required: "Business Hours Opening Time is required" }}
                            render={({ field }) => (
                                <div>
                                    <TextField
                                        sx={{ ...styles.inputField }}
                                        {...field}
                                        type="time"
                                        placeholder="Office opening time"
                                        fullWidth
                                    />
                                    {errors['BusinessHoursOpeningTime'] && (
                                        <FormHelperText className='error-message'>{errors['BusinessHoursOpeningTime'].message}</FormHelperText>
                                    )}
                                </div>
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4} style={styles.gridItem}>
                        <InputLabel style={styles.label}>Business Hours Closing Time<sup className="required-icon">*</sup></InputLabel>
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
                                    />
                                    {errors.BusinessHoursClosingTime && (
                                        <FormHelperText className='error-message'>{errors.BusinessHoursClosingTime.message}</FormHelperText>
                                    )}
                                </div>
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4} style={styles.gridItem}>
                        <InputLabel style={styles.label}>Founded Year<sup className="required-icon">*</sup></InputLabel>
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
                                    />
                                    {errors['FoundedYear'] && (
                                        <FormHelperText className='error-message'>{errors['FoundedYear'].message}</FormHelperText>
                                    )}
                                </div>
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4} style={styles.gridItem}>
                        <InputLabel style={styles.label}>Religious Certifications<sup className="required-icon">*</sup></InputLabel>
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
                                    />
                                    {errors['ReligiousCertifications'] && (
                                        <FormHelperText className='error-message'>{errors['ReligiousCertifications'].message}</FormHelperText>
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
                                    className='TextareaAutosize'
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
                        <InputLabel style={styles.label}>Enterprise identification keywords<sup className="required-icon">*</sup></InputLabel>
                        <Controller
                            control={control}
                            name="EnterpriseIdentificationKeywords"
                            render={({ field }) => (
                                <div>
                                    <TagsInput
                                        className='TagsInput'
                                        value={tags}
                                        onChange={(newTags) => setTags(newTags)}
                                        addKeys={[13, 9]}
                                        placeholder="Type Enterprise identification keywords here"
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
                                        <FormHelperText className='error-message'>
                                            At least one keyword is required
                                        </FormHelperText>
                                    )}
                                    {!tags.length && <Typography style={{ color: "gray" }}>Enterprise identification keywords (press enter after each keywords to register)</Typography>}
                                </div>
                            )}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Button
                            variant="outlined"
                            sx={{ marginY: { xs: '10px' } }}
                            fullWidth
                            className='button-style'
                            onClick={enterpriseId !== null ? handleSubmit(updateEnterpriseDetails) : handleSubmit(createAdminEnterprise)}
                            disabled={isLoading}
                        >
                            {enterpriseId !== null ? "Save Changes" : "Save"}
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={styles.cell}>Enterprise Name</TableCell>
                                        <TableCell style={styles.cell}>Enterprise point of contact</TableCell>
                                        <TableCell style={styles.cell}>Website URL</TableCell>
                                        <TableCell style={styles.cell}>Enterprise Categories</TableCell>
                                        <TableCell style={styles.cell}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {enterpriseList && Object.keys(enterpriseList).map((key) => {
                                        const enterprise = enterpriseList[key];
                                        return (
                                            <TableRow key={key}>
                                                <TableCell style={styles.cell}>{enterprise.enterpriseName}</TableCell>
                                                <TableCell style={styles.cell}>{enterprise.contactPersonName}</TableCell>
                                                <TableCell style={styles.cell}>
                                                    {enterprise.website ? enterprise.website : "NA"}
                                                </TableCell>
                                                <TableCell style={styles.cell}>{enterprise.categoryName}</TableCell>
                                                <TableCell style={styles.cell}>
                                                    <IconButton onClick={() => handleEditEnterprise(key, enterprise.enterpriseId, enterprise)}>
                                                        <EditIcon className='color-white' />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleDeleteEnterprise(key, enterprise.enterpriseId, enterprise)}>
                                                        <DeleteIcon className='color-white' />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
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
    )
}

export default AdminCreateEnterprise;
