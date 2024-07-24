
export const messages = {
    fetchError: 'Error fetching data:',
    documentAdded: 'Document with Name ',
    addedSuccessfully: ' added successfully',
    uploadFailed: 'Failed to upload file',
    uploadError: 'An error occurred while uploading the file.',
    deleteConfirm: 'Are you sure you want to delete this file?',
    deleteSuccess: 'Document with Name ',
    deletedSuccessfully: ' deleted successfully',
    deleteFailed: 'Failed to delete document:',
    deleteError: 'Error deleting document:',
    fetchCategoriesFailed: 'Failed to fetch enterprise categories',
    fetchDetailsFailed: 'Failed to fetch enterprise details',
    keywordExists: 'Keyword already exists:',
    keywordNotExist: 'Keyword does not exist:',
    keywordUndefined: 'Keyword existence is undefined for:',
    keywordCheckFailed: 'Failed to check enterprise keyword',
    tagLimitReached: 'You have reached the maximum limit of tags (25).',
    tagTooLong: 'Tag should not exceed 40 characters.',
    tagNotAvailable: 'Tag is not available in this enterprise.',
    oneTagRequired: 'At least one tag is required.',
    updateSuccess: 'Enterprise details updated successfully. You can now start adding departments',
    AdminEnterpriseUpdateSuccess: 'Enterprise details updated successfully.',
    updateSuccessNoDepartments: 'Enterprise details updated successfully',
    updateFailed: 'Failed to update enterprise details',
    updateError: 'Error updating enterprise details:',
    placeDetailsError: "No details available for input: '",
    oneKeywordRequired: "At least one keyword is required",
    openCloseTimeNotSame: "Opening and closing times cannot be the same",
    errorCheckENterpriseKeyword: "Error checking enterprise keyword:",
    invalidFileType: "Invalid file type. Please upload a JPEG, PNG, or PDF file.",
    productOverviewPlaceholder: `Product Overview:\n• Could you please provide an overview of the products you offer?\n• What are the key features and benefits of your products?\n\nService Offerings:\n• What services does your enterprise provide, and what’s the market you’re focusing?\n• Are there any unique or specialized services that your enterprise offers?\n`,
    errorHandelingTag: "Error handling tag: ",
    myEnterpriseProfileHeading: "My Enterprise Profile",
    enterpriseNameRequired: "Enterprise name is required.",
    enterpriseNameMin3: "Enterprise name should be at least 3 characters long.",
    enterpriseNameMax30: "Enterprise name should not exceed 30 characters.",
    enterpriseNamePlaceholder: "Type enterprise name here",
    enterprisePointOfContactRequired: "Enterprise Point Of Contact is required.",
    enterprisePointOfContactMin3: "Enterprise Point Of Contact should be at least 3 characters long.",
    enterprisePointOfContactMax30: "Enterprise Point Of Contact should not exceed 30 characters.",
    enterprisePointOfContactPlaceholder: "Enterprise point of contact name",
    enterpriseAddressRequired: "Enterprise Address is required",
    enterpriseAddressPlaceholder: "Type enterprise address here",
    enterpriseLatitude: "Latitude",
    enterpriseLongitude: "Longitude",
    enterpriseEmailAddressRequired: "Email address is required.",
    enterpriseEmailAddressValid: "Enter valid email address.",
    enterpriseEmailAddressplaceholder: "Type email address here",
    enterprisePhoneNumberRequired: "Phone number is required.",
    enterprisePhoneNumberValid: "Enter valid phone number",
    enterprisePhoneNumberplaceholder: "Phone number",
    phoneNumberLabel: 'Phone Number',
    websiteUrlLabel: 'Website URL',
    whatsappPhoneNumberLabel: 'WhatsApp Phone Number',
    instagramUsernameLabel: 'Instagram Username',
    linkedinUsernameLabel: 'LinkedIn Username',
    enterpriseDescriptionLabel: 'Enterprise Description',
    enterpriseCategoriesLabel: 'Enterprise Categories',
    businessHoursOpeningTimeLabel: 'Business Hours Opening Time',
    businessHoursClosingTimeLabel: 'Business Hours Closing Time',
    foundedYearLabel: 'Founded Year',
    religiousCertificationsLabel: 'Religious Certifications',
    frequentlyAskedQuestionsLabel: 'Frequently Asked Questions (FAQs)',
    enterpriseIdentificationKeywordsLabel: 'Enterprise identification keywords',
    saveButtonText: 'Save',
    saveChangesButtonText: 'Save Changes',
    uploadButtonText: 'Please complete your profile first.',
    enterpriseIdentificationKeywordsPlaceholderText: 'Type Enterprise identification keywords here',
    enterpriseNameLabel: 'Enterprise Name',
    enterprisePointOfContactLabel: 'Enterprise point of contact',
    enterpriseAddressLabel: 'Enterprise address',
    latitudeLabel: 'Latitude',
    longitudeLabel: 'Longitude',
    emailAddressLabel: 'Email Address',
    errorFetchEnterpriseDetails : "Error fetching enterprise details:",
    EnterpriseCreatedSuccessfully : "Enterprise details created successfully.",
    EnterpriseCreatedFailed : "Failed to create enterprise details",
    EnterpriseCreatedError : "Error creating enterprise details:",
    createdEnterpriseDelete : "Are you sure you want to delete the enterprise",
    adminDeleteEnterpriseFailed : "Failed to delete enterprise",
    adminDeleteEnterpriseError : "Error deleting enterprise:",
    enterpriseProfileSubmitButton : 'enterprise-profile-submit-button',
    noDetailsAvailable: (placeName) => `No details available for input: '${placeName}'`,
    enterpriseLabelClass : "enterprise-label",
    enterpriseInputFieldClass : "enterprise-inputField",
    requiredIcon : "required-icon",
    asterisk : "asterisk",
    enterpriseInputLabel : "enterprise-input-lable",
    addressElementId: 'address',
    enterpriseAddressField: 'EnterpriseAddress',
    enterpriseLatitudeField: 'EnterpriseLatitude',
    enterpriseLongitudeField: 'EnterpriseLongitude',
    latitudeRequired: 'Latitude is required',
    longitudeRequired: 'Longitude is required',
    createAdminEnterpriseErrorclass : "error-message",
    enterpriseProfileInputField : "enterprise-input-field",
    scriptText : "script",
    googleMapAPIFullyLoaded : "Google Maps API or places library not fully loaded.",
};

export const apiUrls = {
    getCertificate: `${import.meta.env.VITE_APP_API_HOST}/api/EnterpriseDocumentUpload/get-enterprise-certificate`,
    uploadDocument: `${import.meta.env.VITE_APP_API_HOST}/api/EnterpriseDocumentUpload/upload-enterprise-document?IsCertificate=true`,
    deleteDocument: `${import.meta.env.VITE_APP_API_HOST}/api/EnterpriseDocumentUpload/delete-enterprise-document?fileName=`,
    getEnterpriseCategories: `${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/get-enterprises-categories`,
    getEnterpriseDetails: `${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/get-enterprise-details`,
    checkEnterpriseKeyword: `${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/check-enterprise-keyword/`,
    adminCreateEnterprise :`${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/admin-create-enterprise`,
    updateEnterpriseDetails: `${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/update-enterprise-details`,
    googleMapsApi: (apiKey) => `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initAutocomplete`,
    adminDeleteEnterprise: (enterpriseId) => `${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/admin-delete-enterprise/${enterpriseId}`,
    
};
