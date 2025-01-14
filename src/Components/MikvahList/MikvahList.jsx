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
    Home,
    Business,
    Phone,
    Schedule,
    LocationOn as LocationOnIcon,
    Person as PersonIcon,
    PanToolAlt as PanToolAltIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
    Close as CloseIcon,
} from "@mui/icons-material";
import "../../Pages/NewHomePageMui/NewHomePageStyle.scss";
import "./MikvahAnswer.scss";
import { apiUrls, mapContainerStyle, messages } from "../../Utils/stringConstant/stringConstant";
import { Context } from "../../App";
import { useJsApiLoader } from "@react-google-maps/api";
import {
    GoogleMap,
    DirectionsService,
    DirectionsRenderer,
    Marker,
} from "@react-google-maps/api";
import { useTranslation } from "react-i18next";

const MikvahAnswer = ({ answer }) => {
    const { t } = useTranslation();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const { activeTab, userLatitude, userLongitude, isLocationAllowed } = useContext(Context);
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY,
    });

    const Row = ({ row }) => {
        const [openDetails, setOpenDetails] = useState(false);
        const [mikvahDetails, setMikvahDetails] = useState(null);
        const [response, setResponse] = useState(null);
        const [origin, setOrigin] = useState('');
        const [destination, setDestination] = useState('');
        const [shouldFetchDirections, setShouldFetchDirections] = useState(false);
        const [showMap, setShowMap] = useState(false);
        const [loadingDetails, setLoadingDetails] = useState(false);

        useEffect(() => {
            if (isLocationAllowed === messages.locationAllowed && open && !origin) {
                checkPermissionsAndFetchLocation();
            }
        }, [isLocationAllowed, open, origin]);

        const fetchMikvahDetails = async () => {
            setLoadingDetails(true);
            try {
                const response = await axios.get(apiUrls.mikvahDetails, { params: { mikvahId: row.id } });
                setMikvahDetails(response.data);
            } catch (error) {
                setSnackbarMessage(`${t('errorFetchingMikvahDetails')}`);
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
                    fetchMikvahDetails();
                } else {
                    setShowMap(false);
                }
                return newOpen;
            });
        };
        const handleLocationIconClick = () => {
            if (isLocationAllowed === messages.locationAllowed) {
                if (!openDetails) {
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
                    <TableCell onClick={handleShowDetails} sx={{ cursor: messages.cursorPointer }}>
                        <p>{openDetails ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}</p>
                    </TableCell>
                    <TableCell onClick={handleShowDetails} sx={{ cursor: messages.cursorPointer }}>
                        <Tooltip title={row.name}>
                            <span>{row.name ? row.name : messages.notAvailable}</span>
                        </Tooltip>
                    </TableCell>
                    <TableCell onClick={handleShowDetails} sx={{ cursor: messages.cursorPointer }}>
                        <Tooltip title={row.address.trim() || messages.notAvailable}>
                            <div className={messages.govadenAnswerTooltip}>
                                {row.address.trim() ? row.address : messages.notAvailable}
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
                                {mikvahDetails ? (
                                    <Grid container spacing={2}>
                                        <Grid item lg={6} md={6} sm={6} xs={12}>
                                            <Box className={messages.mikvahDetailInfo}>
                                                <Typography className={messages.mikvahDetailInfoLogo}>
                                                    <Home />
                                                </Typography>
                                                <Box className={messages.mikvahDetailInfoContent}>
                                                    <Typography>
                                                        <strong>{t('address')}:</strong>
                                                    </Typography>
                                                    <Typography>
                                                        {mikvahDetails?.result?.address?.trim() ? mikvahDetails.result.address : messages.notAvailable}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box className={messages.mikvahDetailInfo}>
                                                <Typography className={messages.mikvahDetailInfoLogo}>
                                                    <Phone />
                                                </Typography>
                                                <Box className={messages.mikvahDetailInfoContent}>
                                                    <Typography>
                                                        <strong>{t('phone')}</strong>
                                                    </Typography>
                                                    {mikvahDetails?.result?.phone1?.trim() ? <div><Typography>{mikvahDetails.result.phone1}</Typography>
                                                        <Typography>{mikvahDetails.result.phone2}</Typography></div> : <Typography>NA</Typography>}
                                                </Box>
                                            </Box>
                                            <Box className={messages.mikvahDetailInfo}>
                                                <Typography className={messages.mikvahDetailInfoLogo}>
                                                    <PersonIcon />
                                                </Typography>
                                                <Box className={messages.mikvahDetailInfoContent}>
                                                    <Typography>
                                                        <strong>{t('contact')}</strong>
                                                    </Typography>
                                                    <Typography>{mikvahDetails?.result?.contact ? mikvahDetails.result.contact : messages.notAvailable}</Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                        <Grid item lg={6} md={6} sm={6} xs={12}>
                                            <Box className={messages.mikvahDetailInfo}>
                                                <Typography className={messages.mikvahDetailInfoLogo}>
                                                    <Business />
                                                </Typography>
                                                <Box className={messages.mikvahDetailInfoContent}>
                                                    <Typography>
                                                        <strong>{t('shul')}</strong>
                                                    </Typography>
                                                    <Typography>{mikvahDetails?.result?.shul?.trim() ? mikvahDetails.result.shul : messages.notAvailable}</Typography>
                                                </Box>
                                            </Box>
                                            <Box className={messages.mikvahDetailInfo}>
                                                <Typography className={messages.mikvahDetailInfoLogo}>
                                                    <PanToolAltIcon />
                                                </Typography>
                                                <Box className={messages.mikvahDetailInfoContent}>
                                                    <Typography>
                                                        <strong>{t('type')}</strong>
                                                    </Typography>
                                                    <Typography>{mikvahDetails?.result?.type?.trim() ? mikvahDetails.result.type : messages.notAvailable}</Typography>
                                                </Box>
                                            </Box>
                                            <Box className={messages.mikvahDetailInfo}>
                                                <Typography className={messages.mikvahDetailInfoLogo}>
                                                    <Schedule />
                                                </Typography>
                                                <Box className={messages.mikvahDetailInfoContent}>
                                                    <Typography>
                                                        <strong>{t('schedule')}</strong>
                                                    </Typography>
                                                    <Typography>{mikvahDetails?.result?.schedule?.trim() ? mikvahDetails.result.schedule : messages.notAvailable}</Typography>
                                                </Box>
                                            </Box>

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
                        {answer?.mikvahSearchResponse?.result && answer?.mikvahSearchResponse?.result.map((row) => (
                            <Row key={row.id} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default MikvahAnswer;
