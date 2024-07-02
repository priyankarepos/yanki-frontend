import React, { useState } from 'react';
import { questions } from '../../Utils/promptData/InterectiveQuestions';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import "./InteractiveQuestionnaire.scss";

const InteractiveQuestionnaire = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState(Array(questions.length).fill(""));
    const [showThankYou, setShowThankYou] = useState(false);

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setShowThankYou(true);
        }
    };

    const handleResponseChange = (e) => {
        const updatedResponses = [...responses];
        updatedResponses[currentQuestionIndex] = e.target.value;
        setResponses(updatedResponses);
    };

    return (
        <Paper sx={{ p: 2 }} className='Interactive-Questionnaire-Wrapper'>
            <Typography variant='h6' sx={{ pb: 2 }}>Interactive Questionnaire</Typography>
            {currentQuestionIndex === 0 && (
                <Typography sx={{ pb: 2 }} className='Interactive-Questionnaire-Msg'>
                    This questionnaire is designed to help you gain a better understanding of your situation and take the best decision. Your responses have no impact on the context, and are not stored.
                </Typography>
            )}
            {!showThankYou && <Box className='Interactive-Questionnaire-Content'>
                <Box className='Interactive-Questionnaire'>
                    <Typography className='Interactive-Questionnaire-A'>{currentQuestionIndex + 1}. {questions[currentQuestionIndex].Question_A}</Typography>
                    <Typography className='Interactive-Questionnaire-B'>{questions[currentQuestionIndex].Question_B}</Typography>
                    <TextField
                        type="text"
                        value={responses[currentQuestionIndex]}
                        onChange={handleResponseChange}
                    />
                </Box>
                {!showThankYou && (
                    <Box className="Interactive-Questionnaire-Btns">
                        <Button
                            variant='outlined'
                            onClick={handleNext}
                            disabled={!responses[currentQuestionIndex]}
                        >
                            Next
                        </Button>
                    </Box>
                )}
            </Box>}
            {showThankYou && (
                <Typography className="Interactive-Questionnaire-margin">
                    You’ve completed the Lashon Hara awareness questionnaire. Remember, striving to speak positively and refraining from Lashon Hara is a significant mitzvah that strengthens our community and personal integrity. If you need halachic guidance or support, use the prompt “Ask a Rabbi”.
                </Typography>
            )}
        </Paper>
    );
};

export default InteractiveQuestionnaire;
