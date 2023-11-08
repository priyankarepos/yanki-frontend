import React, { useContext, useState } from 'react';
import { Box, Typography, Grid, TextField, InputLabel, Divider, Button } from '@mui/material';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import EnterpriseDashboard from './EnterpriseDashboard';
import { useForm, Controller } from 'react-hook-form';
import 'react-tagsinput/react-tagsinput.css'; // Import the CSS
import TagsInput from 'react-tagsinput';
import { Context } from '../App';
import { FormControl, Select, MenuItem } from '@mui/material';

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
  const [selectedCategory, setSelectedCategory] = useState("");
  const { drawerOpen } = useContext(Context);

  console.log("drawerOpen", drawerOpen);

  const {
    control,
    // handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      EnterpriseName: "",
      EnterprisePointOfContact: "",
      EnterpriseAddress: "",
      EmailAddress: "",
      PhoneNumber: "",
      WebsiteUrl: "",
      WhatsappPhoneNumber: "",
      InstagramUsername: "",
      LinkedinUsername: "",
      EnterpriseDescription: "",
      EnterpriseCategories: "",
      BusinessHoursOpeningTime: "",
      BusinessHoursClosingTime: "",
      FoundedYear: "",
      ReligiousCertifications: "",
      FrequentlyAskedQuestions: "",
      EnterpriseIdentificationKeywords: [],
    },
  });

  // const handleAddTag = (tag) => {
  //   // Function to add a tag
  //   if (tags.length < 10) {
  //     const updatedTags = [...tags, tag];
  //     setTags(updatedTags);
  //   }
  // };

  const handleRemoveTag = (tag) => {
    // Function to remove a tag
    const updatedTags = tags.filter((t) => t !== tag);
    setTags(updatedTags);
  };

  const contentMargin = drawerOpen ? '0' : '0';

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#fff' }}>
      <Box sx={{ width: drawerOpen ? '270px' : "0" }}>
        <EnterpriseDashboard />
      </Box>
      <Box style={{ ...styles.content, marginLeft: contentMargin }} className="enterpriseFormBox" sx={{ width: drawerOpen ? 'calc(100% - 270px)' : "100%", marginTop: '70px', padding: '16px' }}>
        <Typography variant="h6" sx={{ paddingBottom: '16px', color: '#6fa8dd' }}>
          My Enterprise Profile
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={4} style={styles.gridItem}>
            <InputLabel style={styles.label}>Enterprise Name</InputLabel>
            <Controller
              control={control}
              name="EnterpriseName"
              render={({ field }) => (
                <TextField
                  sx={{ ...styles.inputField }}
                  {...field}
                  type="outlined"
                  placeholder="Type enterprise name here"
                  fullWidth
                  error={!!errors['EnterpriseName']}
                  helperText={errors['EnterpriseName'] ? errors['EnterpriseName'].message : ''}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} style={styles.gridItem}>
            <InputLabel style={styles.label}>Enterprise point of contact</InputLabel>
            <Controller
              control={control}
              name="EnterprisePointOfContact"
              render={({ field }) => (
                <TextField
                  sx={styles.inputField}
                  {...field}
                  type="outlined"
                  placeholder="Enterprise point of contact name"
                  fullWidth
                  error={!!errors['EnterprisePointOfContact']}
                  helperText={errors['EnterprisePointOfContact'] ? errors['EnterprisePointOfContact'].message : ''}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel style={styles.label}>Enterprise address</InputLabel>
            <Controller
              control={control}
              name="EnterpriseAddress"
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
                  placeholder="Type enterprise address here"
                  onFocus={(e) => e.target.style.outline = 'none'}
                  onMouseOver={(e) => e.target.style.backgroundColor = 'none'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'none'}
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
          <Grid item xs={12} sm={12} md={6} lg={4} style={styles.gridItem}>
            <InputLabel style={styles.label}>Phone Number</InputLabel>
            <Controller
              control={control}
              name="PhoneNumber"
              render={({ field }) => (
                <TextField
                  sx={{ ...styles.inputField }}
                  {...field}
                  type="outlined"
                  placeholder="Type phone number here"
                  fullWidth
                  error={!!errors['PhoneNumber']}
                  helperText={errors['PhoneNumber'] ? errors['PhoneNumber'].message : ''}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} style={styles.gridItem}>
            <InputLabel style={styles.label}>Website URL</InputLabel>
            <Controller
              control={control}
              name="WebsiteUrl"
              render={({ field }) => (
                <TextField
                  sx={{ ...styles.inputField }}
                  {...field}
                  type="outlined"
                  placeholder="Type website URL here"
                  fullWidth
                  error={!!errors['WebsiteUrl']}
                  helperText={errors['WebsiteUrl'] ? errors['WebsiteUrl'].message : ''}
                />
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
          <Grid item xs={12}>
            <InputLabel style={styles.label}>Enterprise Description</InputLabel>
            <Controller
              control={control}
              name="EnterpriseAddress"
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
                  placeholder="Type enterprise description here"
                  onFocus={(e) => e.target.style.outline = 'none'}
                  onMouseOver={(e) => e.target.style.backgroundColor = 'none'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'none'}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} style={styles.gridItem}>
            <InputLabel style={styles.label}>Enterprise Categories</InputLabel>
            {/* <Controller
              control={control}
              name="EnterpriseCategories"
              render={({ field }) => (
                <TextField
                  sx={{ ...styles.inputField }}
                  {...field}
                  type="outlined"
                  placeholder="Type enterprise categories here"
                  fullWidth
                  error={!!errors['EnterpriseCategories']}
                  helperText={errors['EnterpriseCategories'] ? errors['EnterpriseCategories'].message : ''}
                />
              )}
            /> */}
            <FormControl fullWidth>
              <Select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                displayEmpty
                sx={{ ...styles.inputField }}
                className='EnterpriseCategorySelect'
              >
                <MenuItem value="">
                  Select an Enterprise Category
                </MenuItem>
                <MenuItem value="category1">
                  Category 1
                </MenuItem>
                <MenuItem value="category2">
                  Category 2
                </MenuItem>
                <MenuItem value="category3">
                  Category 3
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} style={styles.gridItem}>
            <InputLabel style={styles.label}>Business Hours Opening Time</InputLabel>
            <Controller
              control={control}
              name="BusinessHoursOpeningTime"
              render={({ field }) => (
                <TextField
                  sx={{ ...styles.inputField }}
                  {...field}
                  // type="outlined"
                  type="time"
                  placeholder="Type business hours opening time here"
                  fullWidth
                  error={!!errors['BusinessHoursOpeningTime']}
                  helperText={errors['BusinessHoursOpeningTime'] ? errors['BusinessHoursOpeningTime'].message : ''}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} style={styles.gridItem}>
            <InputLabel style={styles.label}>Business Hours Closing Time</InputLabel>
            <Controller
              control={control}
              name="BusinessHoursClosingTime"
              render={({ field }) => (
                <TextField
                  sx={{ ...styles.inputField }}
                  {...field}
                  type="time"
                  placeholder="Type business hours closing time here"
                  fullWidth
                  error={!!errors['BusinessHoursClosingTime']}
                  helperText={errors['BusinessHoursClosingTime'] ? errors['BusinessHoursClosingTime'].message : ''}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} style={styles.gridItem}>
            <InputLabel style={styles.label}>Founded Year</InputLabel>
            <Controller
              control={control}
              name="FoundedYear"
              render={({ field }) => (
                <TextField
                  sx={{ ...styles.inputField }}
                  {...field}
                  type="outlined"
                  placeholder="Type founded year here"
                  fullWidth
                  error={!!errors['FoundedYear']}
                  helperText={errors['FoundedYear'] ? errors['FoundedYear'].message : ''}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} style={styles.gridItem}>
            <InputLabel style={styles.label}>Religious Certifications</InputLabel>
            <Controller
              control={control}
              name="ReligiousCertifications"
              render={({ field }) => (
                <TextField
                  sx={{ ...styles.inputField }}
                  {...field}
                  type="outlined"
                  placeholder="Type religious certifications here"
                  fullWidth
                  error={!!errors['ReligiousCertifications']}
                  helperText={errors['ReligiousCertifications'] ? errors['ReligiousCertifications'].message : ''}
                />
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
            <InputLabel style={styles.label}>Enterprise identification keywords</InputLabel>
            <Controller
              control={control}
              name="EnterpriseIdentificationKeywords"
              render={({ field }) => (
                // <TextareaAutosize
                //   style={{
                //     backgroundColor: '#eaf5ff',
                //     border: '1px solid #6fa8dd',
                //     borderRadius: '8px',
                //     marginBottom: '16px',
                //     color: "#8bbae5", width: '100%', minHeight: "15%", padding: "15px", fontSize: "16px",
                //   }}
                //   {...field}
                //   placeholder="Type enterprise identification keywords here"
                //   onFocus={(e) => e.target.style.outline = 'none'}
                //   onMouseOver={(e) => e.target.style.backgroundColor = 'none'}
                //   onMouseOut={(e) => e.target.style.backgroundColor = 'none'}
                // />
                <div>
                  <TagsInput
                    value={tags}
                    onChange={setTags}
                    addKeys={[13, 9]} // Enter and Tab keys to add tags
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
        </Grid>
      </Box>
    </Box>
  );
};

export default EnterpriseProfile;
