import { Paper, Typography } from '@mui/material';
import React from 'react';
import { messages } from '../../Utils/stringConstant/stringConstant';

const EnterpriseEventMsg = () => {

    return (
        <>
            <Paper elevation={3} sx={{ p: 2 }}>
                <Typography>{messages.enterpriseEventMsg}</Typography>
            </Paper>
        </ >

    );
};

export default EnterpriseEventMsg;
