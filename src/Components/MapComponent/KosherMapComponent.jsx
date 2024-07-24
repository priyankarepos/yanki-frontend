import React, { useState, useCallback, useContext, useEffect } from 'react';
import { GoogleMap, LoadScriptNext, DirectionsService, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { useJsApiLoader } from "@react-google-maps/api";
import { Context } from '../../App';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, TextField, Snackbar, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';
import "./KosherMapComponent.scss"
import { mapContainerStyle, messages } from '../../Utils/stringConstant/stringConstant';

const KosherMapComponent = ({ answer }) => {

    const [response, setResponse] = useState(null);
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [shouldFetchDirections, setShouldFetchDirections] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const { userLatitude, userLongitude, isLocationAllowed } = useContext(Context);
    const showEnterpriseName = answer?.enterpriseLocation?.some(location => location.enterpriseName);
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    });

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
    }, [isLocationAllowed]);

    const directionsCallback = useCallback((result, status) => {
        if (status === messages.statusOk) {
            setResponse(result);
        } else {
            setSnackbarMessage(`${messages.errorFetchingDirections} ${status}`);
            setSnackbarOpen(true);
            setResponse(null);
        }
        setShouldFetchDirections(false);
    }, []);

    const handleSetDestination = (latitude, longitude) => {
        setDestination(`${latitude},${longitude}`);
        setShouldFetchDirections(true);
        setShowMap(true);
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
    };

    const center = { lat: userLatitude, lng: userLongitude }

    return (
        <Paper sx={{ p: 2 }}>
            <Box>
                <Typography>{showEnterpriseName && messages.listLocationMsg}</Typography>
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {showEnterpriseName && <TableCell>{messages.nameText}</TableCell>}
                                <TableCell>{messages.addressText}</TableCell>
                                <TableCell>{messages.locationText}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {answer?.enterpriseLocation && answer?.enterpriseLocation.map((location, index) => (
                                <TableRow key={index}>
                                    {showEnterpriseName && <TableCell>{location.enterpriseName}</TableCell>}
                                    <TableCell>{location.enterpriseAddress}</TableCell>
                                    <TableCell>
                                        <Button variant={messages.buttonContainedVarient} onClick={() => handleSetDestination(location.latitude, location.longitude)}>
                                            <LocationOnIcon />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Box className={messages.closeButtonCls}>
                {showMap && (
                    <Button variant={messages.buttonContainedVarient} onClick={handleCloseMap}>
                        <CloseIcon />
                    </Button>
                )}
            </Box>
            {isLoaded && showMap && (
                <LoadScriptNext googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
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
            <Box className={messages.mapInputBox}>
                <TextField
                    type={messages.text}
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder={messages.enterOrigin}
                />
                <TextField
                    type={messages.text}
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder={messages.enterDestination}
                />
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
