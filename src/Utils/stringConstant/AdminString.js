export const message = {
    failedFetchEventLocation: "Failed to fetch event location",
    deleteLocation: "Are you sure you want to delete this location?",
    successDeleteLocation: "Location deleted successfully",
    failedDeleteLocation: "Failed to delete event location",
    errorDeleteLocation: "Error deleting event location",
    locationAlreadyExists: "This location already exists!",
    failedSaveLocation: "Failed to save event location",
    locationAlreadyExists: "This location already exists!",
    locationUpdatedSuccess: "Location updated successfully",
    failedUpdateLocation: "Failed to update event location",
    file: "file",
    imageUploadedSuccess: "Image(s) uploaded successfully.",
    eventApproved : (EventName) => `Event ${EventName} approved successfully`,
    eventRejected : (EventName) => `Event ${EventName} rejected successfully`,
    success: "success",
    askformoreinformation: "The request for more information has been sent successfully",
    requestDeletedSuccess : "Request deleted successfully",
    imageDeletedSuccess: "Image deleted successfully",
    departmentDeletedSuccess: "Department deleted successfully",
    error: "Error:",
    failedFetchEnterpriseDetails: "Failed to fetch enterprise details",
}

export const apiUrls = { 
    getEventLocations: `${import.meta.env.VITE_APP_API_HOST}/api/event-location/get-events-locations`,
    deleteEventLocations: (selectedLocationId) => `${import.meta.env.VITE_APP_API_HOST}/api/event-location/delete-event-location/${selectedLocationId}`,
    addEventLocations: `${import.meta.env.VITE_APP_API_HOST}/api/event-location/add-event-location`,
    updateEventLocations: `${import.meta.env.VITE_APP_API_HOST}/api/event-location/update-event-location`,
    getEventPublicationAreas: `${import.meta.env.VITE_APP_API_HOST}/api/event-publication-area/get-events-publicationAreas`,
    deleteEventPublicationAreas: (selectedAreaId) => `${import.meta.env.VITE_APP_API_HOST}/api/event-publication-area/delete-event-publicationArea/${selectedAreaId}`,
    addEventPublicationAreas: `${import.meta.env.VITE_APP_API_HOST}/api/event-publication-area/add-event-publicationArea`,
    updateEventPublicationAreas: `${import.meta.env.VITE_APP_API_HOST}/api/event-publication-area/update-event-publicationArea`,
    getEventsTypes: `${import.meta.env.VITE_APP_API_HOST}/api/event-type/get-events-types`,
    deleteEventTypes: (selectedEventTypeId) => `${import.meta.env.VITE_APP_API_HOST}/api/event-type/delete-event-type/${selectedEventTypeId}`,
    addEventTypes: `${import.meta.env.VITE_APP_API_HOST}/api/event-type/add-event-type`,
    updateEventTypes: `${import.meta.env.VITE_APP_API_HOST}/api/event-type/update-event-type`,
    getFAQs: `${import.meta.env.VITE_APP_API_HOST}/api/faqManagement/get-faq`,
    deleteFAQs: (selectedFaqId) => `${import.meta.env.VITE_APP_API_HOST}/api/faqManagement/delete-faq/${selectedFaqId}`,
    addFAQs: `${import.meta.env.VITE_APP_API_HOST}/api/faqManagement/add-faq`,
    updateFAQs: `${import.meta.env.VITE_APP_API_HOST}/api/faqManagement/edit-faq`,
    adminUserReport: `${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/admin-user-report`,
    changeRole: `${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/change-role`,
    login: "/login",
    getEnterpriseAllDetails: `${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/get-all-enterprise-details`,
    checkEnterpriseKeyword: (selectedEnterpriseId, tag) => `${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/check-enterprise-department-keyword/${selectedEnterpriseId}/${tag}`,
    getEnterpriseDepartments: (selectedEnterpriseId) => `${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/get-enterprise-departments/${selectedEnterpriseId}`,
    deleteEnterpriseDepartments: (departmentId) => `${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/delete-enterprise-department/${departmentId}`,
    deleteAdminDocument: (pdfName) =>  `${import.meta.env.VITE_APP_API_HOST}/api/AdminDocumentUpload/delete-enterprise-document?fileName=${encodeURIComponent(pdfName)}`,
    updateEnterpriseDepartment: `${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/update-enterprise-department`,
    addEnterpriseDepartment: `${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/add-enterprise-department`,
    adminUploadDocument: (selectedEnterpriseId, boleen) => `${import.meta.env.VITE_APP_API_HOST}/api/AdminDocumentUpload/admin-upload-document?IsCertificate=${boleen}&EnterpriseId=${selectedEnterpriseId}`,
    getEnterpriseDocument: (selectedEnterpriseId) => `${import.meta.env.VITE_APP_API_HOST}/api/AdminDocumentUpload/get-enterprise-document?EnterpriseId=${selectedEnterpriseId}`,
    getEnterpriseCertificate: (selectedEnterpriseId) => `${import.meta.env.VITE_APP_API_HOST}/api/AdminDocumentUpload/get-enterprise-certificate?EnterpriseId=${selectedEnterpriseId}`,
    getEnterprisesCategories: `${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/get-enterprises-categories`,
    deleteEnterprisesCategories: (selectedCategoryId) => `${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/delete-enterprise-category/${selectedCategoryId}`,
    addEnterprisesCategories: `${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/add-enterprise-category`,
    updateEnterprisesCategories: `${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/update-enterprise-category`,
    getEnterprisesRequests : `${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/get-enterprises-requests`,
    approveRejectEnterprisesRequests: (userId, enterpriseId, approveOrReject) => `${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/approve-reject-enterprises-requests/${userId}/${enterpriseId}/${approveOrReject}`,
    deleteEnterprise: (userIdToDelete, enterpriseIdToDelete) => `${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/delete-enterprise/${userIdToDelete}/${enterpriseIdToDelete}`,
    getAllEvents: (pageNumber) => `${import.meta.env.VITE_APP_API_HOST}/api/events/get-allevents?pageNumber=${pageNumber}`,
    getEventsLocations: `${import.meta.env.VITE_APP_API_HOST}/api/event-location/get-events-locations`,
    addEvent: `${import.meta.env.VITE_APP_API_HOST}/api/events/add-event`,
    eventImageUpload: (eventId) => `${import.meta.env.VITE_APP_API_HOST}/api/events/event-image-upload?eventId=${eventId}`,
    updateEvent :`${import.meta.env.VITE_APP_API_HOST}/api/events/update-event`,
    imageUploadUrl: (editEventId) => `${import.meta.env.VITE_APP_API_HOST}/api/events/event-image-upload?eventId=${editEventId}`,
    approveRejectEventsRequests: (eventId, approveOrReject) => `${import.meta.env.VITE_APP_API_HOST}/api/events/approve-reject-events-requests/${eventId}/${approveOrReject}`,
    sendEmailEventSubscribers: (eventId) => `${import.meta.env.VITE_APP_API_HOST}/api/events/send-email-to-eventSubscribers?eventId=${eventId}`,
    deleteEvent: (eventIdToDelete) => `${import.meta.env.VITE_APP_API_HOST}/api/events/delete-event/${eventIdToDelete}`,
    deleteEventImage: (imageId) => `${import.meta.env.VITE_APP_API_HOST}/api/events/delete-event-image/${imageId}`,
    getEnterpriseDetails: `${import.meta.env.VITE_APP_API_HOST}/api/yanki-ai/get-enterprise-details`,
    getEnterpriseDocumentUpload: `${import.meta.env.VITE_APP_API_HOST}/api/EnterpriseDocumentUpload/get-enterprise-document`,
    uploadEnterpriseDocument: `${import.meta.env.VITE_APP_API_HOST}/api/EnterpriseDocumentUpload/upload-enterprise-document?IsCertificate=false`,
    deleteEnterpriseDocument: (pdfName) => `${import.meta.env.VITE_APP_API_HOST}/api/EnterpriseDocumentUpload/delete-enterprise-document?fileName=${encodeURIComponent(pdfName)}`,
}   