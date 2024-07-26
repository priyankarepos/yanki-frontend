
export const messages = {
    mikvahDetailsError: "Error fetching mikvah details:",
    govadenAnswerTooltip: "govaden-answer-tooltip",
    mikvahDetailBox: "mikvah-detail-box",
    mikvahDetailInfo: "mikvah-detail-info",
    mikvahDetailInfoLogo: "mikvah-detail-info-logo",
    mikvahDetailInfoContent: "mikvah-detail-info-content",
    collapsibleTable: "collapsible table",
    notAvailable: "NA",
    cursorPointer: "pointer",
    enterprisePaginationClass: "enterprise-pagination",
    primaryColor: "primary",
    eventFormSubmitButtonLoader: "event-form-submit-button-loader",
    fetchError: 'Error fetching data:',
    mikvahDetailWrapper: "Mikvah-Detail-Wrapper",
    errorFetchingLocation: "Error fetching current location:",
    statusOk: 'OK',
    errorFetchingDirections: "Error fetching directions:",
    nameText: "Name",
    addressText: "Address",
    locationText: "Location",
    buttonContainedVarient: "contained",
    colorBlue: "blue",
    travelMode: "DRIVING",
    mapInputBox: "Map-input-box",
    enterOrigin: "Enter origin",
    enterDestination: "Enter destination",
    text: "text",
    showGoogleMapClass: "ShowGoogleMapClass",
    closeButtonCls: "close-button",
    marginBottom10: "marginBottom-10",
    listLocationMsg: "Below is the list of locations.",
    adminDashboardSidebarIcon: "admin-dashboard-sidebar-icon",
    assignmentIcon: "assignmentIcon",
    createAdminIcon: "createAdminIcon",
    bubbleChatUser: "bubbleChatUser",
    ruleIcon: "ruleIcon",
    categoryIcon: "categoryIcon",
    addIcon: "addIcon",
    accountBalanceIcon: "accountBalanceIcon",
    upload: "upload",
    eventIcon: "eventIcon",
    addLocationAltIcon: "addLocationAltIcon",
    liveHelpIcon: "liveHelpIcon",
    adminChat: "Admin Chat"
};

export const apiUrls = {
    mikvahDetails: `${process.env.REACT_APP_API_HOST}/api/mikvah/mikvah-details`,
    indexAndUpload: `${process.env.REACT_APP_API_HOST}/api/JewishPrayerTextIndex/index-and-upload`,
    updateDocumentKeywords: (pdfId, tags) =>
        `${process.env.REACT_APP_API_HOST}/api/JewishPrayerTextIndex/update-document-keywords?documentId=${encodeURIComponent(pdfId)}&newKeywords=${encodeURIComponent(JSON.stringify(tags))}`,
    documentMapping: (pageNumber) =>
        `${process.env.REACT_APP_API_HOST}/api/JewishPrayerTextIndex/document-mapping?pageNumber=${pageNumber}&pageSize=10`,
};

export const mapContainerStyle = {
    width: '100%',
    height: '400px',
};