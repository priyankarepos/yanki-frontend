import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Collapse,
    Box,
    Tooltip,
    Grid,
    Snackbar,
    Button,
} from "@mui/material";
import {
    Business as BusinessIcon,
    Phone as PhoneIcon,
    Schedule as ScheduleIcon,
    Email as EmailIcon,
    LocationOn as LocationOnIcon,
    Person as PersonIcon,
    PanToolAlt as PanToolAltIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
    Close as CloseIcon,
    AttachFile as AttachFileIcon,
} from "@mui/icons-material";
import "../../Pages/NewHomePageMui/NewHomePageStyle.scss";
import "../MikvahList/MikvahAnswer.scss";
import { apiUrls, classNames, mapContainerStyle, messages } from "../../Utils/stringConstant/stringConstant";
import { Context } from "../../App";
import { useJsApiLoader } from "@react-google-maps/api";
import {
    GoogleMap,
    DirectionsService,
    DirectionsRenderer,
    Marker,
} from "@react-google-maps/api";
import { useTranslation } from "react-i18next";
import PdfModal from "../PdfModal";
import "./EnterpriseDetailList.scss";

const EnterpriseDetailList = ({ answer }) => {

    const { t } = useTranslation();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const { activeTab, userLatitude, userLongitude, isLocationAllowed } = useContext(Context);
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY,
    });

    const Row = ({ row }) => {
        const [openDetails, setOpenDetails] = useState(false);
        const [enterpriseDetails, setEnterpriseDetail] = useState(null);
        const [response, setResponse] = useState(null);
        const [origin, setOrigin] = useState('');
        const [destination, setDestination] = useState('');
        const [shouldFetchDirections, setShouldFetchDirections] = useState(false);
        const [showMap, setShowMap] = useState(false);
        const [loadingDetails, setLoadingDetails] = useState(false);
        const [selectedPdf, setSelectedPdf] = useState(null);

        const handleOpenEmailClient = (event) => {
            event.preventDefault();
            const emailToUse = enterpriseDetails?.enterpriseEmail;
            const mailtoLink = `mailto:${emailToUse}?subject=${messages.emailSubject}&body=${messages.emailBody}`;
            window.open(mailtoLink, '_blank');
        };

        const handleCall = (phoneNumber, event) => {
            event.preventDefault();
            if (phoneNumber && phoneNumber.trim() !== "") {
                window.open(`tel:${phoneNumber}`, '_self');
            } else {
                setSnackbarMessage(t('invalidPhoneNumber'));
                setSnackbarOpen(true);
            }
        };

        const getShortPdfName = (pdfUrl) => {
            return pdfUrl ? pdfUrl.split('/').pop() : '';
        };

        const handleItemClick = (pdfUrl) => {
            setSelectedPdf(pdfUrl);
        };

        const closePdfModal = () => {
            setSelectedPdf(null);
        };

        useEffect(() => {
            if (isLocationAllowed === messages.locationAllowed && open && !origin) {
                checkPermissionsAndFetchLocation();
            }
        }, [isLocationAllowed, openDetails, origin]);

        const fetchEnterpriseDetails = async () => {
            setLoadingDetails(true);
            try {
                const response = await axios.get(apiUrls.enterpriseDetailList, {
                    params: {
                        enterpriseId: row.enterpriseId
                    }
                });
                setEnterpriseDetail(response.data);
            } catch (error) {
                setSnackbarMessage(`${t('errorFetchingenterpriseDetails')}`);
                setSnackbarOpen(true);
            } finally {
                setLoadingDetails(false);
            }
        };

        const checkPermissionsAndFetchLocation = async () => {
            if (navigator.geolocation) {
                try {
                    const handleGeolocationSuccess = (position) => {
                        const { latitude, longitude } = position.coords;
                        setOrigin(`${latitude},${longitude}`);
                        if (shouldFetchDirections) {
                            fetchDirections();
                        }
                    };

                    const handleGeolocationError = (error) => {
                        if (error.code === error.PERMISSION_DENIED) {
                            setSnackbarMessage(`${t('enableLocationAccess')}`);

                        } else {
                            setSnackbarMessage(`${t('enableLocationAccess')}`);
                        }
                        setSnackbarOpen(true);
                    };

                    if (navigator.permissions && navigator.permissions.query) {
                        const result = await navigator.permissions.query({ name: messages.geolocationText });
                        if (result.state === messages.grantedText) {
                            navigator.geolocation.getCurrentPosition(handleGeolocationSuccess, handleGeolocationError);
                        } else if (result.state === messages.promptText) {
                            navigator.geolocation.getCurrentPosition(handleGeolocationSuccess, handleGeolocationError);
                        } else {
                            setSnackbarMessage(`${t('enableLocationAccess')}`);

                            setSnackbarOpen(true);
                        }

                        result.onchange = () => {
                            if (result.state === messages.grantedText) {
                                navigator.geolocation.getCurrentPosition(handleGeolocationSuccess, handleGeolocationError);
                            } else {
                                setSnackbarMessage(`${t('enableLocationAccess')}`);

                                setSnackbarOpen(true);
                            }
                        };
                    } else {
                        navigator.geolocation.getCurrentPosition(handleGeolocationSuccess, handleGeolocationError);
                    }
                } catch (error) {
                    setSnackbarMessage(messages.errorCheckLocationPermission);
                    setSnackbarOpen(true);
                }
            }
        };

        const fetchDirections = () => {
            if (origin && destination) {
                setShouldFetchDirections(true);
            }
        };

        const directionsCallback = (result, status) => {
            if (status === messages.statusOk) {
                setResponse(result);
            } else if (status === messages.zeroResultTxt) {
                setSnackbarMessage(messages.noRouteFoundMsg);
                setSnackbarOpen(true);
                setResponse(null);
            } else {
                setSnackbarMessage(`${t('routeNotAvailable')}`);
                setSnackbarOpen(true);
                setResponse(null);
            }
            setShouldFetchDirections(false);
        };

        const handleSetDestination = () => {
            setDestination(`${row.latitude},${row.longitude}`);
            setShouldFetchDirections(true);
            setShowMap(true);
            if (origin) {
                fetchDirections();
            } else {
                checkPermissionsAndFetchLocation();
            }
            if (isLocationAllowed === messages.locationAllowed) {
                handleShowDetails(false);
            }
        };
        const handleShowDetails = (toggle = true) => {
            setOpenDetails(prevOpen => {
                const newOpen = toggle ? !prevOpen : prevOpen;
                if (newOpen) {
                    fetchEnterpriseDetails();
                } else {
                    setShowMap(false);
                }
                return newOpen;
            });
        };
        const handleLocationIconClick = () => {
            if (isLocationAllowed === messages.locationAllowed) {
                if (!openDetails) {
                    // Open both the details and map on the first click
                    setOpenDetails(true);
                }
                handleSetDestination();
            } else {
                setSnackbarMessage(`${t('enableLocationAccess')}`);
                setSnackbarOpen(true);
                handleShowDetails(false);
            }
        };

        const handleCloseMap = () => {
            setShowMap(false);
            setResponse(null);
            setDestination('');
        };

        const center = { lat: userLatitude, lng: userLongitude };

        return (
            <>
                <TableRow>
                    <TableCell onClick={() => handleShowDetails()} sx={{ cursor: messages.cursorPointer }}>
                        <p>{openDetails ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}</p>
                    </TableCell>
                    <TableCell onClick={() => handleShowDetails()} sx={{ cursor: messages.cursorPointer }}>
                        <Tooltip title={row.enterpriseName}>
                            <span>{row.enterpriseName ? row.enterpriseName : messages.notAvailable}</span>
                        </Tooltip>
                    </TableCell>
                    <TableCell onClick={() => handleShowDetails()} sx={{ cursor: messages.cursorPointer }}>
                        <Tooltip title={row.enterpriseAddress.trim() || messages.notAvailable}>
                            <div className={messages.govadenAnswerTooltip}>
                                {row.enterpriseAddress.trim() ? row.enterpriseAddress : messages.notAvailable}
                            </div>
                        </Tooltip>
                    </TableCell>
                    <TableCell>
                        <Box className={messages.mikvahDetailInfo}>
                            <Button variant={messages.buttonContainedVarient} onClick={handleLocationIconClick} >
                                <LocationOnIcon />
                            </Button>
                        </Box>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{ py: 0 }} colSpan={6} className={activeTab === 0 && messages.mikvahDetailWrapper}>
                        <Collapse in={openDetails} unmountOnExit>
                            <Box sx={{ margin: 1 }} className={`${showMap ? messages.displayNoneClass : ""} ${messages.mikvahDetailBox}`}>
                                {enterpriseDetails ? (
                                    <Grid container spacing={2}>
                                        <Grid item lg={6} md={6} sm={6} xs={12}>
                                            <Box className={messages.mikvahDetailInfo}>
                                                <Typography className={messages.mikvahDetailInfoLogo}>
                                                    <BusinessIcon />
                                                </Typography>
                                                <Box className={messages.mikvahDetailInfoContent}>
                                                    <Typography>
                                                        <strong>{t('enterpriseName')}</strong>
                                                    </Typography>
                                                    <Typography>
                                                        {enterpriseDetails?.enterpriseName?.trim() ? enterpriseDetails.enterpriseName : messages.notAvailable}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box className={messages.mikvahDetailInfo}>
                                                <Typography className={messages.mikvahDetailInfoLogo}>
                                                    <PersonIcon />
                                                </Typography>
                                                <Box className={messages.mikvahDetailInfoContent}>
                                                    <Typography>
                                                        <strong>{t('enterprisePointOfContact')}:</strong>
                                                    </Typography>
                                                    <Typography>
                                                        {enterpriseDetails?.contactPersonName
                                                            ?.trim() ? enterpriseDetails.contactPersonName
                                                            : messages.notAvailable}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box className={messages.mikvahDetailInfo}>
                                                <Typography className={messages.mikvahDetailInfoLogo}>
                                                    <LocationOnIcon />
                                                </Typography>
                                                <Box className={messages.mikvahDetailInfoContent}>
                                                    <Typography>
                                                        <strong>{t('enterpriseAddress')}:</strong>
                                                    </Typography>
                                                    <Typography>
                                                        {enterpriseDetails?.enterpriseAddress?.trim() ? enterpriseDetails.enterpriseAddress : messages.notAvailable}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box className={messages.mikvahDetailInfo}>
                                                <Typography className={messages.mikvahDetailInfoLogo}>
                                                    <EmailIcon />
                                                </Typography>
                                                <Box className={messages.mikvahDetailInfoContent}>
                                                    <Typography>
                                                        <strong>{t('emailAddress')}:</strong>
                                                    </Typography>
                                                    <Typography className={classNames.emailClick}>
                                                        <a onClick={handleOpenEmailClient}>
                                                            {enterpriseDetails?.enterpriseEmail ? enterpriseDetails.enterpriseEmail : messages.notAvailable}
                                                        </a>
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                        <Grid item lg={6} md={6} sm={6} xs={12}>
                                            <Box className={messages.mikvahDetailInfo}>
                                                <Typography className={messages.mikvahDetailInfoLogo}>
                                                    <PhoneIcon />
                                                </Typography>
                                                <Box className={messages.mikvahDetailInfoContent}>
                                                    <Typography>
                                                        <strong>{t('phoneNumber')}</strong>
                                                    </Typography>
                                                    {enterpriseDetails?.enterprisePhoneNumber.trim() ? <div><Typography className={classNames.emailClick}>
                                                        <a onClick={(event) => handleCall(enterpriseDetails?.enterprisePhoneNumber, event)}>
                                                            {enterpriseDetails?.enterprisePhoneNumber ? enterpriseDetails.enterprisePhoneNumber : messages.notAvailable}
                                                        </a>
                                                    </Typography>
                                                    </div> : <Typography>NA</Typography>}
                                                </Box>
                                            </Box>
                                            <Box className={messages.mikvahDetailInfo}>
                                                <Typography className={messages.mikvahDetailInfoLogo}>
                                                    <PanToolAltIcon />
                                                </Typography>
                                                <Box className={messages.mikvahDetailInfoContent}>
                                                    <Typography>
                                                        <strong>{t('enterpriseDescription')}</strong>
                                                    </Typography>
                                                    {enterpriseDetails?.enterpriseDescription.trim() ? <div><Typography>{enterpriseDetails.enterpriseDescription}</Typography>
                                                    </div> : <Typography>NA</Typography>}
                                                </Box>
                                            </Box>
                                            <Box className={messages.mikvahDetailInfo}>
                                                <Typography className={messages.mikvahDetailInfoLogo}>
                                                    <ScheduleIcon />
                                                </Typography>
                                                <Box className={messages.mikvahDetailInfoContent}>
                                                    <Typography>
                                                        <strong>{t('businessHoursOpeningTime')}</strong>
                                                    </Typography>
                                                    {enterpriseDetails?.officeOpenTime.trim() ? <div><Typography>{enterpriseDetails.officeOpenTime}</Typography>
                                                    </div> : <Typography>NA</Typography>}
                                                </Box>
                                            </Box>
                                            <Box className={messages.mikvahDetailInfo}>
                                                <Typography className={messages.mikvahDetailInfoLogo}>
                                                    <ScheduleIcon />
                                                </Typography>
                                                <Box className={messages.mikvahDetailInfoContent}>
                                                    <Typography>
                                                        <strong>{t('businessHoursClosingTime')}</strong>
                                                    </Typography>
                                                    {enterpriseDetails?.officeCloseTime.trim() ? <div><Typography>{enterpriseDetails.officeCloseTime}</Typography>
                                                    </div> : <Typography>NA</Typography>}
                                                </Box>
                                            </Box>
                                        </Grid>
                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            {enterpriseDetails?.enterprisePdfNames && enterpriseDetails?.enterprisePdfNames.length !== 0 && (
                                                <Box className={messages.mikvahDetailInfo}>
                                                    <Typography className={messages.mikvahDetailInfoLogo}>
                                                        <AttachFileIcon />
                                                    </Typography>
                                                    <Box className={messages.mikvahDetailInfoContent}>
                                                        <Typography sx={{ mb: 2 }}>
                                                            <strong>{t('filesOfInformationAndCertificates')}</strong>
                                                        </Typography>
                                                        <Box className={classNames.enterpriseDetailPdfBox}>
                                                            {enterpriseDetails.enterprisePdfNames.map((pdfUrl, index) => (
                                                                <div key={index} className={`${classNames.enterprisePdfThumbnail} ${classNames.enterpriseDetailPdfThumbnail}`} onClick={() => handleItemClick(pdfUrl)}>
                                                                    <Tooltip title={getShortPdfName(pdfUrl)} arrow>
                                                                        <Typography className={classNames.enterprisePdfName}>
                                                                            {getShortPdfName(pdfUrl)}
                                                                        </Typography>
                                                                    </Tooltip>
                                                                </div>
                                                            ))}
                                                        </Box>
                                                        <PdfModal isOpen={Boolean(selectedPdf)} onClose={closePdfModal} pdfUrl={selectedPdf} isPdf={selectedPdf?.toLowerCase().endsWith('.pdf')} />
                                                    </Box>
                                                </Box>
                                            )}
                                        </Grid>
                                    </Grid>
                                ) : loadingDetails ? (
                                    <Typography>{t('loading')}</Typography>
                                ) : (
                                    <Typography>{messages.mikvahDetailsNotFound}</Typography>
                                )}
                            </Box>
                            <Box sx={{ margin: 1 }}>
                                <Box className={messages.closeButtonCls}>
                                    {showMap && (
                                        <Button variant={messages.buttonContainedVarient} onClick={handleCloseMap}>
                                            <CloseIcon />
                                        </Button>
                                    )}
                                </Box>
                                {isLoaded && showMap && (
                                    <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={15}>
                                        {response && (
                                            <DirectionsRenderer
                                                directions={response}
                                                options={{
                                                    polylineOptions: {
                                                        strokeColor: messages.colorBlue,
                                                        strokeOpacity: 0.7,
                                                        strokeWeight: 5,
                                                    }
                                                }}
                                            />
                                        )}
                                        {shouldFetchDirections && origin && destination && (
                                            <DirectionsService
                                                options={{
                                                    destination: destination,
                                                    origin: origin,
                                                    travelMode: messages.travelMode,
                                                    provideRouteAlternatives: true
                                                }}
                                                callback={directionsCallback}
                                            />
                                        )}
                                        {origin && (
                                            <Marker position={{ lat: parseFloat(origin.split(',')[0]), lng: parseFloat(origin.split(',')[1]) }} />
                                        )}
                                        {destination && (
                                            <Marker position={{ lat: parseFloat(destination.split(',')[0]), lng: parseFloat(destination.split(',')[1]) }} />
                                        )}
                                    </GoogleMap>
                                )}
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </>
        );
    };

    return (
        <Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>{t('name')}</TableCell>
                            <TableCell>{t('address')}</TableCell>
                            <TableCell>{t('location')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {answer?.enterpriseLocation && answer?.enterpriseLocation?.map((row) => (
                            <Row key={row.id} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default EnterpriseDetailList;
