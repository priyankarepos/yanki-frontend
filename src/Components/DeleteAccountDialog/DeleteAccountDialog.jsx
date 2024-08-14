import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { Box, CircularProgress } from '@mui/material';
import './DeleteAccountConfirmDialog.scss';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useTranslation } from 'react-i18next';

const DeleteAccountConfirmDialog = ({
    open,
    handleClose,
    handleConfirm,
    loading,
    confirmationTitle,
}) => {
    const { t } = useTranslation();

    return (
        <Box className="Delete-account-MuiDialog-container">
            <Dialog open={open} onClose={handleClose} className="confirm-dialog account-delete-confirm-dialog">
                <DialogTitle className="confirm-dialog-title">
                    {!confirmationTitle ? t('confirmDeletionTitle') : confirmationTitle}
                </DialogTitle>
                <DialogContent className="confirm-dialog-content">
                    <DialogContentText className="confirm-dialog-text confirm-dialog-text-heading ">
                    {t('beforeYouGo')}
                    </DialogContentText>
                    <DialogContentText className="confirm-dialog-text">
                    {t('feedbackRequest')}
                    </DialogContentText>
                    <DialogContentText className="confirm-dialog-text confirm-dialog-text-heading">
                    {t('accountDeletionDetailsTitle')}
                    </DialogContentText>
                    <div className="confirm-dialog-text">
                        <ul>
                            <li><FiberManualRecordIcon fontSize="small" /> {t('accountDeletionDetail1')}</li>
                            <li><FiberManualRecordIcon fontSize="small" /> {t('accountDeletionDetail2')}</li>
                        </ul>
                    </div>
                </DialogContent>
                <DialogActions className="confirm-dialog-actions">
                    <Button className="confirm-delete-button" onClick={handleConfirm} color="error" disabled={loading}>
                        {loading ? <CircularProgress size={24} className="loading-spinner" /> : `${t('deleteButton')}`}
                    </Button>
                    <Button className="confirm-cancel-button" onClick={handleClose}>
                        {t('cancelButton')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DeleteAccountConfirmDialog;
