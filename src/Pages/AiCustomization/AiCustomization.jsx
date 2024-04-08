import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Button,
  Typography,
  InputLabel,
  Snackbar,
  TextField,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  FormHelperText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AiCustomization.scss";

const AiCustomization = () => {
  const yankiUser = JSON.parse(window.localStorage.getItem(process.env.REACT_APP_LOCALSTORAGE_TOKEN) || '{}');
  const userRoles = yankiUser?.userObject?.userRoles || '';
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [customizeMessage, setCustomizeMessage] = useState("");
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    const fetchCurrentAiCustomizeData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_HOST}/api/CustomPrompt/get-custom-prompt`
        );

        if (response.status === 200) {
          setCustomizeMessage(response.data);
        }
      } catch (error) {
        console.error("Error fetching current phone number:", error);
      }
    };
    fetchCurrentAiCustomizeData();
  }, []);

  useEffect(() => {
    if (customizeMessage) {
      Object.entries(customizeMessage).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [customizeMessage, setValue]);

  const onSubmit = async (data) => {
    console.log("Form Data:", data);

    try {
      // Check if religiousPractices is an array
      if (Array.isArray(data.religiousPractices)) {
        const selectedPractices = data.religiousPractices;

        console.log("Selected Practices:", selectedPractices);

        // Rest of your code remains unchanged
        const requestBody = {
          judaismBranch: data.judaismBranch,
          ageRange: data.ageRange,
          maritalStatus: data.maritalStatus,
          numberOfChildren: data.numberOfChildren,
          location: data.location,
          levelOfReligiousObservance: data.levelOfReligiousObservance,
          religiousPractices: selectedPractices,
          synagogueCommunity: data.synagogueCommunity,
          updatedWithCommunityEvents: data.updatedWithCommunityEvents,
          isInterestInVolunteer: JSON.parse(data.isInterestInVolunteer),
          isInterestInReligiousStudies: JSON.parse(data.isInterestInReligiousStudies),
          volunteerInterests: data.volunteerInterests,
          religiousChallenges: data.religiousChallenges,
          toolForOvercomeChallenges: data.toolForOvercomeChallenges,
          ideaToEnhanceReligiousExperience: data.ideaToEnhanceReligiousExperience,
          religiousStudies: data.religiousStudies,
        };

        const response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/api/CustomPrompt/add-custom-prompt`,
          requestBody,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data);
        setSnackbarMessage("Custom prompt added successfully");
        setSnackbarOpen(true);
        window.location.reload();
      } else {
        console.error("Error: religiousPractices is not an array");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_HOST}/api/CustomPrompt/delete-custom-prompt`
      );

      if (response.status === 200) {
        setSnackbarMessage("Prompt deleted successfully");
        setSnackbarOpen(true);
        window.location.reload();
      } else {
        console.error("Failed to delete prompt");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = getValues();
      console.log("formData", formData);
      const requestBody = {
        judaismBranch: formData.judaismBranch,
        ageRange: formData.ageRange,
        maritalStatus: formData.maritalStatus,
        numberOfChildren: formData.numberOfChildren,
        location: formData.location,
        levelOfReligiousObservance: formData.levelOfReligiousObservance,
        religiousPractices: formData.religiousPractices,
        synagogueCommunity: formData.synagogueCommunity,
        updatedWithCommunityEvents: formData.updatedWithCommunityEvents,
        volunteerInterests: formData.isInterestInVolunteer==="false" ? "" : formData.volunteerInterests,
        religiousChallenges: formData.religiousChallenges,
        toolForOvercomeChallenges: formData.toolForOvercomeChallenges,
        ideaToEnhanceReligiousExperience: formData.ideaToEnhanceReligiousExperience,
        religiousStudies: formData.isInterestInReligiousStudies==="false" ? "" : formData.religiousStudies,
        isInterestInVolunteer: JSON.parse(formData.isInterestInVolunteer),
        isInterestInReligiousStudies: JSON.parse(formData.isInterestInReligiousStudies),
      };

      const response = await axios.put(
        `${process.env.REACT_APP_API_HOST}/api/CustomPrompt/update-custom-prompt`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setSnackbarMessage("Prompt updated successfully");
        setSnackbarOpen(true);
        window.location.reload();
      } else {
        console.error("Failed to update prompt");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" align="center" className="Ai-Heading">
          AI Customization
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Questions for that section:</strong> Your responses will help
          us understand the needs and challenges of our users and develop
          helpful resources and ideas to make your religious life easier. All
          responses will be kept confidential.
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} className={userRoles === "Enterprise" ? "section-container-light" : "section-container"}>
          <Grid container spacing={2}>
            <Grid item xl={6} lg={6} md={6} xs={12}>
              <Box>
                <Grid item xs={12}>
                  <Typography variant="h6">General Information:</Typography>
                </Grid>

                <Grid item xs={12} mt={2}>
                  <InputLabel className="ai-input-label">
                    Which branch of Orthodox Judaism do you identify with?
                    (Haredi, Yeshivish, Chabad, Hasidic, Modern Orthodox, etc.)
                  </InputLabel>
                  <Controller
                    control={control}
                    name="judaismBranch"
                    render={({ field }) => (
                      <TextField
                        className="Ai-TextField"
                        {...field}
                        type="text"
                        placeholder="Enter here..."
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel className="ai-input-label">
                    What is your age range?
                  </InputLabel>
                  <Controller
                    control={control}
                    name="ageRange"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        variant="outlined"
                        placeholder="Enter your age range"
                        type="number"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel className="ai-input-label">
                    Marital status?
                  </InputLabel>
                  <Controller
                    control={control}
                    name="maritalStatus"
                    defaultValue={customizeMessage?.maritalStatus || ""}
                    render={({ field }) => (
                      <RadioGroup {...field} row>
                        <FormControlLabel
                          value="single"
                          control={<Radio />}
                          label="Single"
                        />
                        <FormControlLabel
                          value="married"
                          control={<Radio />}
                          label="Married"
                        />
                        <FormControlLabel
                          value="divorced"
                          control={<Radio />}
                          label="Divorced"
                        />
                        <FormControlLabel
                          value="widowed"
                          control={<Radio />}
                          label="Widowed"
                        />
                      </RadioGroup>
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel className="ai-input-label">
                    Do you have children? If so, how many, what are their ages
                    and schools?
                  </InputLabel>
                  <Controller
                    control={control}
                    name="numberOfChildren"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        variant="outlined"
                        placeholder="Enter your children's information"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel className="ai-input-label">
                    Where do you live?
                  </InputLabel>
                  <Controller
                    control={control}
                    name="location"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        variant="outlined"
                        placeholder="Enter your location"
                        error={!!field.value && !field.value.trim()}
                        helperText={
                          !!field.value && !field.value.trim()
                            ? "This field is required."
                            : ""
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel className="ai-input-label">
                    What is your level of religious observance?
                  </InputLabel>
                  <Controller
                    control={control}
                    name="levelOfReligiousObservance"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        variant="outlined"
                        placeholder="Enter your religious observance"
                        error={!!field.value && !field.value.trim()}
                        helperText={
                          !!field.value && !field.value.trim()
                            ? "This field is required."
                            : ""
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel className="ai-input-label">
                    Which Jewish practices and rituals do you regularly observe?
                    Check all that apply.
                  </InputLabel>
                  <Controller
                    control={control}
                    name="religiousPractices"
                    defaultValue={customizeMessage?.religiousPractices || []} // Set default value based on existing data
                    render={({ field }) => (
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...field}
                              value="kosherDietaryLaws"
                              checked={field.value.includes(
                                "kosherDietaryLaws"
                              )}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                const value = e.target.value;
                                const updatedPractices = isChecked
                                  ? [...field.value, value]
                                  : field.value.filter(
                                    (practice) => practice !== value
                                  );
                                field.onChange(updatedPractices);
                              }}
                            />
                          }
                          label="Kosher dietary laws"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...field}
                              value="chalabYisroel"
                              checked={field.value.includes("chalabYisroel")}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                const value = e.target.value;
                                const updatedPractices = isChecked
                                  ? [...field.value, value]
                                  : field.value.filter(
                                    (practice) => practice !== value
                                  );
                                field.onChange(updatedPractices);
                              }}
                            />
                          }
                          label="Chalab Yisroel, Pas Yisroel, etc."
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...field}
                              value="shabbat"
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                const value = e.target.value;
                                const updatedPractices = isChecked
                                  ? [...field.value, value]
                                  : field.value.filter(
                                    (practice) => practice !== value
                                  );
                                field.onChange(updatedPractices);
                              }}
                              checked={field.value.includes("shabbat")}
                            />
                          }
                          label="Shabbat"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...field}
                              value="jewishHolidays"
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                const value = e.target.value;
                                const updatedPractices = isChecked
                                  ? [...field.value, value]
                                  : field.value.filter(
                                    (practice) => practice !== value
                                  );
                                field.onChange(updatedPractices);
                              }}
                              checked={field.value.includes("jewishHolidays")}
                            />
                          }
                          label="Jewish holidays"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...field}
                              value="dailyPrayers"
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                const value = e.target.value;
                                const updatedPractices = isChecked
                                  ? [...field.value, value]
                                  : field.value.filter(
                                    (practice) => practice !== value
                                  );
                                field.onChange(updatedPractices);
                              }}
                              checked={field.value.includes("dailyPrayers")}
                            />
                          }
                          label="Daily prayers"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...field}
                              value="familyPurityLaws"
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                const value = e.target.value;
                                const updatedPractices = isChecked
                                  ? [...field.value, value]
                                  : field.value.filter(
                                    (practice) => practice !== value
                                  );
                                field.onChange(updatedPractices);
                              }}
                              checked={field.value.includes("familyPurityLaws")}
                            />
                          }
                          label="Family purity laws"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...field}
                              value="dressModestyRequirements"
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                const value = e.target.value;
                                const updatedPractices = isChecked
                                  ? [...field.value, value]
                                  : field.value.filter(
                                    (practice) => practice !== value
                                  );
                                field.onChange(updatedPractices);
                              }}
                              checked={field.value.includes(
                                "dressModestyRequirements"
                              )}
                            />
                          }
                          label="Dress/modesty requirements"
                        />
                      </FormGroup>
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <InputLabel className="ai-input-label">
                    Which synagogue or community do you primarily associate
                    with?
                  </InputLabel>
                  <Controller
                    control={control}
                    name="synagogueCommunity"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        variant="outlined"
                        placeholder="Enter your synagogue or community"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel className="ai-input-label">
                    Are you looking to be updated with your community events?
                  </InputLabel>
                  <Controller
                    control={control}
                    name="updatedWithCommunityEvents"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        variant="outlined"
                        placeholder="Enter your response"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel className="ai-input-label">
                    Are you interested in volunteering within the community?
                    [Yes] [No]
                  </InputLabel>
                  <Controller
                    control={control}
                    name="isInterestInVolunteer"
                    defaultValue={customizeMessage?.isInterestInVolunteer || ""}
                    render={({ field }) => (
                      <RadioGroup {...field} row>
                        <FormControlLabel
                          value={customizeMessage?.isInterestInVolunteer || true}
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value={false}
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    )}
                  />
                </Grid>
                {(watch("isInterestInVolunteer") == "true" || watch("isInterestInVolunteer") == true) && (
                  <Grid item xs={12}>
                    <InputLabel className="ai-input-label">
                      If yes, what type of volunteering interests you?
                    </InputLabel>
                    <Controller
                      control={control}
                      name="volunteerInterests"
                      defaultValue={customizeMessage?.volunteerInterests || ""}
                      rules={{ required: "This field is required." }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          variant="outlined"
                          placeholder="Enter your interests"
                        />
                      )}
                    />
                    {errors["volunteerInterests"] && (
                      <FormHelperText className="error-message">
                        {errors["volunteerInterests"].message}
                      </FormHelperText>
                    )}
                  </Grid>
                )}
              </Box>
            </Grid>
            <Grid item xl={6} lg={6} md={6} xs={12}>
              <Box>
                <Grid item xs={12}>
                  <Typography variant="h6">
                    Religious Needs and Challenges:
                  </Typography>
                </Grid>
                <Grid item xs={12} mt={2}>
                  <InputLabel className="ai-input-label">
                    What are the biggest challenges you face in maintaining your
                    religious observance in daily life? (Time constraints,
                    access to kosher food, finding stuff and services for
                    Shabbat, etc.)
                  </InputLabel>
                  <Controller
                    control={control}
                    name="religiousChallenges"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        placeholder="Enter your challenges"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel className="ai-input-label">
                    What resources or tools would be most helpful to you in
                    overcoming these challenges?
                  </InputLabel>
                  <Controller
                    control={control}
                    name="toolForOvercomeChallenges"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        placeholder="Enter your resources or tools"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel className="ai-input-label">
                    What types of ideas or resources would you find most
                    valuable to enhance your religious experience? (Educational
                    resources, Shabbat meal planning tools, prayer reminders,
                    job listings for people observing Shabbat, etc.)
                  </InputLabel>
                  <Controller
                    control={control}
                    name="ideaToEnhanceReligiousExperience"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        placeholder="Enter your valuable ideas or resources"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel className="ai-input-label">
                    If yes, what topics are you most interested in? (e.g.,
                    Talmud study, Jewish philosophy, Halacha)
                    [Yes] [No]
                  </InputLabel>
                  <Controller
                    control={control}
                    name="isInterestInReligiousStudies"
                    defaultValue={customizeMessage?.isInterestInReligiousStudies || ""}
                    render={({ field }) => (
                      <RadioGroup {...field} row>
                        <FormControlLabel
                          value={true}
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value={false}
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    )}
                  />
                </Grid>
                {(watch("isInterestInReligiousStudies") == "true" || watch("isInterestInReligiousStudies") == true) && (
                  <Grid item xs={12}>
                    <InputLabel className="ai-input-label">
                      If yes, what topics are you most interested in? (e.g.,
                      Talmud study, Jewish philosophy, Halacha)
                    </InputLabel>
                    <Controller
                      control={control}
                      name="religiousStudies"
                      defaultValue={customizeMessage?.religiousStudies || ""}
                      rules={{ required: "This field is required." }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          value={watch("isInterestInReligiousStudies") == false ? "" : field.value}
                          fullWidth
                          variant="outlined"
                          placeholder="Enter your interests"
                        />
                      )}
                    />
                    {errors["religiousStudies"] && (
                      <FormHelperText className="error-message">
                        {errors["religiousStudies"].message}
                      </FormHelperText>
                    )}
                  </Grid>
                )}
              </Box>
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="center" mt={4}>
            <Button
              onClick={handleUpdate}
              variant="contained"
              color="primary"
              sx={{ marginRight: 2 }}
              disabled={!customizeMessage?.isSuccess}
            >
              Update
            </Button>
            <Button
              onClick={handleDelete}
              variant="contained"
              color="error"
              sx={{ marginRight: 2 }}
              disabled={!customizeMessage?.isSuccess}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              sx={{ marginRight: 2 }}
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={customizeMessage?.isSuccess}
            >
              Save
            </Button>
          </Box>
        </form>
        <Box mt={2}>
          <Typography variant="body1" gutterBottom>
            The responses can be used to determine priority needs, appropriate
            tech capabilities, and suggestions to make your Jewish life easier.
          </Typography>
        </Box>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default AiCustomization;
