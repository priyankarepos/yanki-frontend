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

const DeleteAccountConfirmDialog = ({
    open,
    handleClose,
    handleConfirm,
    loading,
    confirmationTitle,
}) => {
    return (
        <Box className="Delete-account-MuiDialog-container">
            <Dialog open={open} onClose={handleClose} className="confirm-dialog account-delete-confirm-dialog">
                <DialogTitle className="confirm-dialog-title">
                    {!confirmationTitle ? 'Confirm Deletion' : confirmationTitle}
                </DialogTitle>
                <DialogContent className="confirm-dialog-content">
                    <DialogContentText className="confirm-dialog-text confirm-dialog-text-heading ">
                        Before You Go:
                    </DialogContentText>
                    <DialogContentText className="confirm-dialog-text">
                        If there's anything we can do to improve or if you have any feedback, please let us know. Your input is valuable and helps us make Yanki better for everyone.
                    </DialogContentText>
                    <DialogContentText className="confirm-dialog-text confirm-dialog-text-heading">
                        Account Deletion Details:
                    </DialogContentText>
                    <div className="confirm-dialog-text">
                        <ul>
                            <li><FiberManualRecordIcon fontSize="small" /> Your account and all associated data, including your subscription, will be permanently deleted.</li>
                            <li><FiberManualRecordIcon fontSize="small" /> This action cannot be undone.</li>
                        </ul>
                    </div>
                </DialogContent>
                <DialogActions className="confirm-dialog-actions">
                    <Button className="confirm-delete-button" onClick={handleConfirm} color="error" disabled={loading}>
                        {loading ? <CircularProgress size={24} className="loading-spinner" /> : 'Delete'}
                    </Button>
                    <Button className="confirm-cancel-button" onClick={handleClose}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DeleteAccountConfirmDialog;
