import { Box, Typography, Grid, TextField, InputLabel, Divider, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,IconButton } from '@mui/material';
import React, { useContext, useState } from 'react';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import EnterpriseDashboard from './EnterpriseDashboard'
import { useForm, Controller } from 'react-hook-form';
import 'react-tagsinput/react-tagsinput.css'; // Import the CSS
import TagsInput from 'react-tagsinput';
import { Context } from '../App';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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
    borderBottom: '1px solid #ccc', // Add a border to the cell
    fontSize: '16px',
    fontWeight: 'normal',
    color: '#fff',
    backgroundColor: "#13538b"
  },
};

const Departments = () => {
  const [tags, setTags] = useState([]);
  const { drawerOpen } = useContext(Context);

  const {
    control,
    // handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      DepartmentName: "",
      NameOfRepresentative: "",
      EmailAddress: "",
      DepartmentDescription: "",
      DepartmentIdentificationKeywords: [],
    },
  });

  const handleRemoveTag = (tag) => {
    // Function to remove a tag
    const updatedTags = tags.filter((t) => t !== tag);
    setTags(updatedTags);
  };

  const contentMargin = drawerOpen ? '0' : '0';

  const [departmentsData, setDepartmentsData] = useState([
    {
      DepartmentName: 'Customer Service',
      NameOfRepresentative: 'John Deo',
      EmailAddress: 'john@example.com',
      DepartmentDescription: 'This is the customer service department.',
      DepartmentIdentificationKeywords: ['Service', 'Customer', 'Support'],
    },
    {
      DepartmentName: 'Customer Service',
      NameOfRepresentative: 'John Deo',
      EmailAddress: 'john@example.com',
      DepartmentDescription: 'This is the customer service department.',
      DepartmentIdentificationKeywords: ['Service', 'Customer', 'Support'],
    },
    // Add more department data as needed
  ]);

  const handleEditDepartment = (index) => {
    // Handle edit action for the department at the specified index
    // You can open a dialog or navigate to an edit page for editing
    console.log('Edit department at index:', index);
  };

  const handleDeleteDepartment = (index) => {
    // Handle delete action for the department at the specified index
    // You can show a confirmation dialog before deleting
    const updatedDepartments = [...departmentsData];
    updatedDepartments.splice(index, 1);
    setDepartmentsData(updatedDepartments);
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
              name="EnterpriseIdentificationKeywords"
              render={({ field }) => (
                <div>
                  <TagsInput
                    value={tags}
                    onChange={setTags}
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
                    }}
                  />
                  <div style={styles.tagsContainer}>
                    {tags.map((tag) => (
                      <div key={tag} style={styles.tag}>
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
              sx={{ marginY: { xs: "10px" } }}
              fullWidth
              style={{ backgroundColor: "#13538b", color: "lightblue" }}
            >
              Save
            </Button>
          </Grid>
          <Grid item xs={12}><Divider sx={{ marginY: "20px", background: "#8bbae5", }}></Divider></Grid>
          <Box className="enterpriseTableBox" sx={{padding: '16px' }}>
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
                      <TableCell style={styles.cell}>{department.DepartmentName}</TableCell>
                      <TableCell style={styles.cell}>{department.NameOfRepresentative}</TableCell>
                      <TableCell style={styles.cell}>{department.EmailAddress}</TableCell>
                      <TableCell style={styles.cell}>{department.DepartmentDescription}</TableCell>
                      <TableCell style={styles.cell}>
                        {department.DepartmentIdentificationKeywords.join(', ')}
                      </TableCell>
                      <TableCell style={styles.cell}>
                        <IconButton onClick={() => handleEditDepartment(index)}>
                          <EditIcon style={{ color:'#fff',}} />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteDepartment(index)}>
                          <DeleteIcon style={{ color: '#fff',}} />
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
    </Box>
  )
}

export default Departments