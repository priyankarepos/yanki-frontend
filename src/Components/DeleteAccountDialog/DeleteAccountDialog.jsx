import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { CircularProgress } from '@mui/material';
import './DeleteAccountConfirmDialog.scss';

const DeleteAccountConfirmDialog = ({
    open,
    handleClose,
    handleConfirm,
    loading,
    confirmationTitle,
}) => {
    return (
        <Dialog open={open} onClose={handleClose} className="confirm-dialog">
            <DialogTitle className="confirm-dialog-title">
                {!confirmationTitle ? 'Confirm Deletion' : confirmationTitle}
            </DialogTitle>
            <DialogContent className="confirm-dialog-content">
                <DialogContentText className="confirm-dialog-text">
                    Before You Go:
                </DialogContentText>
                <DialogContentText className="confirm-dialog-text">
                    If there's anything we can do to improve or if you have any feedback, please let us know. Your input is valuable and helps us make Yanki better for everyone.
                </DialogContentText>
                <DialogContentText className="confirm-dialog-text">
                    Account Deletion Details:
                </DialogContentText>
                <DialogContentText className="confirm-dialog-text">
                    <ul>
                        <li>Your account and all associated data, including your subscription, will be permanently deleted.</li>
                        <li>This action cannot be undone.</li>
                    </ul>
                </DialogContentText>
            </DialogContent>
            <DialogActions className="confirm-dialog-actions">
                <Button className="confirm-cancel-button" onClick={handleClose}>
                    Cancel
                </Button>
                <Button className="confirm-delete-button" onClick={handleConfirm} color="error" disabled={loading}>
                    {loading ? <CircularProgress size={24} className="loading-spinner" /> : 'Delete'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteAccountConfirmDialog;
