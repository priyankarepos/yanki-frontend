
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
};

export const apiUrls = {
    mikvahDetails: `${process.env.REACT_APP_API_HOST}/api/mikvah/mikvah-details`,
    indexAndUpload: (pdfName, keywords) => `${process.env.REACT_APP_API_HOST}/api/JewishPrayerTextIndex/index-and-upload?PdfName=${encodeURIComponent(pdfName)}&Keywords=${encodeURIComponent(JSON.stringify(keywords))}`,
    updateDocumentKeywords: (pdfId, tags) =>
        `${process.env.REACT_APP_API_HOST}/api/JewishPrayerTextIndex/update-document-keywords?documentId=${encodeURIComponent(pdfId)}&newKeywords=${encodeURIComponent(JSON.stringify(tags))}`,
    documentMapping: (pageNumber) =>
        `${process.env.REACT_APP_API_HOST}/api/JewishPrayerTextIndex/document-mapping?pageNumber=${pageNumber}&pageSize=10`,
};
