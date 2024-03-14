import { Paper, TextField, Typography, CircularProgress, FormHelperText } from '@mui/material';
import React, { useState } from 'react';
import axios from "axios";
// import "./SafetyChecker.scss"

const PersonalAssistant = ({ answer }) => {
    const [content, setContent] = useState('');
    const [touched, setTouched] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleBlur = () => {
        setTouched(true);
        setContent("");
        setTouched(false);
    };

    const handlePersonalAssistant = () => {
        console.log(content);
    }

    return (
        <Paper sx={{ p : 2 }}>
            <Typography variant='h6'>
                Personal Assistant
            </Typography>
            <Typography>
                Personal Assistant Message Response
            </Typography>
            <TextField
              multiline
              fullWidth
              rows={4}
              margin='normal'
              variant='outlined'
              placeholder="Enter the content here"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              error={touched && !content.trim()}
              onBlur={handleBlur}
            />
            <FormHelperText className='error-message'>
                {touched && !content.trim() && 'This field is required.'}
            </FormHelperText>
            <Typography
                className={`${content.length === 0 ? "Custom-disabled-Button" : "Custom-Button"}`}
                onClick={content.length === 0 ? null : handlePersonalAssistant}
                sx={{ mt: "8px"}}
            >
                {loading ? <CircularProgress size={24} sx={{color:"#1d4a72"}} /> : "Submit"}
            </Typography>
        </Paper>
    );
};

export default PersonalAssistant;
