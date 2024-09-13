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
import { Context } from '../../App';
import { classNames, sourceSelectionStrings } from '../../Utils/stringConstant/stringConstant';

const DeleteAccountConfirmDialog = ({
    open,
    handleClose,
    handleConfirm,
    loading,
    confirmationTitle,
}) => {
    const { t } = useTranslation();
    const { activeTab } = React.useContext(Context);

    return (
        <Box className={classNames.deleteAccountDialogContainer}>
            <Dialog open={open} onClose={handleClose} className={classNames.accountDeleteConfirmDialog}>
                <DialogTitle className={`${classNames.confirmDialogTitle} ${activeTab === 1 && classNames.confirmDialogLightHeading}`}>
                    {!confirmationTitle ? t('confirmDeletionTitle') : confirmationTitle}
                </DialogTitle>
                <DialogContent className={classNames.confirmDialogContent}>
                    <DialogContentText className={`${classNames.confirmDialogText} ${activeTab === 1 && classNames.confirmDialogLightHeading}`}>
                    {t('beforeYouGo')}
                    </DialogContentText>
                    <DialogContentText className={classNames.confirmDialogTextOne}>
                    {t('feedbackRequest')}
                    </DialogContentText>
                    <DialogContentText className={`${classNames.confirmDialogText} ${activeTab === 1 && classNames.confirmDialogLightHeading}`}>
                    {t('accountDeletionDetailsTitle')}
                    </DialogContentText>
                    <div className={classNames.confirmDialogTextOne}>
                        <ul>
                            <li><FiberManualRecordIcon fontSize={sourceSelectionStrings.small} /> {t('accountDeletionDetail1')}</li>
                            <li><FiberManualRecordIcon fontSize={sourceSelectionStrings.small} /> {t('accountDeletionDetail2')}</li>
                        </ul>
                    </div>
                </DialogContent>
                <DialogActions className={classNames.confirmDialogActions}>
                    <Button className={`${classNames.confirmDeleteButton} ${activeTab === 1 && classNames.confirmDeleteLightButton}`} onClick={handleConfirm} color="error" disabled={loading}>
                        {loading ? <CircularProgress size={24} className={classNames.loadingSpinner} /> : `${t('deleteButton')}`}
                    </Button>
                    <Button className={classNames.confirmCancelButton} onClick={handleClose}>
                        {t('cancelButton')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DeleteAccountConfirmDialog;
