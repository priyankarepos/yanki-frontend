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
} from '@mui/icons-material';
import PanToolAltIcon from '@mui/icons-material/PanToolAlt';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import "../../Pages/NewHomePageMui/NewHomePageStyle.scss";
import "./MikvahAnswer.scss";
import { apiUrls, mapContainerStyle, messages } from "../../Utils/stringConstant/stringConstant";
import PersonIcon from '@mui/icons-material/Person';
import { Context } from "../../App";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useJsApiLoader } from "@react-google-maps/api";
import {
    GoogleMap,
    LoadScriptNext,
    DirectionsService,
    DirectionsRenderer,
    Marker
} from '@react-google-maps/api';
import CloseIcon from "@mui/icons-material/Close";

const MikvahAnswer = ({ answer }) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const { activeTab, userLatitude, userLongitude } = useContext(Context);
    const [isLocationAllowed, setIsLocationAllowed] = useState(false);
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY,
    });

    const Row = ({ row }) => {
        const [open, setOpen] = useState(false);
        const [mikvahDetails, setMikvahDetails] = useState(null);
        const [response, setResponse] = useState(null);
        const [origin, setOrigin] = useState('');
        const [destination, setDestination] = useState('');
        const [shouldFetchDirections, setShouldFetchDirections] = useState(false);
        const [showMap, setShowMap] = useState(false);

        const fetchMikvahDetails = async () => {
            try {
                const response = await axios.get(`${apiUrls.mikvahDetails}`, { params: { mikvahId: row.id } });
                setMikvahDetails(response.data);
            } catch (error) {
                setSnackbarMessage(messages.mikvahDetailsError);
                setSnackbarOpen(true);
            }
        };

        useEffect(() => {
            const checkPermissionsAndFetchLocation = async () => {
                if (navigator.geolocation) {
                    try {
                        const result = await navigator.permissions.query({ name: messages.geolocationText });
                        const permissionGranted = result.state === messages.grantedText;
                        setIsLocationAllowed(permissionGranted);
                        if (permissionGranted) {
                            navigator.geolocation.getCurrentPosition(
                                (position) => {
                                    const { latitude, longitude } = position.coords;
                                    setOrigin(`${latitude},${longitude}`);
                                },
                                () => {
                                    setSnackbarMessage(messages.errorFetchingLocation);
                                    setSnackbarOpen(true);
                                }
                            );
                        }

                        result.onchange = () => setIsLocationAllowed(result.state === messages.grantedText);

                    } catch (error) {
                        setSnackbarMessage(messages.errorCheckLocationPermission, error);
                        setSnackbarOpen(true);
                    }
                }
            };

            checkPermissionsAndFetchLocation();
        }, []);

        const directionsCallback = (result, status) => {
            if (status === messages.statusOk) {
                setResponse(result);
            } else if (status === messages.zeroResultTxt) {
                setSnackbarMessage(messages.noRouteFoundMsg);
                setSnackbarOpen(true);
                setResponse(null);
            } else {
                setSnackbarMessage(`${messages.errorFetchingDirections} ${status}`);
                setSnackbarOpen(true);
                setResponse(null);
            }
            setShouldFetchDirections(false);
        };

        const handleSetDestination = () => {
            handleShowDetails();
            setDestination(`${row.latitude},${row.longitude}`);
            setShouldFetchDirections(true);
            setShowMap(true);
        };

        const locationEnable = () => {
            setSnackbarMessage(`${messages.errorFetchingLocation}`);
            setSnackbarOpen(true);
        }

        const handleShowDetails = () => {
            fetchMikvahDetails();
            setOpen(!open);
            if (open) {
                setShowMap(false);
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
                        <p>{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}</p>
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
                            <Button variant={messages.buttonContainedVarient} onClick={!isLocationAllowed ? locationEnable : handleSetDestination} >
                                <LocationOnIcon />
                            </Button>
                        </Box>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{ py: 0 }} colSpan={6} className={activeTab === 0 && messages.mikvahDetailWrapper}>
                        <Collapse in={open} unmountOnExit>
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
                                                        <strong>Address:</strong>
                                                    </Typography>
                                                    <Typography>
                                                        {mikvahDetails.result.address.trim() ? mikvahDetails.result.address : messages.notAvailable}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box className={messages.mikvahDetailInfo}>
                                                <Typography className={messages.mikvahDetailInfoLogo}>
                                                    <Phone />
                                                </Typography>
                                                <Box className={messages.mikvahDetailInfoContent}>
                                                    <Typography>
                                                        <strong>Phone:</strong>
                                                    </Typography>
                                                    {mikvahDetails.result.phone1.trim() ? <div><Typography>{mikvahDetails.result.phone1}</Typography>
                                                        <Typography>{mikvahDetails.result.phone2}</Typography></div> : <Typography>NA</Typography>}
                                                </Box>
                                            </Box>
                                            <Box className={messages.mikvahDetailInfo}>
                                                <Typography className={messages.mikvahDetailInfoLogo}>
                                                    <PersonIcon />
                                                </Typography>
                                                <Box className={messages.mikvahDetailInfoContent}>
                                                    <Typography>
                                                        <strong>Contact:</strong>
                                                    </Typography>
                                                    <Typography>{mikvahDetails.result.contact ? mikvahDetails.result.contact : messages.notAvailable}</Typography>
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
                                                        <strong>Shul:</strong>
                                                    </Typography>
                                                    <Typography>{mikvahDetails.result.shul.trim() ? mikvahDetails.result.shul : messages.notAvailable}</Typography>
                                                </Box>
                                            </Box>
                                            <Box className={messages.mikvahDetailInfo}>
                                                <Typography className={messages.mikvahDetailInfoLogo}>
                                                    <PanToolAltIcon />
                                                </Typography>
                                                <Box className={messages.mikvahDetailInfoContent}>
                                                    <Typography>
                                                        <strong>Type:</strong>
                                                    </Typography>
                                                    <Typography>{mikvahDetails.result.type.trim() ? mikvahDetails.result.type : messages.notAvailable}</Typography>
                                                </Box>
                                            </Box>
                                            <Box className={messages.mikvahDetailInfo}>
                                                <Typography className={messages.mikvahDetailInfoLogo}>
                                                    <Schedule />
                                                </Typography>
                                                <Box className={messages.mikvahDetailInfoContent}>
                                                    <Typography>
                                                        <strong>Schedule:</strong>
                                                    </Typography>
                                                    <Typography>{mikvahDetails.result.schedule.trim() ? mikvahDetails.result.schedule : messages.notAvailable}</Typography>
                                                </Box>
                                            </Box>

                                        </Grid>
                                    </Grid>
                                ) : (
                                    <Typography>Loading...</Typography>
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
                                    <LoadScriptNext googleMapsApiKey={import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY}>
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
                                    </LoadScriptNext>
                                )}
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </>
        );
    };

    return (
        <div>
            <TableContainer component={Paper}>
                <Table aria-label={messages.collapsibleTable}>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>{messages.nameText}</TableCell>
                            <TableCell>{messages.addressText}</TableCell>
                            <TableCell>{messages.locationText}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {answer?.mikvahSearchResponse?.result && answer?.mikvahSearchResponse?.result.map((row) => (
                            <Row key={row.id} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </div>
    );
};

export default MikvahAnswer;
