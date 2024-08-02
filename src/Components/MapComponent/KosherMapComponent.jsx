import React, { useState, useEffect, useContext } from "react";
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
    Button,
    Snackbar,
} from "@mui/material";
import {
    GoogleMap,
    LoadScriptNext,
    DirectionsService,
    DirectionsRenderer,
    Marker
} from '@react-google-maps/api';
import { useJsApiLoader } from "@react-google-maps/api";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseIcon from "@mui/icons-material/Close";
import "./KosherMapComponent.scss";
import { mapContainerStyle, messages } from '../../Utils/stringConstant/stringConstant';
import { Context } from '../../App';

const KosherMapComponent = ({ answer }) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const { userLatitude, userLongitude, isLocationAllowed } = useContext(Context);
    const showEnterpriseName = answer?.enterpriseLocation?.some(location => location.enterpriseName);
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY,
    });

    const Row = ({ location }) => {
        const [open, setOpen] = useState(false);
        const [response, setResponse] = useState(null);
        const [origin, setOrigin] = useState('');
        const [destination, setDestination] = useState('');
        const [shouldFetchDirections, setShouldFetchDirections] = useState(false);
        const [showMap, setShowMap] = useState(false);

        useEffect(() => {
            if (isLocationAllowed && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setOrigin(`${latitude},${longitude}`);
                    },
                    (error) => {
                        setSnackbarMessage(messages.errorFetchingLocation, error);
                        setSnackbarOpen(true);
                    }
                );
            }
        }, []);

        const directionsCallback = (result, status) => {
            if (status === messages.statusOk) {
                setResponse(result);
            } else {
                setSnackbarMessage(`${messages.errorFetchingDirections} ${status}`);
                setSnackbarOpen(true);
                setResponse(null);
            }
            setShouldFetchDirections(false);
        };

        const handleSetDestination = () => {
            setDestination(`${location.latitude},${location.longitude}`);
            setShouldFetchDirections(true);
            setShowMap(true);
            setOpen(!open);
        };

        useEffect(() => {
            if (shouldFetchDirections && origin && destination) {
                setResponse(null);
                setShouldFetchDirections(true);
            }
        }, [shouldFetchDirections, origin, destination]);

        const handleCloseMap = () => {
            setShowMap(false);
            setResponse(null);
            setDestination('');
            setOpen(false);
        };

        const center = { lat: userLatitude, lng: userLongitude };

        return (
            <>
                <TableRow>
                    <TableCell>
                        <p>{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}</p>
                    </TableCell>
                    {showEnterpriseName && <TableCell>{location.enterpriseName}</TableCell>}
                    <TableCell>{location.enterpriseAddress}</TableCell>
                    <TableCell>
                        <Button variant={messages.buttonContainedVarient} onClick={handleSetDestination}>
                            <LocationOnIcon />
                        </Button>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{ py: 0 }} colSpan={6}>
                        <Collapse in={open} unmountOnExit>
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
        <Paper sx={{ p: 2 }}>
            <Box>
                <Typography>{showEnterpriseName && messages.listLocationMsg}</Typography>
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                {showEnterpriseName && <TableCell>{messages.nameText}</TableCell>}
                                <TableCell>{messages.addressText}</TableCell>
                                <TableCell>{messages.locationText}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {answer?.enterpriseLocation && answer?.enterpriseLocation.map((location, index) => (
                                <Row key={index} location={location} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </Paper>
    );
};

export default KosherMapComponent;
