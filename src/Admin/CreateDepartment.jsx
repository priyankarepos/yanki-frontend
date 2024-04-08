import { Box, Typography, Grid, TextField, InputLabel, Divider, Button, Table, Snackbar, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, FormHelperText, useMediaQuery } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { useForm, Controller, useWatch } from 'react-hook-form';
import 'react-tagsinput/react-tagsinput.css';
import TagsInput from 'react-tagsinput';
import { Context } from '../App';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import "../EnterpriseCollabration/EnterpriseStyle.scss";
import { emailRegex } from '../Utils/validations/validation';
import AdminDashboard from './AdminDashboard';
import ConfirmDialog from '../EnterpriseCollabration/ConfirmDialog';
import "../EnterpriseCollabration/EnterpriseStyle.scss";

const styles = {
    inputField: {
        backgroundColor: '#eaf5ff',
        border: '1px solid #6fa8dd',
        borderRadius: '8px',
        marginBottom: '6px',
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
    cell: {
        padding: '12px',
        borderBottom: '1px solid #ccc',
        fontSize: '16px',
        fontWeight: 'normal',
        color: '#fff',
        backgroundColor: "#13538b"
    },
};


const AdminCreateDepartment = () => {
    const { drawerOpen } = useContext(Context);
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [selectedDepartmentData, setSelectedDepartmentData] = useState({});
    const [departmentID, setDepartmentID] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [triggerEffect, setTriggerEffect] = useState(false);
    const [tagCount, setTagCount] = useState(0);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [selectedDepartmentIndex, setSelectedDepartmentIndex] = useState(null);
    const [confirmationText, setConfirmationText] = useState('');
    const [enterpriseList, setEnterpriseList] = useState({});
    const [selectedEnterpriseId, setSelectedEnterpriseId] = useState(null);

    const handleSelectChange = (event) => {
        setSelectedEnterpriseId(event.target.value);
    };

    useEffect(() => {
        const getEnterpriseDetails = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_HOST}/api/yanki-ai/get-enterprise-details`
                );

                if (response.status === 200) {
                    const responseData = response.data;
                    setEnterpriseList(responseData);
                } else {
                    setSnackbarMessage('Failed to fetch enterprise details');
                    setSnackbarOpen(true);
                }
            } catch (error) {
                setSnackbarMessage('Error fetching enterprise details:', error);
                setSnackbarOpen(true);
            }
        };

        getEnterpriseDetails();
    }, []);

    const {
        control,
        handleSubmit,
        setValue,
        getValues,
        reset,
        formState: { errors, isSubmitted },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            DepartmentName: selectedDepartmentData?.departmentName || "",
            NameOfRepresentative: selectedDepartmentData?.departmentHeadName || "",
            EmailAddress: selectedDepartmentData?.departmentEmail || "",
            DepartmentDescription: selectedDepartmentData?.departmentDescription || "",
            DepartmentIdentificationKeywords: selectedDepartmentData?.departmentKeywords || [],
        },
        criteriaMode: "all",
    });

    const keywords = useWatch({ control, name: 'DepartmentIdentificationKeywords', defaultValue: [] });


    const checkEnterpriseKeyword = async (tag, enterpriseId) => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_HOST}/api/yanki-ai/check-enterprise-department-keyword/${selectedEnterpriseId}/${tag}`
            );
            setSnackbarMessage('Keyword Check Response:', response.data);
            setSnackbarOpen(true);

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
                    setSnackbarOpen(true);
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

            // Check if the tag length exceeds 20 characters
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
                    `${process.env.REACT_APP_API_HOST}/api/yanki-ai/get-enterprise-departments/${selectedEnterpriseId}`
                );

                if (response.status === 200) {
                    setDepartmentsData(response.data);
                } else {
                    setSnackbarMessage('Failed to fetch departments:', response.statusText);
                    setSnackbarOpen(true);
                }
            } catch (error) {
                setSnackbarMessage('Error occurred while fetching departments:', error.message);
                setSnackbarOpen(true);
            }
        };

        fetchData();
    }, [triggerEffect, selectedEnterpriseId]);

    const handleEditDepartment = async (index, departmentId) => {
        const department = departmentsData[index];
        setDepartmentID(departmentId);
        setSelectedDepartmentData(department);

        if (selectedDepartmentData) {
            setValue("DepartmentName", department.departmentName || "");
            setValue("NameOfRepresentative", department.departmentHeadName || "");
            setValue("EmailAddress", department.departmentEmail || "");
            setValue("DepartmentDescription", department.departmentDescription || "");
            const keywordsArray = department.departmentKeywords.split(',');
            setTags(keywordsArray);
            setValue("DepartmentIdentificationKeywords", keywordsArray || []);
        }
    };


    const handleDeleteDepartment = (index, departmentId) => {
        setConfirmDialogOpen(true);
        setSelectedDepartmentIndex(index);
        setConfirmationText(`Are you sure you want to delete the department "${departmentsData[index].departmentName}"?`);
    };

    const handleConfirmDelete = async () => {
        setConfirmDialogOpen(false);
        const { departmentId } = departmentsData[selectedDepartmentIndex];
        try {
            const apiUrl = `${process.env.REACT_APP_API_HOST}/api/yanki-ai/delete-enterprise-department/${departmentId}`;
            const response = await axios.delete(apiUrl);

            if (response.status === 200) {
                setSnackbarMessage('Department deleted successfully');
                setSnackbarOpen(true);
                const updatedDepartments = [...departmentsData];
                updatedDepartments.splice(selectedDepartmentIndex, 1);
                setDepartmentsData(updatedDepartments);
            } else {
                setSnackbarMessage('Failed to delete department:');
                setSnackbarOpen(true);
            }
        } catch (error) {
            setSnackbarMessage('Error deleting department:', error.message);
            setSnackbarOpen(true);
        }
    };

    const handleSaveDepartment = async (data) => {
        const formData = getValues();
        if (tags.length === 0) {
            setSnackbarMessage('At least one tag is required.');
            setSnackbarOpen(true);
            return;
        }
        const isDuplicate = departmentsData.some(
            (department) =>
                department.departmentName.toLowerCase() === formData.DepartmentName.toLowerCase() &&
                department.departmentId !== selectedDepartmentData?.departmentId
        );
        if (isDuplicate) {
            setSnackbarMessage('The department you are adding already exists.');
            setSnackbarOpen(true);
            return;
        }
        try {
            const tagsAsString = tags.join(',');
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
                `${process.env.REACT_APP_API_HOST}/api/yanki-ai/update-enterprise-department`,
                payload
            );
            setTriggerEffect((prev) => !prev);
            if (response.status === 200) {
                setSnackbarOpen(true);
                setSnackbarMessage('Department details updated successfully');
                reset();
                setSelectedDepartmentData({});
                setDepartmentsData([]);
                setTags([])
                setDepartmentID(null)
            } else {
                setSnackbarMessage(`Failed to update Department details. Status: ${response.status}`);
                setSnackbarOpen(true);

            }
        } catch (error) {
            setSnackbarMessage('Error updating Department details:', error.message);
            setSnackbarOpen(true);
        }
        setSelectedDepartmentData("");
    };




    const onSubmit = async (data) => {
        const isDuplicate = departmentsData.some(
            (department) => department.departmentName.toLowerCase() === data.DepartmentName.toLowerCase()
        );

        if (isDuplicate) {
            setSnackbarMessage('The department you are adding already exists.');
            setSnackbarOpen(true);
            return;
        }
        try {
            const tagsAsString = tags.join(',');
            const apiUrl = `${process.env.REACT_APP_API_HOST}/api/yanki-ai/add-enterprise-department`;

            const requestBody = {
                departmentId: data.DepartmentId,
                departmentName: data.DepartmentName,
                departmentHeadName: data.NameOfRepresentative,
                departmentEmail: data.EmailAddress,
                departmentDescription: data.DepartmentDescription,
                departmentKeywords: tagsAsString,
                enterpriseId: selectedEnterpriseId,
            };

            const response = await axios.post(apiUrl, requestBody);

            if (response.status === 200) {
                const result = response.data;
                setDepartmentsData([...departmentsData, result]);
                setTags([]);
                setSnackbarMessage('Department added successfully,');
                setSnackbarOpen(true);
                reset();
                setValue('DepartmentName', '');
                setValue('NameOfRepresentative', '');
                setValue('EmailAddress', '');
                setValue('DepartmentDescription', '');
                setValue('DepartmentIdentificationKeywords', []);
            } else {
                setSnackbarMessage('API error: ' + response.statusText);
                setSnackbarOpen(true);
            }
            setTriggerEffect((prev) => !prev);
        } catch (error) {
            setSnackbarMessage('Error occurred while fetching API:', error.message);
            setSnackbarOpen(true);
        }
    };

    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
    const contentMargin = drawerOpen ? '0' : '0';

    return (
        <Box style={{ display: "flex" }}>
            <Box sx={{ width: drawerOpen && !isSmallScreen ? '270px' : "0" }}><AdminDashboard /></Box>
            <Box style={{ ...styles.content, marginLeft: contentMargin }} className="enterpriseFormBox" sx={{ width: drawerOpen ? 'calc(100% - 270px)' : "100%", marginTop: '70px', padding: '16px' }}>
                <Typography variant="h6" className='table-heading'>
                    Add Departments
                </Typography>
                <div style={{ marginBottom: '20px' }}>
                    <InputLabel style={styles.label}>Select Enterprise<sup className="required-icon">*</sup></InputLabel>
                    <select
                        id="enterpriseDropdown"
                        onChange={handleSelectChange}
                        value={selectedEnterpriseId}
                    >
                        <option value="">Please select enterprise to continue</option>
                        {Array.isArray(enterpriseList) && enterpriseList.map((enterprise) => (
                            <option key={enterprise.enterpriseId} value={enterprise.enterpriseId}>
                                {enterprise.enterpriseName}
                            </option>
                        ))}
                    </select>
                </div>
                <Grid container spacing={2} className='enterprise-profile'>
                    <Grid item xs={12} sm={12} md={6} lg={4} style={styles.gridItem}>
                        <InputLabel style={styles.label}>Department<sup className="required-icon">*</sup></InputLabel>
                        <Controller
                            control={control}
                            name="DepartmentName"
                            rules={{
                                required: "Department name is required.",
                                minLength: {
                                    value: 2,
                                    message: "Department name should be at least 3 characters long.",
                                },
                                maxLength: {
                                    value: 30,
                                    message: "Department name should not exceed 30 characters.",
                                },
                            }}
                            render={({ field }) => (
                                <div>
                                    <TextField
                                        sx={{ ...styles.inputField }}
                                        {...field}
                                        type="outlined"
                                        placeholder="Customer Service"
                                        fullWidth
                                        disabled={!selectedEnterpriseId}
                                    />
                                    {errors['DepartmentName'] && (
                                        <FormHelperText className='error-message'>{errors['DepartmentName'].message}</FormHelperText>
                                    )}
                                </div>
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4} style={styles.gridItem}>
                        <InputLabel style={styles.label}>Name of representative<sup className="required-icon">*</sup></InputLabel>
                        <Controller
                            control={control}
                            name="NameOfRepresentative"
                            rules={{
                                required: "Name of representative is required.",
                                minLength: {
                                    value: 3,
                                    message: "Name of representative should be at least 3 characters long.",
                                },
                                maxLength: {
                                    value: 30,
                                    message: "Name of representative should not exceed 30 characters.",
                                },
                            }}
                            render={({ field }) => (
                                <div>
                                    <TextField
                                        sx={styles.inputField}
                                        {...field}
                                        type="outlined"
                                        placeholder="John Deo"
                                        fullWidth
                                        disabled={!selectedEnterpriseId}
                                    />
                                    {errors['NameOfRepresentative'] && (
                                        <FormHelperText className='error-message'>{errors['NameOfRepresentative'].message}</FormHelperText>
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
                                        disabled={!selectedEnterpriseId}
                                    />
                                    {errors['EmailAddress'] && (
                                        <FormHelperText className='error-message'>{errors['EmailAddress'].message}</FormHelperText>
                                    )}
                                </div>
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <InputLabel style={styles.label}>Description</InputLabel>
                        <Controller
                            control={control}
                            name="DepartmentDescription"
                            render={({ field }) => (
                                <div>
                                    <TextareaAutosize
                                        className='TextareaAutosize'
                                        {...field}
                                        placeholder="Type description here"
                                        onFocus={(e) => e.target.style.outline = 'none'}
                                        onMouseOver={(e) => e.target.style.backgroundColor = 'none'}
                                        onMouseOut={(e) => e.target.style.backgroundColor = 'none'}
                                        disabled={!selectedEnterpriseId}
                                    />
                                </div>
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <InputLabel style={styles.label}>Enterprise identification keywords<sup className="required-icon">*</sup></InputLabel>
                        <Controller
                            control={control}
                            name="DepartmentIdentificationKeywords"
                            render={({ field }) => (
                                <div>
                                    <TagsInput
                                        className='TagsInput'
                                        value={tags}
                                        onChange={(newTags) => setTags(newTags)}
                                        addKeys={[13, 9]}
                                        placeholder="Type Enterprise identification keywords here"
                                        disabled={!selectedEnterpriseId}
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
                                        {tags?.map((tag, index) => (
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
                                    {isSubmitted && keywords.length === 0 && tags.length === 0 && (
                                        <FormHelperText className='error-message'>
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
                            sx={{ marginY: { xs: "10px" }, }}
                            color="primary"
                            onClick={departmentID !== null ? handleSubmit(handleSaveDepartment) : handleSubmit(onSubmit)}
                            style={styles.modalButton}
                        >
                            {departmentID !== null ? "Save Changes" : "Save"}
                        </Button>
                    </Grid>
                    <Grid item xs={12}><Divider className='table-devider'></Divider></Grid>
                    <Box className="enterpriseTableBox" sx={{ padding: '16px' }}>
                        <Typography variant="h6" className='table-heading'>
                            Departments
                        </Typography>
                    </Box>
                    <Grid item xs={12}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={styles.cell}>Department</TableCell>
                                        <TableCell style={styles.cell}>Name of Representative</TableCell>
                                        <TableCell style={styles.cell}>Email Address</TableCell>
                                        <TableCell style={styles.cell}>Description</TableCell>
                                        <TableCell style={styles.cell}>Identification Keywords</TableCell>
                                        <TableCell style={styles.cell}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {departmentsData.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className='text-center'>
                                                No data available
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        departmentsData.map((department, index) => (
                                            <TableRow key={index}>
                                                <TableCell style={styles.cell}>{department.departmentName}</TableCell>
                                                <TableCell style={styles.cell}>{department.departmentHeadName}</TableCell>
                                                <TableCell style={styles.cell}>{department.departmentEmail}</TableCell>
                                                <TableCell style={styles.cell}>{department.departmentDescription}</TableCell>
                                                <TableCell style={styles.cell}>
                                                    {department.departmentKeywords}
                                                </TableCell>
                                                <TableCell style={styles.cell}>
                                                    <IconButton onClick={() => handleEditDepartment(index, department.departmentId, department)}>
                                                        <EditIcon className='color-white' />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleDeleteDepartment(index, department.departmentId)}>
                                                        <DeleteIcon className='color-white' />
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
            <ConfirmDialog
                open={confirmDialogOpen}
                handleClose={() => setConfirmDialogOpen(false)}
                handleConfirm={handleConfirmDelete}
                confirmationText={confirmationText}
            />
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </Box>
    )
}

export default AdminCreateDepartment;
