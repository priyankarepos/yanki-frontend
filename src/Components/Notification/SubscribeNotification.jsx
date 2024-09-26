import { Box, Button, CircularProgress, InputLabel, Paper, Snackbar, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Multiselect from 'multiselect-react-dropdown';
import axios from 'axios';
import "./SubscribeNotification.scss";
import ReminderNotification from '../ReminderNotification/ReminderNotification';
import { useTranslation } from 'react-i18next';
import { apiUrls } from '../../Utils/stringConstant/stringConstant';

const SubscribeNotification = ({ answer }) => {
    const { t } = useTranslation();
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
    const [isSubscribeLoading, setIsSubscribeLoading] = useState(false);
    const [isUnsubscribeLoading, setIsUnsubscribeLoading] = useState(false);

    const yankiUser = JSON.parse(window.localStorage.getItem(import.meta.env.VITE_APP_LOCALSTORAGE_TOKEN) || '{}');
    const userRoles = yankiUser?.userObject?.userRoles || '';
    useEffect(() => {
        const yankiUser = window.localStorage.getItem(import.meta.env.VITE_APP_LOCALSTORAGE_TOKEN);
        if (yankiUser) {
            const parsedUserObject = JSON.parse(yankiUser);
            setUserId(parsedUserObject?.userObject?.userId || '');
        }
    }, []);
    useEffect(() => {
        const fetchEventLocations = async () => {
            try {
                const response = await axios.get(apiUrls.getEventsLocations);
                setEventLocations(response.data);
            } catch (error) {
                setSnackbarMessage(t('errorFetchingEventLocation') + error);
                setSnackbarOpen(true);
            }
        };

        fetchEventLocations();
    }, []);
    useEffect(() => {
        const fetchEventPublicationArea = async () => {
            try {
                const response = await axios.get(apiUrls.getEventsPublicationAreas);
                setPublicationArea(response.data);
            } catch (error) {
                setSnackbarMessage(t('errorFetchingPublicationArea') + error);
                setSnackbarOpen(true);
            }
        };

        fetchEventPublicationArea();
    }, []);
    useEffect(() => {
        const fetchEventTypes = async () => {
            try {
                const response = await axios.get(apiUrls.getEventsTypes);
                setEventTypes(response.data);
            } catch (error) {
                setSnackbarMessage(t('errorFetchingEventTypes') + error);
                setSnackbarOpen(true);
            }
        };

        fetchEventTypes();
    }, []);

    useEffect(() => {
        const fetchSubscribeNotification = async () => {
            try {
                const yankiUser = window.localStorage.getItem(import.meta.env.VITE_APP_LOCALSTORAGE_TOKEN);
                let userId = '';

                if (yankiUser) {
                    const parsedUserObject = JSON.parse(yankiUser);
                    userId = parsedUserObject?.userObject?.userId || '';
                }

                const response = await axios.get(apiUrls.getUserSubscriptionById(userId));

                setSubscribeNotification(response.data);
            } catch (error) {
                setSnackbarMessage(t('noDataAvailable'));
                setSnackbarOpen(false);
            }
        };

        fetchSubscribeNotification();
    }, [userId]);

    const { control, handleSubmit, setValue, reset } = useForm();

    const onSubmit = async (data) => {
        try {
            setIsSubscribeLoading(true);
            const addSubscriptionData = {
                userId: userId,
                eventLocation: data.locations.map(item => item.name),
                eventPublicationArea: data.publicationArea.map(item => item.name),
                eventType: data.eventTypes.map(item => item.name),
                isSubscribeToEvent: true
            };
            const addSubscriptionResponse = await axios.post(apiUrls.addSubscriptionUrl, addSubscriptionData);

            if (addSubscriptionResponse.status === 200) {
                setSnackbarMessage(t('yourSubscriptionHasBeenAddedSuccessfully'));
                setSnackbarOpen(true);
                window.location.reload();
            } else {
                setSnackbarMessage(t('failedToAddSubscription'));
                setSnackbarOpen(true);
            }

        } catch (error) {
            setSnackbarMessage(t('errorAddingSubscription'), error);
            setSnackbarOpen(true);
        } finally {
            setIsSubscribeLoading(false);
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
            const updateSubscriptionResponse = await axios.put(apiUrls.updateEventSubscription(subscribeNotification?.subscriptionId), updateSubscriptionData);

            if (updateSubscriptionResponse.status === 200) {
                setSnackbarMessage(t('yourSubscriptionHasBeenUpdatedSuccessfully'));
                setSnackbarOpen(true);
                window.location.reload();
            } else {
                setSnackbarMessage(t('failedToUpdateSubscription'));
                setSnackbarOpen(true);
            }

        } catch (error) {
            setSnackbarMessage(t('errorUpdatingSubscription') + error);
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
            setIsUnsubscribeLoading(true);
            const apiUrl = apiUrls.deleteSubscription(subscribeNotification?.subscriptionId);
            const deleteSubscriptionResponse = await axios.delete(apiUrl);
            if (deleteSubscriptionResponse.status === 200) {
                setSnackbarMessage(t('yourRequestHasBeenUnsubscribedSuccessfully'));
                setSnackbarOpen(true);
                reset();
                window.location.reload();
            } else {
                setSnackbarMessage(t('failedToDeleteSubscription'));
                setSnackbarOpen(true);
            }
        } catch (error) {
            setSnackbarMessage(t('errorDeletingSubscription'), error);
            setSnackbarOpen(true);
        } finally {
            setIsUnsubscribeLoading(false);
        }
    };

    return (
        <Box sx={{ mb: 2 }}>
            <Paper className={userRoles === "Enterprise" ? "notification-wrapper-light" : "notification-wrapper"} elevation={3}>
                <Typography variant="body2" color="textSecondary">
                    {answer?.message}
                </Typography>
                <form onSubmit={subscribeNotification !== null ? handleSubmit(handleUpdate) : handleSubmit(onSubmit)}>
                    <div container spacing={3}>
                        <div sx={{ mt: 2 }}>
                            <Typography variant="h6">{t('selectYourNotificationsPreferences')}</Typography>
                        </div>
                        <div className='notification-margin-bottom'>
                            <InputLabel>{t('location')}</InputLabel>
                            <Controller
                                control={control}
                                name="locations"
                                defaultValue={[]}
                                render={({ field }) => (
                                    <div>
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
                                            placeholder={t('selectText')}
                                        />
                                    </div>
                                )}
                            />
                        </div>
                        <div className='notification-margin-bottom'>
                            <InputLabel>{t('publicationArea')}</InputLabel>
                            <Controller
                                control={control}
                                name="publicationArea"
                                defaultValue={[]}
                                render={({ field }) => (
                                    <div>
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
                                            placeholder={t('selectText')}
                                        />
                                    </div>
                                )}
                            />
                        </div>
                        <div className='notification-margin-bottom'>
                            <InputLabel>{t('eventType')}</InputLabel>
                            <Controller
                                control={control}
                                name="eventTypes"
                                defaultValue={[]}
                                render={({ field }) => (
                                    <div>
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
                                            placeholder={t('selectText')}
                                        />
                                    </div>
                                )}
                            />
                        </div>
                        <div className='notification-button'>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isSubscribeLoading || !(isSelectedLocations || isSelectedPublicationArea || isSelectedEventTypes)}
                            >
                                {isSubscribeLoading || isLoading ? (
                                    <CircularProgress size={24} className='notification-button-loader' />
                                ) : (
                                    subscribeNotification ? t('update') : t('subscribe')
                                )}
                            </Button>

                            <Button sx={{ mx: 1 }} variant="contained" color="error" onClick={handleUnsubscribe} disabled={!subscribeNotification || (subscribeNotification.isSubscribeToEvent === false) || isUnsubscribeLoading}>
                                {isUnsubscribeLoading ? (
                                    <CircularProgress size={24} className='notification-button-loader' />
                                ) : (
                                    t('unsubscribe')
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
