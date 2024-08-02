import { Box, Typography, Grid, TextField, InputLabel, Divider, Button, Table, Snackbar, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, FormHelperText, useMediaQuery } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import EnterpriseDashboard from './EnterpriseDashboard'
import { useForm, Controller, useWatch } from 'react-hook-form';
import 'react-tagsinput/react-tagsinput.css';
import TagsInput from 'react-tagsinput';
import { Context } from '../App';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import "./EnterpriseStyle.scss"
import ConfirmDialog from './ConfirmDialog';
import { emailRegex } from '../Utils/validations/validation';

const Departments = () => {
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const { drawerOpen } = useContext(Context);
  const [selectedDepartmentData, setSelectedDepartmentData] = useState({});
  const [departmentID, setDepartmentID] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [triggerEffect, setTriggerEffect] = useState(false);
  const [tagCount, setTagCount] = useState(0);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedDepartmentIndex, setSelectedDepartmentIndex] = useState(null);
  const [confirmationText, setConfirmationText] = useState('');
  const [enterpriseDetails, setEnterpriseDetails] = useState({});

  useEffect(() => {
    const getEnterpriseDetails = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/get-enterprise-details`
            );

            if (response.status === 200) {
                const responseData = response.data;
                setEnterpriseDetails(responseData.data)
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

  const checkEnterpriseKeyword = async (tag) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/check-enterprise-department-keyword/${enterpriseDetails[0]?.enterpriseId}/${tag}`
      );
      if (response.status === 200) {
        const keywordExists = response.data.exists;
        if (keywordExists !== undefined) {
          setSnackbarMessage("keywordExists", keywordExists);
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
          `${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/get-enterprise-departments/${enterpriseDetails[0]?.enterpriseId}`
        );

        if (response.status === 200) {
          setDepartmentsData(response.data);
        } else {
          setSnackbarMessage('Failed to fetch departments:', response.statusText);
          setSnackbarOpen(true);
        }
      } catch (error) {
        setSnackbarMessage('Error occurred while fetching departments:', error.message);
        setSnackbarOpen(false);
      }
    };

    fetchData();
  }, [triggerEffect,enterpriseDetails]);

  const handleEditDepartment = async (index, departmentId) => {
    const department = departmentsData[index];
    setDepartmentID(departmentId);
    setSelectedDepartmentData(department);

    if (selectedDepartmentData) {
      setValue("DepartmentName", department.departmentName || "");
      setValue("NameOfRepresentative", department.departmentHeadName || "");
      setValue("EmailAddress", department.departmentEmail || "");
      setValue("DepartmentDescription", department.departmentDescription || "");
      // Split the departmentKeywords string into an array
      const keywordsArray = department.departmentKeywords.split(',');
      // Set the state with the array of keywords
      setTags(keywordsArray);
      setValue("DepartmentIdentificationKeywords", keywordsArray || []);
    }
  };


  const handleDeleteDepartment = (index, departmentId) => {
    // Open the confirmation dialog and store the selected department index
    setConfirmDialogOpen(true);
    setSelectedDepartmentIndex(index);

    setConfirmationText(`Are you sure you want to delete the department "${departmentsData[index].departmentName}"?`);
  };

  const handleConfirmDelete = async () => {
    setConfirmDialogOpen(false);
    const { departmentId } = departmentsData[selectedDepartmentIndex];
    // Delete the department
    try {
      const apiUrl = `${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/delete-enterprise-department/${departmentId}`;
      const response = await axios.delete(apiUrl);

      if (response.status === 200) {
        setSnackbarMessage('Department deleted successfully');
        setSnackbarOpen(true);

        // Remove the deleted department from the state
        const updatedDepartments = [...departmentsData];
        updatedDepartments.splice(selectedDepartmentIndex, 1);
        setDepartmentsData(updatedDepartments);
      } else {
        setSnackbarMessage('Failed to delete department:', response.statusText);
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
        enterpriseId: enterpriseDetails[0]?.enterpriseId,
      };

      const response = await axios.put(
        `${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/update-enterprise-department`,
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
      const apiUrl = `${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/add-enterprise-department`;

      const requestBody = {
        departmentId: data.DepartmentId,
        departmentName: data.DepartmentName,
        departmentHeadName: data.NameOfRepresentative,
        departmentEmail: data.EmailAddress,
        departmentDescription: data.DepartmentDescription,
        departmentKeywords: tagsAsString,
        enterpriseId: enterpriseDetails[0]?.enterpriseId,
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
        setSnackbarMessage('API error:', response.statusTex);
        setSnackbarOpen(true);
      }
      setTriggerEffect((prev) => !prev);
    } catch (error) {
      setSnackbarMessage('Error occurred while fetching API:', error.message);
      setSnackbarOpen(true);
    }
  };


  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return (
    <Box className='enterprise-box'>
      <Box sx={{ width: drawerOpen && !isSmallScreen ? '270px' : "0" }}>
        <EnterpriseDashboard />
      </Box>
      <Box className={`enterpriseFormBox ${drawerOpen ? "sidebar-content" : "main-content" }`} >
        <Typography variant="h6" className='enterprise-heading'>
          Add Departments
        </Typography>
        {enterpriseDetails[0]?.isProfileCompleted === false && <Typography className='enterprise-department-info'>Please complete enterprise profile first to add departments</Typography>}
        <Grid container spacing={2} className='enterprise-profile'>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <InputLabel className='enterprise-input-lable'>Department<sup className='asterisk'>*</sup></InputLabel>
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
                    className='enterprise-input-field'
                    {...field}
                    type="outlined"
                    placeholder="Customer Service"
                    fullWidth
                    disabled={enterpriseDetails[0]?.isProfileCompleted === false}
                  />
                  {errors['DepartmentName'] && (
                    <FormHelperText className='error-handling'>{errors['DepartmentName'].message}</FormHelperText>
                  )}
                </div>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <InputLabel className='enterprise-input-lable'>Name of representative<sup className='asterisk'>*</sup></InputLabel>
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
                    className='enterprise-input-field'
                    {...field}
                    type="outlined"
                    placeholder="John Deo"
                    fullWidth
                    disabled={enterpriseDetails[0]?.isProfileCompleted === false}
                  />
                  {errors['NameOfRepresentative'] && (
                    <FormHelperText className='error-handling'>{errors['NameOfRepresentative'].message}</FormHelperText>
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
                    disabled={enterpriseDetails[0]?.isProfileCompleted === false}
                  />
                  {errors['EmailAddress'] && (
                    <FormHelperText className='error-handling'>{errors['EmailAddress'].message}</FormHelperText>
                  )}
                </div>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel className='enterprise-input-lable'>Description</InputLabel>
            <Controller
              control={control}
              name="DepartmentDescription"
              render={({ field }) => (
                <div>
                  <TextareaAutosize
                    className='enterprise-text-area'
                    {...field}
                    placeholder="Type description here"
                    onFocus={(e) => e.target.style.outline = 'none'}
                    onMouseOver={(e) => e.target.style.backgroundColor = 'none'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'none'}
                    disabled={enterpriseDetails[0]?.isProfileCompleted === false}
                  />
                </div>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel className='enterprise-input-lable'>Enterprise identification keywords<sup className='asterisk'>*</sup></InputLabel>
            <Controller
              control={control}
              name="DepartmentIdentificationKeywords"
              render={({ field }) => (
                <div>
                  <TagsInput
                    value={tags}
                    onChange={(newTags) => setTags(newTags)}
                    addKeys={[13, 9]}
                    placeholder="Type Enterprise identification keywords here"
                    disabled={enterpriseDetails[0]?.isProfileCompleted === false}
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
                    {tags?.map((tag, index) => (
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
                  {isSubmitted && keywords.length === 0 && tags.length === 0 && (
                    <FormHelperText className='error-handling'>
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
              className='enterprise-department-button'
              sx={{ marginY: { xs: "10px" } }}
              color="primary"
              onClick={departmentID !== null ? handleSubmit(handleSaveDepartment) : handleSubmit(onSubmit)}
              disabled={enterpriseDetails[0]?.isProfileCompleted === false}
            >
              {departmentID !== null ? "Save Changes" : "Save"}
            </Button>
          </Grid>
          <Grid item xs={12}><Divider sx={{ marginY: "20px" }} className='custom-divider'></Divider></Grid>
          <Box className="enterpriseTableBox" sx={{ padding: '16px' }}>
            <Typography variant="h6" className='enterprise-department-heading'>
              Add Departments
            </Typography>
          </Box>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className='enterprise-department-table-cell'>Department</TableCell>
                    <TableCell className='enterprise-department-table-cell'>Name of Representative</TableCell>
                    <TableCell className='enterprise-department-table-cell'>Email Address</TableCell>
                    <TableCell className='enterprise-department-table-cell'>Description</TableCell>
                    <TableCell className='enterprise-department-table-cell'>Identification Keywords</TableCell>
                    <TableCell className='enterprise-department-table-cell'>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {departmentsData.map((department, index) => (
                    <TableRow key={index}>
                      <TableCell className='enterprise-department-table-cell'>{department.departmentName}</TableCell>
                      <TableCell className='enterprise-department-table-cell'>{department.departmentHeadName}</TableCell>
                      <TableCell className='enterprise-department-table-cell'>{department.departmentEmail}</TableCell>
                      <TableCell className='enterprise-department-table-cell'>{department.departmentDescription}</TableCell>
                      <TableCell className='enterprise-department-table-cell'>
                        {department.departmentKeywords}
                      </TableCell>
                      <TableCell className='enterprise-department-table-cell'>
                        <IconButton onClick={() => handleEditDepartment(index, department.departmentId, department)}>
                          <EditIcon className='enterprise-white-color' />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteDepartment(index, department.departmentId)}>
                          <DeleteIcon className='enterprise-white-color' />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
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

export default Departments