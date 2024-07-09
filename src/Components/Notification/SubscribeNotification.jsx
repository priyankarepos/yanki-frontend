import { Box, Button, CircularProgress, InputLabel, Paper, Snackbar, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Multiselect from 'multiselect-react-dropdown';
import axios from 'axios';
import "./SubscribeNotification.scss";
import ReminderNotification from '../ReminderNotification/ReminderNotification';

const SubscribeNotification = ({ answer }) => {
    const [eventLocations, setEventLocations] = useState([]);
    const [publicationArea, setPublicationArea] = useState([]);
    const [subscribeNotification, setSubscribeNotification] = useState(null);
    const [eventTypes, setEventTypes] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState('');
    const [isSelectedLocations, setIsSelectedLocations] = useState(false);
    const [isSelectedPublicationArea, setIsSelectedPublicationArea] = useState(false);
    const [isSelectedEventTypes, setIsSelectedEventTypes] = useState(false);

    const yankiUser = JSON.parse(window.localStorage.getItem(process.env.REACT_APP_LOCALSTORAGE_TOKEN) || '{}');
    const userRoles = yankiUser?.userObject?.userRoles || '';
    useEffect(() => {
        const yankiUser = window.localStorage.getItem(process.env.REACT_APP_LOCALSTORAGE_TOKEN);
        if (yankiUser) {
            const parsedUserObject = JSON.parse(yankiUser);
            setUserId(parsedUserObject?.userObject?.userId || '');
        }
    }, []);
    useEffect(() => {
        const fetchEventLocations = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/event-location/get-events-locations`);
                setEventLocations(response.data);
            } catch (error) {
                setSnackbarMessage('Error fetching event location:', error);
                setSnackbarOpen(true);
            }
        };

        fetchEventLocations();
    }, []);
    useEffect(() => {
        const fetchEventPublicationArea = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/event-publication-area/get-events-publicationAreas`);
                setPublicationArea(response.data);
            } catch (error) {
                setSnackbarMessage('Error fetching publication area:', error);
                setSnackbarOpen(true);
            }
        };

        fetchEventPublicationArea();
    }, []);
    useEffect(() => {
        const fetchEventTypes = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/event-type/get-events-types`);
                setEventTypes(response.data);
            } catch (error) {
                setSnackbarMessage('Error fetching event types:', error);
                setSnackbarOpen(true);
            }
        };

        fetchEventTypes();
    }, []);

    useEffect(() => {
        const fetchSubscribeNotification = async () => {
            try {
                const yankiUser = window.localStorage.getItem(process.env.REACT_APP_LOCALSTORAGE_TOKEN);
                let userId = '';

                if (yankiUser) {
                    const parsedUserObject = JSON.parse(yankiUser);
                    userId = parsedUserObject?.userObject?.userId || '';
                }

                const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/event-subscription/get-user-subscriptionById?userId=${userId}`);

                setSubscribeNotification(response.data);
            } catch (error) {
                setSnackbarMessage('No data available', error);
                setSnackbarOpen(true);
            }
        };

        fetchSubscribeNotification();
    }, [userId]);

    const { control, handleSubmit, setValue, reset } = useForm();

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            const addSubscriptionData = {
                userId: userId,
                eventLocation: data.locations.map(item => item.name),
                eventPublicationArea: data.publicationArea.map(item => item.name),
                eventType: data.eventTypes.map(item => item.name),
                isSubscribeToEvent: true
            };
            const addSubscriptionUrl = `${process.env.REACT_APP_API_HOST}/api/event-subscription/add-subscription`;
            const addSubscriptionResponse = await axios.post(addSubscriptionUrl, addSubscriptionData);

            if (addSubscriptionResponse.status === 200) {
                setSnackbarMessage('Your subscription has been added successfully');
                setSnackbarOpen(true);
                window.location.reload();
            } else {
                setSnackbarMessage('Failed to add subscription');
                setSnackbarOpen(true);
            }

        } catch (error) {
            setSnackbarMessage('Error adding subscription:', error);
            setSnackbarOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (subscribeNotification) {
            setValue('locations', subscribeNotification.eventLocation ? subscribeNotification.eventLocation.flatMap(location => location.split(',')).map(location => ({ name: location })) : []);
            setValue('publicationArea', subscribeNotification.eventPublicationArea ? subscribeNotification.eventPublicationArea.flatMap(area => area.split(',')).map(area => ({ name: area })) : []);
            setValue('eventTypes', subscribeNotification.eventType ? subscribeNotification.eventType.flatMap(area => area.split(',')).map(area => ({ name: area })) : []);
        }
    }, [setValue, subscribeNotification]);

    const handleUpdate = async (data) => {
        try {
            setIsLoading(true);
            const updateSubscriptionData = {
                eventLocation: data.locations.map(item => item.name),
                eventPublicationArea: data.publicationArea.map(item => item.name),
                eventType: data.eventTypes.map(item => item.name),
                isSubscribeToEvent: true
            };

            const apiUrl = `${process.env.REACT_APP_API_HOST}/api/event-subscription/update-event-subscription?subscriptionId=${subscribeNotification?.subscriptionId}`;
            const updateSubscriptionResponse = await axios.put(apiUrl, updateSubscriptionData);

            if (updateSubscriptionResponse.status === 200) {
                setSnackbarMessage('Your subscription has been updated successfully');
                setSnackbarOpen(true);
                window.location.reload();
            } else {
                setSnackbarMessage('Failed to update subscription');
                setSnackbarOpen(true);
            }

        } catch (error) {
            setSnackbarMessage('Error updating subscription:', error);
            setSnackbarOpen(true);
        } finally {
            setIsLoading(false);
        }
    };


    const onSelectLocations = (selectedList) => {
        setValue("locations", selectedList);
    };

    const onRemoveLocations = (selectedList) => {
        setValue("locations", selectedList);
    };

    const onSelectEventTypes = (selectedList) => {
        setValue("eventTypes", selectedList);
    };

    const onRemoveEventTypes = (selectedList) => {
        setValue("eventTypes", selectedList);
    };

    const onSelectPublicationArea = (selectedList) => {
        setValue("publicationArea", selectedList);
    };

    const onRemovePublicationArea = (selectedList) => {
        setValue("publicationArea", selectedList);
    };

    const handleUnsubscribe = async (data) => {
        try {
            setIsLoading(true);

            // Define the API URL with the subscriptionId as a query parameter
            const apiUrl = `${process.env.REACT_APP_API_HOST}/api/event-subscription/delete-subscription?subscriptionId=${subscribeNotification?.subscriptionId}`;

            // Make the DELETE request
            const deleteSubscriptionResponse = await axios.delete(apiUrl);

            // Check if the request was successful
            if (deleteSubscriptionResponse.status === 200) {
                setSnackbarMessage('Your request has been unsubscribed successfully');
                setSnackbarOpen(true);
                reset();
                window.location.reload();
            } else {
                setSnackbarMessage('Failed to delete subscription');
                setSnackbarOpen(true);
            }
        } catch (error) {
            setSnackbarMessage('Error deleting subscription:', error);
            setSnackbarOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{mb:2}}>
            <Paper className={userRoles === "Enterprise" ? "notification-wrapper-light" : "notification-wrapper"} elevation={3}>
                <Typography variant="body2" color="textSecondary">
                    {answer?.message}
                </Typography>
                <form onSubmit={subscribeNotification !== null ? handleSubmit(handleUpdate) : handleSubmit(onSubmit)}>
                    <div container spacing={3}>
                        <div sx={{ mt: 2 }}>
                            <Typography variant="h6">Select Your Notifications Preferences</Typography>
                        </div>
                        <div className='notification-margin-bottom'>
                            <InputLabel>Location</InputLabel>
                            <Controller
                                control={control}
                                name="locations"
                                defaultValue={[]}
                                render={({ field }) => (
                                    <>
                                        <Multiselect
                                            options={eventLocations.map(location => ({
                                                name: location.eventLocationName,
                                                id: location.id,
                                            }))}
                                            selectedValues={field.value}
                                            onSelect={(selectedList) => {
                                                onSelectLocations(selectedList);
                                                setIsSelectedLocations(true);
                                                field.onChange(selectedList);
                                            }}
                                            onRemove={(selectedList) => {
                                                onRemoveLocations(selectedList);
                                                setIsSelectedLocations(false)
                                                field.onChange(selectedList);
                                            }}
                                            displayValue="name"
                                        />
                                    </>
                                )}
                            />
                        </div>
                        <div className='notification-margin-bottom'>
                            <InputLabel>Publication Area</InputLabel>
                            <Controller
                                control={control}
                                name="publicationArea"
                                defaultValue={[]}
                                render={({ field }) => (
                                    <>
                                        <Multiselect
                                            options={publicationArea.map(item => ({
                                                name: item.eventPublicationAreaName,
                                                id: item.id,
                                            }))}
                                            selectedValues={field.value}
                                            onSelect={(selectedList) => {
                                                onSelectPublicationArea(selectedList);
                                                field.onChange(selectedList);
                                                setIsSelectedPublicationArea(true);
                                            }}
                                            onRemove={(selectedList) => {
                                                onRemovePublicationArea(selectedList);
                                                setIsSelectedPublicationArea(false);
                                                field.onChange(selectedList);
                                            }}
                                            displayValue="name"
                                        />
                                    </>
                                )}
                            />
                        </div>
                        <div className='notification-margin-bottom'>
                            <InputLabel>Event Type</InputLabel>
                            <Controller
                                control={control}
                                name="eventTypes"
                                defaultValue={[]}
                                render={({ field }) => (
                                    <>
                                        <Multiselect
                                            options={eventTypes.map(item => ({
                                                name: item.eventTypeName,
                                                id: item.id,
                                            }))}
                                            selectedValues={field.value}
                                            onSelect={(selectedList) => {
                                                onSelectEventTypes(selectedList);
                                                setIsSelectedEventTypes(true);
                                                field.onChange(selectedList);
                                            }}
                                            onRemove={(selectedList) => {
                                                onRemoveEventTypes(selectedList);
                                                setIsSelectedEventTypes(false);
                                                field.onChange(selectedList);
                                            }}
                                            displayValue="name"
                                        />
                                    </>
                                )}
                            />
                        </div>
                        <div className='notification-button'>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isLoading || !(isSelectedLocations || isSelectedPublicationArea || isSelectedEventTypes) }
                            >
                                {isLoading ? (
                                    <CircularProgress size={24} className='notification-button-loader'/>
                                ) : (
                                    subscribeNotification ? "Update" : "Subscribe"
                                )}
                            </Button>

                            <Button sx={{ mx: 1 }} variant="contained" color="error" onClick={handleUnsubscribe} disabled={!subscribeNotification || (subscribeNotification.isSubscribeToEvent === false)}>
                                {isLoading ? (
                                    <CircularProgress size={24} className='notification-button-loader'/>
                                ) : (
                                   "Unsubscribe"
                                )}
                            </Button>
                            
                        </div>
                    </div>
                </form>

            </Paper>
            <Box className={userRoles === "Enterprise" ? "notification-wrapper-light reminder-wrapper-light" : "notification-wrapper reminder-wrapper"}>
                <div className='ReminderNotification'><ReminderNotification /></div>
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </Box >

    );
};

export default SubscribeNotification;
