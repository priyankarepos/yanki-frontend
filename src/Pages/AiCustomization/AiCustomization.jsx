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
import { useTranslation } from 'react-i18next';
import { messages } from "../../Utils/stringConstant/EnterpriseProfileString";

const AiCustomization = () => {
  const { t } = useTranslation();
  const yankiUser = JSON.parse(
    window.localStorage.getItem(import.meta.env.VITE_APP_LOCALSTORAGE_TOKEN) ||
    "{}"
  );
  const userRoles = yankiUser?.userObject?.userRoles || "";
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
        const response = await axios.get(apiUrls.getCustomPrompt);

        if (response.status === 200) {
          setCustomizeMessage(response.data);
        }
      } catch (error) {
        setSnackbarMessage(`${t('errorFetchingPhoneNumber')}: ${error}`);
        setSnackbarOpen(true);
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
    try {
      // Check if religiousPractices is an array
      if (Array.isArray(data.religiousPractices)) {
        const selectedPractices = data.religiousPractices;

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
          isInterestInReligiousStudies: JSON.parse(
            data.isInterestInReligiousStudies
          ),
          volunteerInterests: data.volunteerInterests,
          religiousChallenges: data.religiousChallenges,
          toolForOvercomeChallenges: data.toolForOvercomeChallenges,
          ideaToEnhanceReligiousExperience:
            data.ideaToEnhanceReligiousExperience,
          religiousStudies: data.religiousStudies,
        };

        const response = await axios.post(
          apiUrls.addCustomPrompt,
          requestBody,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setSnackbarMessage(response.data.message);
        setSnackbarOpen(true);
        window.location.reload();
      } else {
        setSnackbarMessage(`${t('errorReligiousPracticesNotArray')}`);
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage(`${t('errorPleaseFillData')}`);
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(apiUrls.deleteCustomPrompt);

      if (response.status === 200) {
        setSnackbarMessage(`${t('promptDeletedSuccessfully')}`);
        setSnackbarOpen(true);
        window.location.reload();
      } else {
        setSnackbarMessage(`${t('failedToDeletePrompt')}`);
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage(`${t('errorFailedToDeletePrompt')}: ${error}`);
      setSnackbarOpen(true);
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = getValues();
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
        volunteerInterests:
          formData.isInterestInVolunteer === "false"
            ? ""
            : formData.volunteerInterests,
        religiousChallenges: formData.religiousChallenges,
        toolForOvercomeChallenges: formData.toolForOvercomeChallenges,
        ideaToEnhanceReligiousExperience:
          formData.ideaToEnhanceReligiousExperience,
        religiousStudies:
          formData.isInterestInReligiousStudies === "false"
            ? ""
            : formData.religiousStudies,
        isInterestInVolunteer: JSON.parse(formData.isInterestInVolunteer),
        isInterestInReligiousStudies: JSON.parse(
          formData.isInterestInReligiousStudies
        ),
      };

      const response = await axios.put(
        apiUrls.updateCustomPrompt,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setSnackbarMessage(`${t('promptUpdatedSuccessfully')}`);
        setSnackbarOpen(true);
        window.location.reload();
      } else {
        setSnackbarMessage(`${t('failedToUpdatePrompt')}`);
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage(`${t('errorFailedToUpdatePrompt')}: ${error}`);
      setSnackbarOpen(true);
    }
  };

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" align="center" className="Ai-Heading">
          {t('aICustomizationTxt')}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>
          {t('aiCustomizationInfo')}
          </strong>
        </Typography>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={
            userRoles === "Enterprise"
              ? "section-container-light"
              : "section-container"
          }
        >
          <Grid container spacing={2}>
            <Grid item xl={6} lg={6} md={6} xs={12}>
              <Box>
                <Grid item xs={12}>
                  <Typography variant="h6">{t('generalInformation')}</Typography>
                </Grid>

                <Grid item xs={12} mt={2}>
                  <InputLabel className="ai-input-label">
                    {t('judaismBranchLabel')}
                  </InputLabel>
                  <Controller
                    control={control}
                    name="judaismBranch"
                    render={({ field }) => (
                      <TextField
                        className="Ai-TextField"
                        {...field}
                        type="text"
                        placeholder={t('enterHerePlaceholder')}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel className="ai-input-label">
                  {t('ageRangeLabel')}
                  </InputLabel>
                  <Controller
                    control={control}
                    name="ageRange"
                    rules={{ min: 1, max: 200 }}
                    render={({ field }) => (
                      <div>
                        <TextField
                          {...field}
                          fullWidth
                          variant="outlined"
                          placeholder={t('enterAgeRangePlaceholder')}
                          type="number"
                        />
                        {errors.ageRange && errors.ageRange.type === "min" && (
                          <FormHelperText className="error-message">
                            {t('minimumAgeIs1')}
                          </FormHelperText>
                        )}
                        {errors.ageRange && errors.ageRange.type === "max" && (
                          <FormHelperText className="error-message">
                            {t('maximumAgeIs200')}
                          </FormHelperText>
                        )}
                      </div>
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel className="ai-input-label">
                  {t('maritalStatusLabel')}
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
                          label={t('singleAIRadioLabel')}
                        />
                        <FormControlLabel
                          value="married"
                          control={<Radio />}
                          label={t('marriedAIRadioLabel')}
                        />
                        <FormControlLabel
                          value="divorced"
                          control={<Radio />}
                          label={t('divorcedAIRadioLabel')}
                        />
                        <FormControlLabel
                          value="widowed"
                          control={<Radio />}
                          label={t('widowedAIRadioLabel')}
                        />
                      </RadioGroup>
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel className="ai-input-label">
                    {t('childrenLabel')}
                  </InputLabel>
                  <Controller
                    control={control}
                    name="numberOfChildren"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        variant="outlined"
                        placeholder={t('enterChildInfoPlaceholder')}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel className="ai-input-label">
                    {t('locationLabel')}
                  </InputLabel>
                  <Controller
                    control={control}
                    name="location"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        variant="outlined"
                        placeholder={t('enterLocationPlaceholder')}
                        error={!!field.value && !field.value.trim()}
                        helperText={
                          !!field.value && !field.value.trim()
                            ? `${t('thisFieldIsRequired')}`
                            : ""
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel className="ai-input-label">
                    {t('levelOfReligiousObservanceLabel')}
                  </InputLabel>
                  <Controller
                    control={control}
                    name="levelOfReligiousObservance"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        variant="outlined"
                        placeholder={t('enterReligiousObservancePlaceholder')}
                        error={!!field.value && !field.value.trim()}
                        helperText={
                          !!field.value && !field.value.trim()
                            ? `${t('thisFieldIsRequired')}`
                            : ""
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel className="ai-input-label">
                    {t('religiousPracticesLabel')}
                  </InputLabel>
                  <Controller
                    control={control}
                    name="religiousPractices"
                    defaultValue={customizeMessage?.religiousPractices || []} 
                    render={({ field }) => (
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...field}
                              value="kosherDietaryLaws"
                              checked={
                                field.value &&
                                field.value.includes("kosherDietaryLaws")
                              }
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                const value = e.target.value;
                                const currentValue = Array.isArray(field.value)
                                  ? field.value
                                  : [];
                                const updatedPractices = isChecked
                                  ? [...currentValue, value]
                                  : currentValue.filter(
                                    (practice) => practice !== value
                                  );
                                field.onChange(updatedPractices);
                              }}
                            />
                          }
                          label={t('kosherDietaryLaws')}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...field}
                              value="chalabYisroel"
                              checked={
                                (field.value &&
                                  field.value.includes("chalabYisroel")) ||
                                false
                              }
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                const value = e.target.value;
                                const currentValue = Array.isArray(field.value)
                                  ? field.value
                                  : [];
                                const updatedPractices = isChecked
                                  ? [...currentValue, value]
                                  : currentValue.filter(
                                    (practice) => practice !== value
                                  );
                                field.onChange(updatedPractices);
                              }}
                            />
                          }
                          label={t('chalabYisroelPasYisroelEtc')}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...field}
                              value="shabbat"
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                const value = e.target.value;
                                const currentValue = Array.isArray(field.value)
                                  ? field.value
                                  : [];
                                const updatedPractices = isChecked
                                  ? [...currentValue, value]
                                  : currentValue.filter(
                                    (practice) => practice !== value
                                  );
                                field.onChange(updatedPractices);
                              }}
                              checked={
                                field.value && field.value.includes("shabbat")
                              }
                            />
                          }
                          label={t('shabbatPlaceholder')}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...field}
                              value="jewishHolidays"
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                const value = e.target.value;
                                const currentValue = Array.isArray(field.value)
                                  ? field.value
                                  : [];
                                const updatedPractices = isChecked
                                  ? [...currentValue, value]
                                  : currentValue.filter(
                                    (practice) => practice !== value
                                  );
                                field.onChange(updatedPractices);
                              }}
                              checked={
                                field.value &&
                                field.value.includes("jewishHolidays")
                              }
                            />
                          }
                          label={t('jewishHolidays')}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...field}
                              value="dailyPrayers"
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                const value = e.target.value;
                                const currentValue = Array.isArray(field.value)
                                  ? field.value
                                  : [];
                                const updatedPractices = isChecked
                                  ? [...currentValue, value]
                                  : currentValue.filter(
                                    (practice) => practice !== value
                                  );
                                field.onChange(updatedPractices);
                              }}
                              checked={
                                field.value &&
                                field.value.includes("dailyPrayers")
                              }
                            />
                          }
                          label={t('dailyPrayers')}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...field}
                              value="familyPurityLaws"
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                const value = e.target.value;
                                const currentValue = Array.isArray(field.value)
                                  ? field.value
                                  : [];
                                const updatedPractices = isChecked
                                  ? [...currentValue, value]
                                  : currentValue.filter(
                                    (practice) => practice !== value
                                  );
                                field.onChange(updatedPractices);
                              }}
                              checked={
                                field.value &&
                                field.value.includes("familyPurityLaws")
                              }
                            />
                          }
                          label={t('familyPurityLaws')}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...field}
                              value="dressModestyRequirements"
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                const value = e.target.value;
                                const currentValue = Array.isArray(field.value)
                                  ? field.value
                                  : [];
                                const updatedPractices = isChecked
                                  ? [...currentValue, value]
                                  : currentValue.filter(
                                    (practice) => practice !== value
                                  );
                                field.onChange(updatedPractices);
                              }}
                              checked={
                                field.value &&
                                field.value.includes("dressModestyRequirements")
                              }
                            />
                          }
                          label={t('dressModestyRequirements')}
                        />
                      </FormGroup>
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <InputLabel className="ai-input-label">
                    {t('synagogueCommunityLabel')}
                  </InputLabel>
                  <Controller
                    control={control}
                    name="synagogueCommunity"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        variant="outlined"
                        placeholder={t('enterYourSynagogueOrCommunity')}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel className="ai-input-label">
                    {t('communityEventsLabel')}
                  </InputLabel>
                  <Controller
                    control={control}
                    name="updatedWithCommunityEvents"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        variant="outlined"
                        placeholder={t('enterYourResponse')}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel className="ai-input-label">
                    {t('interestInVolunteerLabel')}
                  </InputLabel>
                  <Controller
                    control={control}
                    name="isInterestInVolunteer"
                    defaultValue={customizeMessage?.isInterestInVolunteer || ""}
                    render={({ field }) => (
                      <RadioGroup {...field} row>
                        <FormControlLabel
                          value={
                            customizeMessage?.isInterestInVolunteer || true
                          }
                          control={<Radio />}
                          label={t('yes')}
                        />
                        <FormControlLabel
                          value={false}
                          control={<Radio />}
                          label={t('no')}
                        />
                      </RadioGroup>
                    )}
                  />
                </Grid>
                {(watch("isInterestInVolunteer") === "true" ||
                  watch("isInterestInVolunteer") === true) && (
                    <Grid item xs={12}>
                      <InputLabel className="ai-input-label">
                        {t('volunteerInterestsLabel')}<sup className={messages.requiredIcon}>*</sup>
                      </InputLabel>
                      <Controller
                        control={control}
                        name="volunteerInterests"
                        defaultValue={customizeMessage?.volunteerInterests || ""}
                        rules={{ required: `${t('thisFieldIsRequired')}` }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            variant="outlined"
                            placeholder={t('enterYourInterests')}
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
                    {t('religiousNeedsAndChallengesTitle')}
                  </Typography>
                </Grid>
                <Grid item xs={12} mt={2}>
                  <InputLabel className="ai-input-label">
                    {t('religiousChallengesLabel')}
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
                        placeholder={t('enterYourChallenges')}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel className="ai-input-label">
                    {t('toolForOvercomeChallengesLabel')}
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
                        placeholder={t('enterYourResourcesOrTools')}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel className="ai-input-label">
                    {t('ideaToEnhanceReligiousExperienceLabel')}
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
                        placeholder={t('enterYourValuableIdeasOrResources')}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel className="ai-input-label">
                    {t('interestInReligiousStudiesLabel')}
                  </InputLabel>
                  <Controller
                    control={control}
                    name="isInterestInReligiousStudies"
                    defaultValue={
                      customizeMessage?.isInterestInReligiousStudies || ""
                    }
                    render={({ field }) => (
                      <RadioGroup {...field} row>
                        <FormControlLabel
                          value={true}
                          control={<Radio />}
                          label={t('yes')}
                        />
                        <FormControlLabel
                          value={false}
                          control={<Radio />}
                          label={t('no')}
                        />
                      </RadioGroup>
                    )}
                  />
                </Grid>
                {(watch("isInterestInReligiousStudies") === "true" ||
                  watch("isInterestInReligiousStudies") === true) && (
                    <Grid item xs={12}>
                      <InputLabel className="ai-input-label">
                        {t('religiousStudiesLabel')}<sup className={messages.requiredIcon}>*</sup>
                      </InputLabel>
                      <Controller
                        control={control}
                        name="religiousStudies"
                        defaultValue={customizeMessage?.religiousStudies || ""}
                        rules={{ required: `${t('thisFieldIsRequired')}` }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            value={
                              watch("isInterestInReligiousStudies") === false
                                ? ""
                                : field.value
                            }
                            fullWidth
                            variant="outlined"
                            placeholder={t('enterYourInterests')}
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
              className="ai-customization-button"
              disabled={!customizeMessage?.isSuccess}
            >
              {t('updateButton')}
            </Button>
            <Button
              onClick={handleDelete}
              variant="contained"
              color="error"
              className="ai-customization-button"
              disabled={!customizeMessage?.isSuccess}
            >
              {t('deleteButton')}
            </Button>
            <Button
              variant="contained"
              className="ai-customization-button"
              onClick={() => navigate("/")}
            >
              {t('cancelButton')}
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={customizeMessage?.isSuccess}
            >
              {t('saveButton')}
            </Button>
          </Box>
        </form>
        <Box mt={2}>
          <Typography variant="body1" gutterBottom>
            {t('responseUsageText')}
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
