import { Box, Typography, Grid, TextField, InputLabel, Divider, Button, Table, Snackbar, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import EnterpriseDashboard from './EnterpriseDashboard'
import { useForm, Controller } from 'react-hook-form';
import 'react-tagsinput/react-tagsinput.css';
import TagsInput from 'react-tagsinput';
import { Context } from '../App';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";

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
  cell: {
    padding: '12px',
    borderBottom: '1px solid #ccc', 
    fontSize: '16px',
    fontWeight: 'normal',
    color: '#fff',
    backgroundColor: "#13538b"
  },
};

const Departments = () => {
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isTagAvailable, setIsTagAvailable] = useState(true);
  const { drawerOpen } = useContext(Context);
  const [selectedDepartmentData, setSelectedDepartmentData] = useState({});
  const [departmentID, setDepartmentID] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const enterpriseId = sessionStorage.getItem('enterpriseId');
  const [triggerEffect, setTriggerEffect] = useState(false);
  const [tagCount, setTagCount] = useState(0);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      DepartmentName: selectedDepartmentData?.departmentName || "",
      NameOfRepresentative: selectedDepartmentData?.departmentHeadName || "",
      EmailAddress: selectedDepartmentData?.departmentEmail || "",
      DepartmentDescription: selectedDepartmentData?.departmentDescription || "",
      DepartmentIdentificationKeywords: selectedDepartmentData?.departmentKeywords || [],
    },
  });

  const checkEnterpriseKeyword = async (tag) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_HOST}/api/yanki-ai/check-enterprise-department-keyword/${tag}`
      );
      console.log('Keyword Check Response:', response.data);
      setSnackbarOpen(true);
  
      if (response.status === 200) {
        const keywordExists = response.data.exists;
        if (keywordExists !== undefined) {
          console.log("keywordExists", keywordExists);
  
          if (keywordExists) {
            console.log('Keyword already exists:', tag);
            setSnackbarMessage(`Keyword "${tag}" already exists`);
          } else {
            console.log('Keyword does not exist:', tag);
            setSnackbarMessage(`Keyword "${tag}" does not exist`);
  
            setTags((prevTags) => [...prevTags, tag]);
          }
        } else {
          console.log('Keyword existence is undefined for:', tag);
          setSnackbarMessage(`Keyword existence is undefined for "${tag}"`);
        }
      } else {
        console.error('Failed to check enterprise keyword');
        setSnackbarMessage('Failed to check enterprise keyword');
      }
  
      setSnackbarOpen(true);
      return response.data;
    } catch (error) {
      console.error('Error checking enterprise keyword:', error);
      setSnackbarMessage(`Error checking enterprise keyword: ${error.message}`);
      setSnackbarOpen(true);
      return { isSuccess: false };
    }
  };

  const handleAddTag = async (tag) => {
    try {
      if (tagCount >= 10) {
        setSnackbarMessage('You have reached the maximum limit of tags (10).');
        setSnackbarOpen(true);
        return;
      }

      const response = await checkEnterpriseKeyword(tag);

      if (response && response.isSuccess) {
        setTagCount(tagCount + 1);

        setIsTagAvailable(response.isAvailable);

        if (response.isAvailable) {
          setTags((prevTags) => {
            const uniqueTags = new Set([...prevTags, tag]);
            return [...uniqueTags];
          });

          setSnackbarMessage(`Tag "${tag}" added successfully`);
        } else {
          setSnackbarMessage(`Tag "${tag}" is not available in this enterprise.`);
        }

        setSnackbarOpen(true);
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
    const updatedTags = tags.filter((t) => t !== tag);
    setTags(updatedTags);

    setTagCount((prevCount) => Math.max(0, prevCount - 1));

    setSnackbarMessage('Tag removed successfully');
    setSnackbarOpen(true);
  };

  useEffect(() => {
    setTagCount(tags.length);
  }, [tags]);

  const contentMargin = drawerOpen ? '0' : '0';

  const [departmentsData, setDepartmentsData] = useState([]);

  console.log("departmentsData", departmentsData);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_HOST}/api/yanki-ai/get-enterprise-departments`
        );

        if (response.status === 200) {
          setDepartmentsData(response.data);
        } else {
          console.error('Failed to fetch departments:', response.statusText);
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error('Error occurred while fetching departments:', error.message);
        setSnackbarOpen(true);
      }
    };

    fetchData();
  }, [triggerEffect]);

  const handleEditDepartment = async (index, departmentId) => {
    const department = departmentsData[index];
    console.log("department", department);
    setDepartmentID(departmentId);
    setSelectedDepartmentData(department);

    if (selectedDepartmentData) {
      setValue("DepartmentName", department.departmentName || "");
      setValue("NameOfRepresentative", department.departmentHeadName || "");
      setValue("EmailAddress", department.departmentEmail || "");
      setValue("DepartmentDescription", department.departmentDescription || "");
      // Split the departmentKeywords string into an array
      const keywordsArray = department.departmentKeywords.split(',');
      console.log("keywordsArray", keywordsArray);
      // Set the state with the array of keywords
      setTags(keywordsArray);
      setValue("DepartmentIdentificationKeywords", keywordsArray || []);
    }
  };



  const handleDeleteDepartment = async (index, departmentId) => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_HOST}/api/yanki-ai/delete-enterprise-department/${departmentId}`;

      const response = await axios.delete(apiUrl);

      if (response.status === 200) {
        console.log('Department deleted successfully.');
        setSnackbarMessage('Department deleted successfully');
        setSnackbarOpen(true);
        setSelectedDepartmentData({})
        const updatedDepartments = [...departmentsData];
        updatedDepartments.splice(index, 1);
        setDepartmentsData(updatedDepartments);
      } else {
        console.error('Failed to delete department:', response.statusText);
        setSnackbarMessage('Failed to delete department:');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error deleting department:', error.message);
    }
  };

  const handleSaveDepartment = async (data) => {
    const formData = getValues();
    console.log("dataaaaaaaaaaaa", formData);
    try {
      const tagsAsString = tags.join(',');
      const payload = {
        departmentId: selectedDepartmentData?.departmentId,
        departmentName: formData.DepartmentName,
        departmentHeadName: formData.NameOfRepresentative,
        departmentEmail: formData.EmailAddress,
        departmentDescription: formData.DepartmentDescription,
        departmentKeywords: tagsAsString,
        enterpriseId: enterpriseId,
      };

      const response = await axios.put(
        `${process.env.REACT_APP_API_HOST}/api/yanki-ai/update-enterprise-department`,
        payload
      );
      console.log('Update Department Details Response:', response.data);
      setTriggerEffect((prev) => !prev);

      if (response.status === 200) {
        console.log('Department details updated successfully');
        setSnackbarOpen(true);
        setSnackbarMessage('Department details updated successfully');
        // setTags(response.data.departmentKeywords.split(','));
      } else {
        console.error(`Failed to update Department details. Status: ${response.status}`);
        setSnackbarMessage(`Failed to update Department details. Status: ${response.status}`);
        setSnackbarOpen(true);

      }
    } catch (error) {
      console.error('Error updating Department details:', error.message);
    }
    setSelectedDepartmentData("");
  };




  const onSubmit = async (data) => {
    console.log("=====================", data);
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
        enterpriseId: enterpriseId,
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
        console.error('API error:', response.statusText);
        setSnackbarMessage('API error:', response.statusTex);
        setSnackbarOpen(true);
      }
      setTriggerEffect((prev) => !prev);
    } catch (error) {
      console.error('Error occurred while fetching API:', error.message);
      setSnackbarMessage('Error occurred while fetching API:', error.message);
      setSnackbarOpen(true);
    }
  };




  return (
    <Box style={{ display: "flex", backgroundColor: '#fff' }}>
      <Box sx={{ width: drawerOpen ? '270px' : "0" }}>
        <EnterpriseDashboard />
      </Box>
      <Box style={{ ...styles.content, marginLeft: contentMargin }} className="enterpriseFormBox" sx={{ width: drawerOpen ? 'calc(100% - 270px)' : "100%", marginTop: '70px', padding: '16px' }}>
        <Typography variant="h6" sx={{ paddingBottom: '16px', color: '#6fa8dd' }}>
          Add Departments
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={4} style={styles.gridItem}>
            <InputLabel style={styles.label}>Department</InputLabel>
            <Controller
              control={control}
              name="DepartmentName"
              render={({ field }) => (
                <TextField
                  sx={{ ...styles.inputField }}
                  {...field}
                  type="outlined"
                  placeholder="Customer Service"
                  fullWidth
                  error={!!errors['DepartmentName']}
                  helperText={errors['DepartmentName'] ? errors['DepartmentName'].message : ''}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} style={styles.gridItem}>
            <InputLabel style={styles.label}>Name of representative</InputLabel>
            <Controller
              control={control}
              name="NameOfRepresentative"
              render={({ field }) => (
                <TextField
                  sx={styles.inputField}
                  {...field}
                  type="outlined"
                  placeholder="John Deo"
                  fullWidth
                  error={!!errors['NameOfRepresentative']}
                  helperText={errors['NameOfRepresentative'] ? errors['NameOfRepresentative'].message : ''}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} style={styles.gridItem}>
            <InputLabel style={styles.label}>Email Address</InputLabel>
            <Controller
              control={control}
              name="EmailAddress"
              render={({ field }) => (
                <TextField
                  sx={{ ...styles.inputField }}
                  {...field}
                  type="outlined"
                  placeholder="Type email address here"
                  fullWidth
                  error={!!errors['EmailAddress']}
                  helperText={errors['EmailAddress'] ? errors['EmailAddress'].message : ''}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel style={styles.label}>Description</InputLabel>
            <Controller
              control={control}
              name="DepartmentDescription"
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
                  placeholder="Type description here"
                  onFocus={(e) => e.target.style.outline = 'none'}
                  onMouseOver={(e) => e.target.style.backgroundColor = 'none'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'none'}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel style={styles.label}>Enterprise identification keywords</InputLabel>
            <Controller
              control={control}
              name="DepartmentIdentificationKeywords"
              render={({ field }) => (
                <div>
                  <TagsInput
                    value={tags}
                    onChange={(newTags) => setTags(newTags)}
                    addKeys={[13, 9]} 
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
                        backgroundColor: tag === tagInput && !isTagAvailable ? '#ff7070' : '#6fa8dd',
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
                </div>
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="outlined"
              sx={{ marginY: { xs: "10px" }, width: "150px", }}
              color="primary"
              onClick={departmentID !== null ? handleSaveDepartment : handleSubmit(onSubmit)}
              style={styles.modalButton}
            >
              {departmentID !== null ? "Save Changes" : "Save"}
            </Button>
          </Grid>
          <Grid item xs={12}><Divider sx={{ marginY: "20px", background: "#8bbae5", }}></Divider></Grid>
          <Box className="enterpriseTableBox" sx={{ padding: '16px' }}>
            <Typography variant="h6" sx={{ paddingBottom: '16px', color: '#13538b' }}>
              Add Departments
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
                  {departmentsData.map((department, index) => (
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
                          <EditIcon style={{ color: '#fff', }} />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteDepartment(index, department.departmentId)}>
                          <DeleteIcon style={{ color: '#fff', }} />
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